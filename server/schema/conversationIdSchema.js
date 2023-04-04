const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    users: {
      type : Array,
    },
  },
);

module.exports = mongoose.model("socketID", conversationSchema);
