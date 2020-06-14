const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
        product_code: { type: String, required:true, trim:true},
        product_cat: { type: String, required:true, trim:true},
        product_name: { type: String, required:true, trim:true},
        product_price: { type: String, required:true, trim:true},
        product_dicripaton: { type: String},
        product_imges: { type: String},
        userId:{type: String},
        updated_at: { type: Date, default: Date.now }
    },{
    versionKey: false // You should be aware of the outcome after set to false
  }); 


module.exports = mongoose.model('Products', ProductSchema);