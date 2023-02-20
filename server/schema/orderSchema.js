const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.String,
      required: true,
      ref: "userSchema",
    },
    itemName: {
      type: mongoose.Schema.Types.String,
      required: true,
      ref: "itemSchema",
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },

    totalBill: {
      type: Number,
    },
  },
  {
    timestamps: {
      createdAt: "orderDate",
      updatedAt: false,
    },
  }
);

  module.exports =  mongoose.model('orderSchema', orderSchema);