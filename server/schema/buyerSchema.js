const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
    name:  {
        type : String,
        required : true
    }, 
    item: {
        type : String,
        required : true
    },
    password:   {
        type : String,
        required : true
    },
    role:   {
        type : String,
        required : true
    },
  });

  module.exports =  mongoose.model('BuyerSchema', buyerSchema);