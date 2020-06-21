var express = require('express');
var bodyParser = require('body-parser');
const Product = require('../models/product')
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

router.post('/add', checkAuth, upload.single('product_imges'), (req, res, next) =>{
  const url = req.protocol + '://' + req.get('host')
  let productData =  new Product({
          product_code: req.body.product_code,
          product_name: req.body.product_name,
          product_cat: req.body.product_cat,
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

router.put('/update/:id', checkAuth, upload.single('product_imges'), function(req, res, next) {
  console.log(req.body);
  const id = req.params.id;
  const url = req.protocol + '://' + req.get('host')
  let updateProduct;
  if(req.body.product_imges != null){
    updateProduct = {
      product_code: req.body.product_code,
      product_name: req.body.product_name,
      product_cat: req.body.product_cat,
      product_price: req.body.product_price,
      product_dicripaton: req.body.product_dicripaton,
      product_imges:req.body.product_imges
    }
  }else{
    updateProduct = {
      product_code: req.body.product_code,
      product_name: req.body.product_name,
      product_cat: req.body.product_cat,
      product_price: req.body.product_price,
      product_dicripaton: req.body.product_dicripaton,
      product_imges: url + '/uploads/' + req.file.filename
    }
  }

  Product.update({_id:id}, {$set: updateProduct}, {new: true}).then(() => {
      res.status(200).json({
        success: true,
        message: 'Product is updated',
        updateCause: updateProduct,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.'
      });
    });


});


// Get All product
router.post('/list', checkAuth, function(req, res, next) {

  //const orderByColumn = req.body.updated_at || 'updated_at'
  //const orderByDirection = req.body.order_by_direction || 'desc'
  //const page = req.body.page || 0;
  //const perPage = 10;
  const page = Math.max(0, req.body.page) || 0;
  const limit = req.body.limit || 8;
  const short = {
    'updated_at': -1
  }
  // const pageOptions = {
  //   page: parseInt(req.body.page, 10) || 0,
  //   limit: parseInt(req.body.limit, 10) || 10
  // }

  let filterData = {
    userId: req.userId,
  };
  if(req.body.product_cat){
    filterData.product_cat = req.body.product_cat
  }

  // const product = await knex('Product')
  //   .where(filterData)
  //   .orderBy(orderByColumn, orderByDirection)
  //   .limit(limit)
  //   .offset((page - 1) * limit)

  //   res.send({ product })
 

//  let allData = {
//     total:0,
//     data:[],
//   }

   Product.find(filterData).sort(short).limit(limit).skip((page -1) * limit).then( result =>{
      //console.log(result);
      res.status(200).json(result)
      //allData.data = result;
      }).catch(err =>{
      console.log(err);
      res.status(500).json({
      error:err
      })
  });
  // Product.count({userId: req.userId}).then( result =>{
  //   allData.total = result
  //   res.status(200).json(allData)
  // })

  

});

// Get Product with id
router.get('/:id', checkAuth,  function(req, res, next) {
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


// Delete Product
router.delete('/delete/:id', function(req, res, next) {
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
