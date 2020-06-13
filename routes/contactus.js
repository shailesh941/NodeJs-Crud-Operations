var express = require('express');
var bodyParser = require('body-parser');
const Contactus = require('../models/contactus')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')
var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const DIR = 'uploads/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DIR);
    },
    filename: (req, file, cb) => {
      const fileName = Date.now() + "-" + file.originalname.toLowerCase().split(' ').join('-');
      cb(null, fileName)
    }
  });
  // Multer Mime Type Validation
  var upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
    }
  });

// Get All product
router.get('/list', checkAuth,  function(req, res, next) {

  Contactus.find({created_by: req.userId}).exec().then( result =>{
      console.log(result);
          res.status(200).json(result)
      }).catch(err =>{
      console.log(err);
      res.status(500).json({
      error:err
      })
  });

});


router.post('/add', checkAuth, upload.single('avatar'), (req, res, next) =>{
    const url = req.protocol + '://' + req.get('host')
    const contactus = new Contactus({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        mobile: req.body.mobile,
        address: req.body.address,
        state: req.body.state,
        city: req.body.city,
        pinno: req.body.pinno,
        created_by:req.userId,
        avatar: url + '/uploads/' + req.file.filename,
    });
    contactus.save().then( item => {
        res.status(200).json({
          messeges:"Cerating New Product",
          itemData: item
        })
    }).catch(err =>{
      res.status(500).json({
        error:err
      });
    });

});

router.put('/update/:id', checkAuth, upload.single('avatar'), function(req, res, next) {

  const id = req.params.id;
  const url = req.protocol + '://' + req.get('host');
  let updateObject;
  if(req.body.avatar != null){
    updateObject = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobile: req.body.mobile,
      address: req.body.address,
      state: req.body.state,
      city: req.body.city,
      pinno: req.body.pinno,
      created_by:req.userId
    }
  }else{
    updateObject = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobile: req.body.mobile,
      address: req.body.address,
      state: req.body.state,
      city: req.body.city,
      pinno: req.body.pinno,
      created_by:req.userId,
      avatar: url + '/uploads/' + req.file.filename,
    }
  }

  Contactus.findOneAndUpdate({_id:id}, {$set: updateObject}, {new: true}).then(() => {
      res.status(200).json({
        success: true,
        message: 'Contactus is updated',
        updateCause: updateObject,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.'
      });
    });


});


router.get('/:id', checkAuth,  function(req, res, next) {
  const id = req.params.id
  Contactus.findById(id).exec().then( result =>{
         console.log('Reselt', result);
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

// Delete Product
router.delete('/delete/:id', checkAuth, function(req, res, next) {
    Contactus.findByIdAndRemove(req.params.id, req.body).exec().then( result =>{
    console.log(result);
    res.status(200).json({
        message:"Deleted Data",
        item:result
      })
    }).catch(err =>{
      console.log(err);
      res.status(500).json({
        error:err
      })
    });
});







module.exports = router;
