const express = require("express");
const router = express.Router();
const server = require("../../server");
const cors = require("cors");
const { protectChat } = require("../../middleware/authMiddleware");
const socketIdSchema = require("../../schema/conversationIdSchema");

router.post("/save/chat", protectChat, (req, res) => {
  const data = req.body;
  // console.log("Chat Data : ", data)
});

module.exports = router;
