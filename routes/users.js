var express = require('express');
var cors = require('cors')
var router = express.Router();
var Users = require('../models/users')
var bodyParser = require('body-parser');

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  Users.find(function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

router.get('/:id', function(req, res, next) {
  Users.findById(req.params.id, function (err, result) {
    if (err) return next(err);
    res.json(result);
  });
});

/// Creating User

router.post('/', cors(), function(req, res, next) {
  //URL base request post
  
  // var newUser = new Users({ first_name: req.query.first_name, 
  //   last_name: req.query.last_name,
  //   email: req.query.email,
  //   gender: req.query.gender,
  //   ip_address: req.query.ip_address,
  //  });
  //  newUser.save(function(err, entry) {
  //   if(err) {
  //     console.log(err);
  //     res.send(500, { error: err.toString()});
  //   } 
  //   else {
  //     console.log('New product has been posted.');        
  //     res.send(JSON.stringify(entry));
  //   }
  // });

  // Post body request data passing

  Users.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });

});

/* Update Users */
router.put('/:id', function(req, res, next) {
  Product.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* Delete Users */
router.put('/:id', function(req, res, next) {
  Users.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});




module.exports = router;
