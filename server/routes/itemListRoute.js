const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const itemSchema = require("../schema/itemSchema");

router.get("/items", async (req, res) => {
  const items = await itemSchema.find();
  if (items.length == 0) {
    console.log("No items found");
  } else {
    console.log(items);
  }
});

router.post("/item", protect, async (req, res) => {
  const { vendorId, name, quantity, price, image } = req.body;

  if (!name || !quantity || !price) {
    res.end("Enter Data of Item");
  } else {
    const items = new itemSchema({
      vendorId,
      name,
      quantity,
      price,
      image,
    });

    const itemAdded = await items.save();
    console.log(itemAdded);
  }
});

module.exports = router;
