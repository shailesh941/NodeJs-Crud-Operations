const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let documentSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String},
    price:{ type: String},
    avatar: {type: String},
    users :{
            type:mongoose.Schema.Types.ObjectId,
            ref:'users'
          }

    },
    {
      versionKey: false // You should be aware of the outcome after set to false
    });


module.exports = mongoose.model('Document', documentSchema);