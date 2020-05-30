var express = require('express');
var bodyParser = require('body-parser');
const Product = require('../models/product')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')
var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" +file.originalname)
  }
});

const fileFilter = (req, file, cb) =>{
  if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
}
//const upload = multer({ dest: 'uploads/' });
const upload = multer({ 
  storage: storage, 
  limits:{
    fileSize:1024 * 1024 * 5
  },
  fileFilter:fileFilter

})

router.post('/add', checkAuth, upload.single('product_imges'), (req, res, next) =>{
  const url = req.protocol + '://' + req.get('host')
  let productData =  new Product({
          product_code: req.body.product_code,
          product_name: req.body.product_name,
          product_price: req.body.product_price,
          product_dicripaton: req.body.product_dicripaton,
          product_imges: url + '/uploads/' + req.file.filename,
          userId: req.userId,
      });
      //productData.userId = req.userId

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


// router.post('/list', checkAuth, function(req, res, next) {
//   Product.find({userId: req.userId}).exec().then( result =>{
//         //console.log(result);
//         res.status(200).json(result)
//     }).catch(err =>{
//     console.log(err);
//     res.status(500).json({
//     error:err
//     })
//   });

// });

// Get All product
router.get('/list', checkAuth, function(req, res, next) {

  Product.find({userId: req.userId}).exec().then( result =>{
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
