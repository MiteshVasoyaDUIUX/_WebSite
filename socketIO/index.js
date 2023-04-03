const io = require("socket.io")(8888, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

let users = [];

io.on("connection", (socket) => {
  console.log("User is Connected. Socket Id : ", socket.id);
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", (data) => {
    console.log("Sent Message : ", data);
  });

  //   io.emit("order-placed", "Congratulations Your Order is placed...");

  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
