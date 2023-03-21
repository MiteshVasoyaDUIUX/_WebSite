const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.String,
      required: true,
      ref: "userSchema",
    },
    productId: {
      type: mongoose.Schema.Types.String,
      required: true,
      ref: "productSchema",
    },
    quantity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentType : {
      type : String,
      required : true
    },
    orderDate : {
      type : String,
      required : true
    }
  }
);

module.exports = mongoose.model("order", orderSchema);
