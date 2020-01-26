var express = require('express');
var router = express.Router();
var dataBase = require('../db/database')
//var db = dataBase.getDb();

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('Have Select Product');
  dataBase.collection('users').find({}).toArray()
	.then((users) => {
            console.log('Users', users);
        });

  

  

});

module.exports = router;
