const express = require("express");
const app = express();
const authRouter = require("./routes/authRoute/authRoutes");
const vendorRoute = require("./routes/vendorRoute/vendorRoute");
const buyerRoute = require('./routes/buyerRoute/buyerRoute');
const adminRoute = require('./routes/adminRoute/adminRoute');
const PORT = 5555;
const dbConnection = require("./db/db");
const bodyParser = require("body-parser")
const dotenv = require('dotenv');

dotenv.config();
dbConnection();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", authRouter);
app.use("/vendor", vendorRoute);
app.use("/buyer", buyerRoute);
app.use("/admin", adminRoute);

app.listen(PORT, () => {
  console.log(`Server is Connected  to http://localhost:${PORT}`);
});
