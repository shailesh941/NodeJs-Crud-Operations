var mongoose = require('mongoose');
//console.log(UserSchema);
var UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    unique: false,
    required: true,
    trim: false
  } ,
  last_name: {
    type: String,
    unique: false,
    required: false,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    unique: false,
    required: true,
  },

  // first_name:String,
  // last_name:String,
  // email:String,
  // gender:String,
  updated_at: { type: Date, default: Date.now },
},{
  versionKey: false // You should be aware of the outcome after set to false
});

module.exports = mongoose.model('Users', UserSchema);