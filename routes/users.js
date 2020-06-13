var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const async = require('async');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
require('dotenv').config();

var hbs = require('nodemailer-express-handlebars');
var email = process.env.MAILER_EMAIL_ID || 'shailesh941@gmail.com',
pass = process.env.MAILER_PASSWORD || 'anrzihsxygavdrxe',
nodemailer = require('nodemailer');
var path = require('path');

var smtpTransport = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
  auth: {
    user: email,
    pass: pass
  }
});


var handlebarsOptions = {
  viewEngine: {
    extName: 'handlebars',
    partialsDir: path.resolve('templates'),
    layoutsDir: path.resolve('templates'),
    defaultLayout: 'forgot-password-email.html',
  },
  viewPath: path.resolve('templates'),
  extName: '.html',
};

smtpTransport.use('compile', hbs(handlebarsOptions));


router.post('/signup', (req, res, next) => {

  User.find({email:req.body.email}).exec().then(user =>{
    if(user.length >= 1){
      res.status(409).json({
        message:'mail exists'
      })
    }else{
      bcrypt.hash(req.body.password, 10, (err, hash) =>{
        if(err){
          return res.status(500).json({
            error:err
          });
        }else{
          const user = new User({
            _id: new mongoose.Types.ObjectId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateDob:req.body.dateDob,
            email:req.body.email,
            password: hash,
          });
          user.save().then(result =>{
            console.log(result);
             res.status(201).json({
               message:'User created'
             });
          }).catch(err =>{
            console.log(err);
            res.status(500).json({
              error:err
            });
          });
        }
      })
    }
  });
 
});
router.post('/login', (req, res, next) =>{
  User.find({
    email:req.body.email
  }).exec().then(user => {
    if(user.length < 1){
      return res.status(401).json({
        message:'Auth Faild'
      });
    }
    bcrypt.compare(req.body.password, user[0].password, (err, result) =>{
      if(err){
        return res.status(401).json({
          message:'Auth Faild'
        });
      }
      if(result){
      const token =  jwt.sign({
          userId:user[0]._id,
          firstName:user[0].firstName,
          lastName:user[0].lastName,
          email:user[0].email,
        }, process.env.JWT_KEY, {
          expiresIn:"24h"
        })
        return res.status(200).json({
          message:'Auth Successfull',
          token:token
        })
      }
      res.status(401).json({
        message:'Auth Faild'
      });

    })

  }).catch(err =>{
    console.log(err);
    res.status(500).json({
      error:err
    });
});

});

router.post('/forgot_password', (req, res, next) => {
  console.log(req.body);
  async.waterfall([
    function(done) {
      User.findOne({
        email: req.body.email
      }).exec(function(err, user) {
        if (user) {
          done(err, user);
        } else {
          done('User not found.');
        }
      });
    },
    function(user, done) {
      // create the random token
      crypto.randomBytes(20, function(err, buffer) {
        var token = buffer.toString('hex');
        done(err, user, token);
      });
    },
    function(user, token, done) {
      User.findByIdAndUpdate(
        { _id: user._id }, 
        { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, 
        { upsert: true, new: true })
        .exec(function(err, new_user) {
          done(err, token, new_user);
      });
    },
    function(token, user, done) {
      var data = {
        to: user.email,
        from: email,
        template: 'forgot-password-email',
        subject: 'Password help has arrived!',
        context: {
          url: 'http://localhost:4200/reset-password/' + token,
          name: user.firstName.split(' ')[0]
        }
      };

      smtpTransport.sendMail(data, function(err) {
        if (!err) {
          return res.json({ message: 'Kindly check your email for further instructions' });
        } else {
          return done(err);
        }
      });
    }
  ], function(err) {
    return res.status(422).json({ message: err });
  });
});

router.post('/reset_password', (req, res, next) => {
  console.log(req.body);
  User.findOne({
    reset_password_token: req.body.token,
    reset_password_expires: {
      $gt: Date.now()
    }
  }).exec(function(err, user) {
    if (!err && user) {
      if (req.body.newPassword === req.body.verifyPassword) {
        user.password = bcrypt.hashSync(req.body.newPassword, 10);
        user.reset_password_token = undefined;
        user.reset_password_expires = undefined;
        user.save(function(err) {
          if (err) {
            return res.status(422).send({
              message: err
            });
          } else {
            var data = {
              to: user.email,
              from: email,
              template: 'reset-password-email',
              subject: 'Password Reset Confirmation',
              context: {
                name: user.firstName.split(' ')[0]
              }
            };

            smtpTransport.sendMail(data, function(err) {
              if (!err) {
                return res.json({ message: 'Password reset' });
              } else {
                return done(err);
              }
            });
          }
        });
      } else {
        return res.status(422).send({
          message: 'Passwords do not match'
        });
      }
    } else {
      return res.status(400).send({
        message: 'Password reset token is invalid or has expired.'
      });
    }
  });
});




router.get('/:userId', checkAuth, function(req, res, next) {
  const id = req.params.userId
  User.findById(id).exec().then( result =>{
         console.log(result);
         if(result){
          res.status(200).json(result)
         }else{
          res.status(400).json({
            message:"No valid Entry Found"
          })
         }   
  }).catch(err =>{
    console.log(err);
    res.status(500).json({
      error:err
    })
  });

});

router.delete('/:userId', checkAuth, (req, res, next) =>{
  User.remove({
    _id:req.params.userId
  }).exec().then(
    result =>{
      result.status(200).json({
        message:'User Deleted'
      });
    
  }).catch(err =>{
    console.log(err);
    res.status(500).json({
      error:err
    });
  });
})





module.exports = router;
