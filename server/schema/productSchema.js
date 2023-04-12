const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  prodName: {
    type: String,
    required: true,
  },
  prodDesc: {
    type: String,
    required: true,
  },
  prodCategory: {
    type: String,
    required: true,
  },
  prodQuantity: {
    type: Number,
    required: true,
  },
  prodPrice: {
    type: Number,
    required: true,
  },
  prodMRP: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
    default: 0,
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  prodImage: {
    type: Array,
    required: false,
    default: "NA",
  },
  date: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("product", productSchema);
