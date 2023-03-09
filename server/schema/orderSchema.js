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
    price: {
      type: Number,
      required: true,
    },
    billAmount: {
      type: Number,
      required: true,
    },
    deliveryType : {
      type : String,
      required : true
    }
  },
  {
    timestamps: {
      createdAt: false,
      updatedAt: "orderDate",
    },
  }
);

module.exports = mongoose.model("order", orderSchema);
