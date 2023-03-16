const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.Array,
    required : false,
  },
  wishlist: {
    type: mongoose.Schema.Types.Array,
    required : false,
  },
});

module.exports = mongoose.model("userSchema", userSchema);
