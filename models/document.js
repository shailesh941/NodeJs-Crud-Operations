const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
    documentName:String,
    documentId:String,
    documentAdd:String
})



module.exports = mongoose.model('Document', documentSchema);