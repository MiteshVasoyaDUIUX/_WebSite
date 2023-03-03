const express = require("express");
const { protectLoginRegister, protectView, protectDeletionUpdation, allUsers } = require("../../middleware/authMiddleware");
const router = express.Router();
const itemSchema = require("../../schema/itemSchema");
const userSchema = require("../../schema/userSchema");

//Admin Dashboard...
router.get("/", protectLoginRegister, (req, res) => {
  const adminId = req.user.id;
  const role = req.user.role;
  const token = req.token;

    if (role === "admin") {
    console.log("Token In Auth Route : ", token);
    res.json({
      adminId, role, token
    });
  } else {
    res.end("Not Admin...");
  }
});

//Get list of all Items by all Vendors...
router.get("/allitems", protectDeletionUpdation, async (req, res) => {
  console.log("request : ", req)
  const vendorId = req.user.id;
  const role = req.user.role;

  const items = await itemSchema.find();
  console.log("req.user.role : ", req.user.role);
  if (items.length == 0) {
    console.log("No items found");
  } else {
    res.json(items);
  }
});

router.post("/addproducts", protectDeletionUpdation, (req, res) => {
  console.log(req.body);
});

//Get list of all Users (including Vendors and Buyers)...
router.get("/allusers", allUsers, async (req, res) => {
  const adminId = req.user.id;
  const role = req.user.role;

  if(role === 'admin'){
    const items = await userSchema.find();
    console.log("req.user.role : ", req.user.role);
    if (items.length == 0) {
      console.log("Item Not found");
    } else {
      res.json(items);
    }
  } else{
    res.end("Not Admin. If You are, Contact another Admin...");
  }
    
});

router.delete("/item/:id", protectDeletionUpdation, async (req, res) => {
  const adminId = req.user.id;
  const role = req.user.role;

    const item = await itemSchema.findByIdAndDelete(req.params.id);
    // console.log("req.user.role : ", req.user.role);

    if (!item) {
      console.log("No items found");
    } else {
      res.json(item);
    }
});

module.exports = router;