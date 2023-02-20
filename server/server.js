const express = require("express");
const app = express();
const router = require("./routes/authRoutes");
const itemListRoute = require("./routes/itemListRoute");
const PORT = 5555;
const dbConnection = require("./db/db");
const bodyParser = require("body-parser")

dbConnection();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", router);
app.use("/list", itemListRoute);

app.listen(PORT, () => {
  console.log(`Server is Connected  to http://localhost:${PORT}`);
});
