const express = require("express");
const router = express.Router();
const server = require("../../server");
const cors = require("cors");
const { protectChat, } = require("../../middleware/authMiddleware");

router.post("/insert/socketid", protectChat, (req, res) => {
      console.log("Insert temp ID")
});

module.exports = router;
