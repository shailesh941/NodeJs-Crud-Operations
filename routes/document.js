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
      console.log(err),
        res.status(500).json({
          error: err
        });
    })
  })
  
  
  // GET All User
  router.get("/", (req, res, next) => {
    DocumentSchema.find().then(data => {
      res.status(200).json({
        message: "Users retrieved successfully!",
        users: data
      });
    });
  });
  
  
  // GET User
  router.get("/:id", (req, res, next) => {
    DocumentSchema.findById(req.params.id).then(data => {
      if (data) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "User not found!"
        });
      }
    });
  });




module.exports = router;