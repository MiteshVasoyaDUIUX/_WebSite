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
const productSchema = require("../../schema/productSchema");
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
    const isAddedtoCart = inCart.includes(productId);

    if (!isAddedtoCart) {
      inCart.push(productId);
      const addedToCart = await userSchema.findByIdAndUpdate(id, {
        cart: inCart,
      });
      const newCart = await userSchema.findById(id).select("cart");

      // console.log("Added To Cart : ", newCart.cart);
      res.json(newCart.cart);
    } else {
      const newCart = await userSchema.findById(id).select("cart");

      // console.log("Added To Cart : ", newCart.cart);
      res.json(newCart.cart);
    }
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

router.get("/fetchcart/:id", protectBuyer, async (req, res) => {
  // const productId = req.body.productId;
  const id = req.params.id;
  // const token = req.token;

  console.log("USER ID", id);

  const cart = await userSchema.findById(id).select("cart");
  const cartLength = cart.cart.length;
  let cartProducts = [];

  // console.log("Users Wishlist : ", cart.cart);
  console.log("Cart Length : ", cartLength);

  for (let i = 0; i < cartLength; i++) {
    const product = await productSchema.findById(cart.cart[i]);
    cartProducts.push(product);
  }
  console.log("Cart Product : ", cartProducts);

  res.json(cartProducts);
});

//Get all orders placed by the user...
router.get("/fetchallorders/:id", protectView, async (req, res) => {
  const userId = req.user.id;

  // console.log("User id : ", userId)

  const orders = await orderSchema.find({ userId });
  console.log("Orders : ", orders);

  if (orders) {
    res.status(200).json(orders);
  } else {
    res.json({ message: "No Order" });
  }
  // try {
  //   if (role === "buyer") {
  //     const orders = await orderSchema.find({ userId });
  //     res.json(orders);
  //   } else {
  //     res.end("Not Buyer");
  //   }
  // } catch (error) {
  //   console.log("Error : ", error);
  // }
});

//Call this when User select item and Pass ItemId in Params with URL...
router.post("/placeorder", protectView, async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;
  const checkoutData = req.body;
  const productId = checkoutData.productId;
  const quantity = checkoutData.quantity;
  const status = "pending";
  const totalAmount = checkoutData.productPrice * checkoutData.quantity;
  const paymentType = checkoutData.paymentOption;
  const prodImage = checkoutData.prodImage;
  const prodName = checkoutData.prodName;
  const date = new Date();

  const orderDate =
    String(date.getDate()) +
    "/" +
    String(date.getMonth()) +
    "/" +
    String(date.getFullYear());

  const orderData = new orderSchema({
    userId,
    productId,
    prodImage,
    prodName,
    quantity,
    status,
    totalAmount,
    paymentType,
    orderDate,
  });

  const orderAdd = await orderData.save();

  // console.log("Order Data : ", orderAdd._id);

  if (orderAdd) {
    res.status(200).json({ orderId: orderAdd._id });
  }
});

module.exports = router;
