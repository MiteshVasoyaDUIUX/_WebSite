const express = require("express");
const router = express.Router();
const server = require("../../server");
const cors = require("cors");
const { protectChat } = require("../../middleware/authMiddleware");
const socketIdSchema = require("../../schema/conversationIdSchema");
const conversationIdSchema = require("../../schema/conversationIdSchema");
const chatSchema = require("../../schema/chatSchema");

const adminId = "aUS1ZeUBOHeZwYdiKlFV4wIPpvh2";

router.get("/fetch", protectChat, async (req, res) => {
  const userData = req.user;
  const userId = userData._id;
  // console.log("USer Data : ", userId);

  const conversationData = await conversationIdSchema.find({
    users: { $all: [adminId, userId] },
  });

  const chat = await chatSchema.find({
    conversationId: conversationData[0]._id,
  }).limit(5);

  const chatRes = {
    conversationId: conversationData[0]._id,
    messageData: chat,
    users: conversationData[0].users,
  };
  // console.log("Conversartion Found :", chatRes);
  res.json(chatRes);
});

router.get("/fetch/conversations", protectChat, async (req, res) => {
  const userData = req.user;
  const adminId = userData._id;
  console.log("ASASASAOEOEOWQO!O!@O#O!O@ :", adminId);
  let allChats = [];

  const conversationIds = await conversationIdSchema.find({
    users: { $all: [adminId] },
  });

  // console.log("DASA", conversationIds.length)

  for (let index = 0; index < conversationIds.length; index++) {
    const conversationId = conversationIds[index]._id;
    const findChat = await chatSchema.find({ conversationId: conversationId });
    const newMessageObj = {
      conversationId: conversationIds[index]._id,
      messageData: findChat,
      users: conversationIds[index].users,
    };

    allChats.push(newMessageObj);
  }
  console.log("Found Chat Array : ", allChats);

  res.json(allChats);
});

router.post("/save/chat", protectChat, async (req, res) => {
  const data = req.body;
  const date = new Date();

  const newChat = new chatSchema({
    conversationId: data.conversationId,
    senderId: data.senderId,
    message: data.message,
    time: date,
  });
  const message = await newChat.save();

  console.log("Chat Data : ", message);
});

module.exports = router;
