const express = require("express");
const router = express.Router();
const {
  protectLoginRegister,
  protectView,
  protectDeletionUpdation,
} = require("../../middleware/authMiddleware");
const orderSchema = require("../../schema/orderSchema");
// const buyerSchema = require("../schema/buyerSchema");
const { route } = require("../authRoute/authRoutes");
const itemSchema = require("../../schema/productSchema");

//Dashboard of User...
router.get("/", protectLoginRegister, async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;
  const token = req.token;

  if (role === "buyer") {
    console.log("allOrders");
    res.json({
      userId,
      role,
      token,
    });
  } else {
    res.end("Not Buyer...");
  }
});

//Get all orders placed by the user...
router.get("/orders", protectView, async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  try {
    if (role === "buyer") {
      const orders = await orderSchema.find({ userId });
      res.json(orders);
    } else {
      res.end("Not Buyer");
    }
  } catch (error) {
    console.log("Error : ", error);
  }
});

//Call this when User select item and Pass ItemId in Params with URL...
router.post("/placeorder", protectView, async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  //Below itemId will be fetched form the Req. from front-end...
  const itemId = "6406c1db284b5bc3940a74e8";
  const item = await itemSchema.findById(itemId);
  const itemPrice = item.prodPrice;
  const quantity = req.body.quantity;

  //Also set status and deliveryType...
  const status = "Success";
  const deliveryType = "COD";
  // console.log("itemName : ", item);

  if (role !== "buyer") {
    try {
      const order = new orderSchema({
        userId,
        productId: itemId,
        quantity,
        status,
        price: itemPrice,
        billAmount: quantity * itemPrice,
        deliveryType,
      });

      const orderPlaced = await order.save();

      res.json(orderPlaced);
    } catch (error) {
      console.log(error);
    }
  } else {
    res.end("Not buyer");
  }
});

module.exports = router;
