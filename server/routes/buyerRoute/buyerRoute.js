const express = require("express");
const router = express.Router();
const {
  protectLoginRegister,
  protectView,
  protectDeletionUpdation,
  protectBuyer,
} = require("../../middleware/authMiddleware");
const orderSchema = require("../../schema/orderSchema");
// const buyerSchema = require("../schema/buyerSchema");
const { route } = require("../authRoute/authRoutes");
const itemSchema = require("../../schema/productSchema");
const userSchema = require("../../schema/userSchema");

//Dashboard of User...
router.get("/", protectLoginRegister, async (req, res) => {
  const user = req.user;
  const role = req.user.role;
  const token = req.token;

  if (role === "buyer") {
    console.log("allOrders");
    res.json({
      user,
      role,
      token,
    });
  } else {
    res.end("Not Buyer...");
  }
});

router.put("/addtocart/:id", protectBuyer, async (req, res) => {
  const productId = req.body.productId;
  const id = req.params.id;
  // const token = req.token;

  console.log("PRODUCT ID", productId);

  const response = await userSchema.findById(id).select("cart");

  console.log("Cart Response : ", response.cart);

  if (response.cart.length === 0) {
    let cart = [];
    cart.push(productId);
    console.log("Cart : ", cart);

    const addedToCart = await userSchema.findByIdAndUpdate(id, {
      cart,
    });

    const newCart = await userSchema.findById(id).select("cart");

    // console.log("Added To Cart : ", newCart.cart);
    res.json(newCart.cart);
  } else {
    const inCart = response.cart;

    inCart.push(productId);
    const addedToCart = await userSchema.findByIdAndUpdate(id, {
      cart: inCart,
    });
    const newCart = await userSchema.findById(id).select("cart");

    // console.log("Added To Cart : ", newCart.cart);
    res.json(newCart.cart);
  }
});

router.put("/addtowishlist/:id", protectBuyer, async (req, res) => {
  const productId = req.body.productId;
  const id = req.params.id;
  // const token = req.token;

  console.log("PRODUCT ID", productId);

  const response = await userSchema.findById(id).select("wishlist");

  // console.log("Wishlist Response : ", response.wishlist);

  if (!response) {
    let wishlist = [];
    wishlist.push(productId);
    console.log("Wishlist : ", wishlist);

    const addedToWishlist = await userSchema.findByIdAndUpdate(id, {
      wishlist,
    });
    const newWishList = await userSchema.findById(id).select("wishlist");
    console.log("New WishList : ", newWishList.wishlist);

    res.json(newWishList.wishlist);
  } else {
    const inWishlist = response.wishlist;

    const isAddedtoWishlist = inWishlist.includes(productId);

    if (isAddedtoWishlist) {
      inWishlist.splice(inWishlist.indexOf(productId), 1);
      const addedToWishlist = await userSchema.findByIdAndUpdate(id, {
        wishlist: inWishlist,
      });

      const newWishList = await userSchema.findById(id).select("wishlist");
      console.log("New WishList : ", newWishList.wishlist);

      res.json(newWishList.wishlist);
    } else {
      inWishlist.push(productId);
      const addedToWishlist = await userSchema.findByIdAndUpdate(id, {
        wishlist: inWishlist,
      });

      const newWishList = await userSchema.findById(id).select("wishlist");
      console.log("New WishList : ", newWishList.wishlist);

      res.json(newWishList.wishlist);
    }
  }
});

router.get("/fetchwishlist/:id", protectBuyer, async (req, res) => {
  // const productId = req.body.productId;
  const id = req.params.id;
  // const token = req.token;

  console.log("USER ID", id);

  const wishlist = await userSchema.findById(id).select("wishlist");
  console.log("Users Wishlist : ", wishlist.wishlist);

  res.json(wishlist.wishlist);
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
