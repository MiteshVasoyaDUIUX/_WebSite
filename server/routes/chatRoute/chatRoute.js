const express = require("express");
const router = express.Router();
const server = require("../../server");
const cors = require("cors");

// const io = require("socket.io")(server.server, {
//   path: "/chat/buyer",
// });

router.get("/buyer", (req, res) => {
  res.send("Sendsdsdsds");
  //   console.log("CHAT APP BUYER ");

  const io = req.app.get("socketIO");

  io.on("connection", (socket) => {
    console.log("Connected To Chat ID In CHAT ROUTE : ", socket.id);

    socket.on("disconnect", () => {
      console.log("Disconnected : ", socket.id);
    });

    socket.on("send_message", (data) => {
      console.log("MESSAGE DATA : ", data);
      const sendData = "Data Received..."
      socket.emit("receive_message", data);
    });
  });
});

module.exports = router;
