const express = require("express");
const app = express();
const router = require("./routes/authRoutes");
const PORT = 5555;
const dbConnection = require("./db/db");

dbConnection();

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server is Connected  to http://localhost:${PORT}`);
});
