const mongoose = require("mongoose");

const socketIdSchema = new mongoose.Schema(
  {
    socketID: {
      type: mongoose.Schema.Types.String,
      required: true,
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

module.exports = mongoose.model("socketID", socketIdSchema);
