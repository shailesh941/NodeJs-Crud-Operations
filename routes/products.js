var express = require('express');
var bodyParser = require('body-parser');
const Product = require('../models/product')
var router = express.Router();
router.use(bodyParser.json());

router.post('/add', function (req, res, next) {
  const productData = new Product(req.body);
  productData.save().then( item => {
            res.status(200).json({
              messeges:"Cerating New Product",
              itemData: item
            })
  }).catch(err =>{
    console.log(err);
    res.status(500).json({
      error:err
    });
  });

});


// Get All product
router.get('/', function(req, res, next) {
  Product.find().exec().then( result =>{
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
  Product.findById(id).exec().then( result =>{
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
  Product.findByIdAndUpdate(req.params.id, req.body).exec().then( result =>{
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
  Product.findByIdAndRemove(req.params.id, req.body).exec().then( result =>{
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
