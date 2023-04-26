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
    prodName: {
      type: String,
      required: true,
    },
    prodImage: {
      type: Array,
      required: true,
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
    paymentType: {
      type: String,
      required: true,
    },
    deliveryAddress: {
      type: Object,
      required: true,
    },
    rating: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

module.exports = mongoose.model("order", orderSchema);
