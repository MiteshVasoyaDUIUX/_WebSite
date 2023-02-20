const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    vendorId:  {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'UserSchema'
    }, 
    name: {
        type : String,
        re : true
    },
    quantity:   {
        type : Number,
        required : true
    },
    price:   {
        type : Number,
        required : true
    },
    image:   {
        type : String,
        required : false,
        default : 'NA'
    },
  });

  module.exports =  mongoose.model('ItemSchema', itemSchema);