var mongoose = require('mongoose');
const assert = require('assert');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/nodedb', {useNewUrlParser: true, useFindAndModify: false })
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));

