const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "conversationSchema",
  },
  senderId: {
    type: String,
    required: true,
    ref: "userSchema",
  },
  message: {
    type: String,
  },
  time: {
    type: String,
  },
});

module.exports = mongoose.model("chat", chatSchema);
