var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var BooksSchema = require('../models/book');
const checkAuth = require('../middleware/check-auth')
var router = express.Router();
router.use(bodyParser.json());

  
  // POST User
  router.post('/add', (req, res, next) => {
    const document = new BooksSchema({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      category:req.body.category,
    });
    document.save().then(result => {
      console.log(result);
      res.status(201).json({
        message: "User catgorys successfully!",
        userCreated: {
          _id: result._id,
          name: result.name,
        }
      })
    }).catch(err => {
        res.status(500).json({
          error: err
        });
    })
  })
  
  
  router.get('/list', function(req, res, next) {
    BooksSchema.find()
    .populate("category")
    .exec()
    .then( result =>{
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
    BooksSchema.findById(id).exec().then( result =>{
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
    BooksSchema.findByIdAndUpdate(req.params.id, req.body).exec().then( result =>{
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
    BooksSchema.findByIdAndRemove(req.params.id, req.body).exec().then( result =>{
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