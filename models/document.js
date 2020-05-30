const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let documentSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String},
    price:{ type: String},
    avatar: {type: String},
    userId:{type: String}
    }, {
      collection: 'Document'
})


module.exports = mongoose.model('Document', documentSchema);