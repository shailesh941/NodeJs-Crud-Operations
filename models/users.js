var mongoose = require('mongoose');
//console.log(UserSchema);
var UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: String,
  lastName: String,
  dateDob:String,
  email: {
    type: String,
    required: true,
    unique: true,
    match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password:{
    type: String,
    required: true,
  },
  
},{
  versionKey: false // You should be aware of the outcome after set to false
});

module.exports = mongoose.model('Users', UserSchema);