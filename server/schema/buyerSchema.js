const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
    name:  {
        type : String,
        required : true
    }, 
    email: {
        type : String,
        required : true
    },
    orderId:   {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    role:   {
        type : String,
        required : true
    },
  });

  module.exports =  mongoose.model('buyerSchema', buyerSchema);