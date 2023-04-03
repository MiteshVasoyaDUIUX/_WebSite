const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.String,
      required: true,
      ref: "userSchema",
    },
    message: {
      type : Object,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

module.exports = mongoose.model("chat", chatSchema);
