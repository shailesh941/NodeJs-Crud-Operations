var express = require('express');
var bodyParser = require('body-parser');
const Contactus = require('../models/contactus')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')
var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


// Get All product
router.get('/list', function(req, res, next) {

  Contactus.find().exec().then( result =>{
      console.log(result);
          res.status(200).json(result)
      }).catch(err =>{
      console.log(err);
      res.status(500).json({
      error:err
      })
  });

});


router.post('/add', (req, res, next) =>{
    const user = new Contactus({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        mobile: req.body.mobile,
        address: req.body.address,
        state: req.body.state,
        city: req.body.city,
        pinno: req.body.pinno
    });
    user.save().then( item => {
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

router.put('/update/:id', function(req, res, next) {
  const id = req.params.id;
  const updateObject = req.body;
  Contactus.update({ _id:id }, { $set:updateObject })
    .exec()
    .then(() => {
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
router.delete('/delete/:id', function(req, res, next) {
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
