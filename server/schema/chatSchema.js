const { ref } = require("firebase/storage");
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    conversationId : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "conversationSchema"
    },
    senderId: {
      type: String,
      required: true,
      ref: "userSchema",
    },
    message: {
      type : string,
    },
    time: {
      type : string,
    },
  },
);

module.exports = mongoose.model("chat", chatSchema);
