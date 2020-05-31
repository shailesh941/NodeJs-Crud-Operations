const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    mobile:String,
    address:String,
    state:String,
    city:String,
    pinno:String,
    updated_at: { type: Date, default: Date.now }
    },{
    versionKey: false // You should be aware of the outcome after set to false
  }); 


module.exports = mongoose.model('Contactus', ContactSchema);