var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const User = require('../models/users');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/check-auth')
require('dotenv').config();

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
