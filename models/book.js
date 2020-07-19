const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BooksSchema = new Schema({
        _id: { type: Schema.Types.ObjectId},
        name: { type: String, required:true},
        category: {type: Schema.Types.ObjectId, ref: 'Categorys'},
        create_at: { type: Date, default: Date.now }
    },{
    versionKey: false // You should be aware of the outcome after set to false
  }); 


module.exports = mongoose.model('Books', BooksSchema);