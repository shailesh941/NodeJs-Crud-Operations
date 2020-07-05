var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var DocumentSchema = require('../models/document');
const checkAuth = require('../middleware/check-auth')
var router = express.Router();
router.use(bodyParser.json());

const DIR = 'uploads/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DIR);
    },
    filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
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
  
  
  
  // POST User
  router.post('/add',checkAuth, upload.single('avatar'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    const document = new DocumentSchema({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      avatar: url + '/uploads/' + req.file.filename,
      userId: req.userId,
    });
    document.save().then(result => {
      console.log(result);
      res.status(201).json({
        message: "User registered successfully!",
        userCreated: {
          _id: result._id,
          name: result.name,
          avatar: result.avatar
        }
      })
    }).catch(err => {
        res.status(500).json({
          error: err
        });
    })
  })
  
  
  router.get('/list', checkAuth, function(req, res, next) {
    DocumentSchema.find({userId: req.userId}).exec().then( result =>{
        console.log(result);
            res.status(200).json(result)
        }).catch(err =>{
        console.log(err);
        res.status(500).json({
        error:err
        })
    });
  
  });
  
  // Get Product with id
  router.get('/:id', function(req, res, next) {
    const id = req.params.id
    DocumentSchema.findById(id).exec().then( result =>{
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
  
  // Update Product
  router.put('/:id', function(req, res, next) {
    DocumentSchema.findByIdAndUpdate(req.params.id, req.body).exec().then( result =>{
      console.log(result);
      res.status(200).json({
        message:"Update Product Data",
        item:result
      })
    }).catch(err =>{
      console.log(err);
      res.status(500).json({
        error:err
      })
    });
  
  });
  
  // Delete Product
  router.delete('/:id', function(req, res, next) {
    DocumentSchema.findByIdAndRemove(req.params.id, req.body).exec().then( result =>{
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