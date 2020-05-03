var express = require('express');
var bodyParser = require('body-parser');
const Product = require('../models/product')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/check-auth')
var router = express.Router();
router.use(bodyParser.json());



router.post('/add', checkAuth,  function (req, res, next) {
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


router.post('/list', checkAuth, function(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY)
  const user_Id = decoded.userId;
  Product.find({create_by_user: user_Id}).exec().then( result =>{
        //console.log(result);
        res.status(200).json(result)
    }).catch(err =>{
    console.log(err);
    res.status(500).json({
    error:err
    })
  });

});

// Get All product
router.get('/alllist', checkAuth, function(req, res, next) {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    const user_Id = decoded.userId;
    Product.find({create_by_user: user_Id}).exec().then( result =>{
        console.log(result);
        res.status(200).json(result)
    }).catch(err =>{
    console.log(err);
    res.status(500).json({
    error:err
    })
  });
}
  
  

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
