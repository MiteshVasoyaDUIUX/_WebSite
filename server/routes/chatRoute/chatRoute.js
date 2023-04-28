const express = require("express");
const router = express.Router();
const server = require("../../server");
const cors = require("cors");
const { protectChat } = require("../../middleware/authMiddleware");
const socketIdSchema = require("../../schema/conversationIdSchema");
const conversationIdSchema = require("../../schema/conversationIdSchema");
const chatSchema = require("../../schema/chatSchema");
const userSchema = require("../../schema/userSchema");

const adminId = "aUS1ZeUBOHeZwYdiKlFV4wIPpvh2";

const getUserName = async (userId) => {
  const clientData = await userSchema.findById(userId);
  return clientData.name;
};

router.get("/client/fetch/:from", protectChat, async (req, res) => {
  const userData = req.user;
  const userId = userData._id;
  const from = req.params.from;
  const to = 15;
  let moreMsg;
  const skipData = from - 1;

  const conversationData = await conversationIdSchema.find({
    users: { $all: [adminId, userId] },
  });

  const conversationId = conversationData[0]._id;

  const totalMsg = await chatSchema.find({ conversationId });
  const reversedMsg = await chatSchema
    .find({ conversationId })
    .skip(skipData)
    .limit(to)
    .sort({ _id: -1 });

  console.log("Chat Data : ", reversedMsg);

  if (Number(to) + Number(from) - 1 < totalMsg.length) {
    moreMsg = true;
  } else {
    moreMsg = false;
  }

  const newMessageObj = {
    conversationId: conversationId,
    messageData: reversedMsg,
    users: conversationData[0].users,
    moreMsg,
    nextMsgFrom: Number(from) + Number(to),
  };

  // console.log("Conversation Data : ", newMessageObj.nextMsgFrom);

  res.json(newMessageObj);
});

router.get(
  "/admin/fetch/:conversationId/:from",
  protectChat,
  async (req, res) => {
    const conversationId = req.params.conversationId;
    const from = req.params.from;
    const to = 15;
    let moreMsg;
    const skipData = from - 1;

    const conversationData = await conversationIdSchema.findById(
      conversationId
    );
    const totalMsg = await chatSchema.find({ conversationId });
    const reversedMsg = await chatSchema
      .find({ conversationId })
      .skip(skipData)
      .limit(to)
      .sort({ _id: -1 });

    if (Number(to) + Number(from) - 1 < totalMsg.length) {
      moreMsg = true;
    } else {
      moreMsg = false;
    }

    const newMessageObj = {
      conversationId: conversationId,
      messageData: reversedMsg,
      users: conversationData.users,
      moreMsg,
      nextMsgFrom: Number(from) + Number(to),
    };

    res.json(newMessageObj);
  }
);

router.get("/fetch/conversations", protectChat, async (req, res) => {
  const userData = req.user;
  const adminId = userData._id;
  // console.log("Admin Id :", adminId);
  let allConversation = [];

  const conversationIds = await conversationIdSchema.find({
    users: { $all: [adminId] },
  });

  for (let index = 0; index < conversationIds.length; index++) {
    const conversationId = conversationIds[index];

    const userId = conversationId.users[1];

    const userName = await getUserName(userId);

    const conversationData = {
      clientName: userName,
      conversationId: conversationId._id,
      users: conversationId.users,
    };

    allConversation.push(conversationData);

    // console.log("User ID : ", userData);
  }

  console.log("asasa", "allConversation");
  res.json(allConversation);
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
