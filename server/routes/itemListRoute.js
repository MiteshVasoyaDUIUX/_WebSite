const express = require("express");
const { Admin } = require("mongodb");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const itemSchema = require("../schema/itemSchema");

router.get("/vendor/items", protect, async (req, res) => {
    const vendorId = req.user.id;
    const role = req.user.role;

    if(role === 'vendor'){
        const items = await itemSchema.find({vendorId});
        console.log('req.user.role : ', req.user.role);
        if (items.length == 0) {
          console.log("No items found");
        } else {
          res.json(items);
        }
    } else {
        res.end("Not Vendor...");
    }
});

router.get("/admin/items", protect, async (req, res) => {
    const vendorId = req.user.id;
    const role = req.user.role;

    if(role === 'admin'){
        const items = await itemSchema.find();
        console.log('req.user.role : ', req.user.role);
        if (items.length == 0) {
          console.log("No items found");
        } else {
          res.json(items);
        }
    } else {
        res.end("Not Authorized Person...");
    }
});

router.post("/vendor/item", protect, async (req, res) => {
  const { vendorId, name, quantity, price, image } = req.body;
  const userId = req.user.id;
  const role = req.user.role;
  if(role === 'vendor'){
    if (!name || !quantity || !price) {
        res.end("Enter Data of Item");
      } else {
        const items = new itemSchema({
          vendorId : userId,
          name,
          quantity,
          price,
          image,
        });
    
        const itemAdded = await items.save();
        res.json(itemAdded);
      }
  }
  else{ 
    res.end("Not Vendor");
  }
// console.log('req.user.id', req.user.id);
  
});

module.exports = router;
