// const socketIdSchema = require("../../");
const colors = require("colors");

const { find } = require("../server/schema/chatSchema");

const io = require("socket.io")(8888, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let activeClient = {};
let reverseActiveClient = {};
let activeAdmin = {};
let reverseActiveAdmin = {};

const addActiveClient = (socketIdData) => {
  activeClient[socketIdData.userId] = socketIdData.socketId;
  reverseActiveClient[socketIdData.socketId] = socketIdData.userId;
  console.log("addActiveClient : ", activeClient);
  // console.log("activeAdmin : ", activeAdmin);
  // console.log("reverseActiveAdmin : ", reverseActiveAdmin);
};

const removeActiveClient = (socketId) => {
  const userId = reverseActiveClient[socketId];
  delete reverseActiveClient[socketId];
  delete activeClient[userId];
  activeClient[userId] = null;
  console.log("New Active User Array : ", activeClient);
};

const addActiveAdmin = (socketIdData) => {
  activeAdmin[socketIdData.userId] = socketIdData.socketId;
  reverseActiveAdmin[socketIdData.socketId] = socketIdData.userId;
  console.log(`addActiveAdmin : ${activeAdmin}`.bgCyan);
};

const removeActiveAdmin = (socketId) => {
  const userId = reverseActiveAdmin[socketId];
  delete reverseActiveAdmin[socketId];
  delete activeAdmin[userId];
  activeAdmin[userId] = null;
  console.log(`New Active Admin Array :  ${activeAdmin}`.bgBlue);
};

const findSocketId = (receiverId) => {
  return activeAdmin[receiverId] || activeClient[receiverId];
};

const getUserSocketId = (userId) => {};

io.on("connection", (socket) => {
  console.log("User is Connected. Socket Id : ", socket.id);

  socket.on("addActiveClient", (socketIdData) => {
    addActiveClient(socketIdData);
  });

  socket.on("addActiveAdmin", (socketIdData) => {
    addActiveAdmin(socketIdData);
  });

  socket.on("sendMessage", async (data) => {
    console.log("Sent Message : ", data);

    const receiverSocketId = await findSocketId(data.receiverId);

    if (!receiverSocketId) {
      socket.emit("save-chat", data);
    } else {
      console.log("Receiver is online, Socket Id : ", receiverSocketId);
      socket.emit("save-chat", data);
      io.to(receiverSocketId).emit("privatemessage", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected!", socket.id);

    removeActiveClient(socket.id);
    removeActiveAdmin(socket.id);
    // io.emit("getUsers", users);
  });
});
