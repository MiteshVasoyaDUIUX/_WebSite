const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:  {
        type : String,
        require : true
    }, 
    email: {
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

  const model =  mongoose.model('UserSchema', userSchema);
  module.exports = model;