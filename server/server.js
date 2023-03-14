const express = require("express");
const app = express();
const authRoute = require("./routes/authRoute/authRoutes");
const vendorRoute = require("./routes/vendorRoute/vendorRoute");
const buyerRoute = require("./routes/buyerRoute/buyerRoute");
const adminRoute = require("./routes/adminRoute/adminRoute");
const productsRoute = require("./routes/productsRoute/productsRoute");
const PORT = 5555;
const dbConnection = require("./db/db");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
dbConnection();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", productsRoute);
app.use("/auth", authRoute);
app.use("/vendor", vendorRoute);
app.use("/buyer", buyerRoute);
app.use("/admin", adminRoute);

app.listen(PORT, () => {
  console.log(`Server is Connected  to http://localhost:${PORT}`);
});
