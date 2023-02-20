const express = require("express");
const { protect } = require("../../middleware/authMiddleware");
const router = express.Router();
const itemSchema = require("../../schema/itemSchema");
const userSchema = require("../../schema/userSchema");

//Admin Dashboard...
router.get("/", protect, (req, res) => {
    res.end("Admin Dashboard");
});

//Get list of all Items by all Vendors...
router.get("/allitems", protect, async (req, res) => {
  const vendorId = req.user.id;
  const role = req.user.role;

  const items = await itemSchema.find();
  console.log("req.user.role : ", req.user.role);
  if (items.length == 0) {
    console.log("No items found");
  }
});

//Get list of all Users (including Vendors and Buyers)...
router.get("/allusers", protect, async (req, res) => {
  const vendorId = req.user.id;
  const role = req.user.role;

    const items = await userSchema.find();
    console.log("req.user.role : ", req.user.role);
    if (items.length == 0) {
      console.log("No items found");
    } else {
      res.json(items);
    }
});

module.exports = router;