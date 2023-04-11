const express = require("express");
const app = express();
const authRoute = require("./routes/authRoute/authRoutes");
const vendorRoute = require("./routes/vendorRoute/vendorRoute");
const buyerRoute = require("./routes/buyerRoute/buyerRoute");
const adminRoute = require("./routes/adminRoute/adminRoute");
const productsRoute = require("./routes/productsRoute/productsRoute");
const chatRoute = require("./routes/chatRoute/chatRoute");
const PORT = 5555;
const dbConnection = require("./db/db");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

const socketIO = require("socket.io");

dotenv.config();
dbConnection();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(PORT, () => {
  console.log(`Server : http://localhost:${PORT}/`);
});

const io = socketIO(server, {
  cors: "http://localhost:3000/chat",
  method: ["GET", "POST"],
});

app.set("socketIO", io);

app.use("/", productsRoute);
app.use("/auth", authRoute);
app.use("/vendor", vendorRoute);
app.use("/buyer", buyerRoute);
app.use("/admin", adminRoute);
app.use("/chat", chatRoute);
