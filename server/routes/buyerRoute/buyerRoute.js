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

  const dataCart = response.cart;
  const indexOfProd = dataCart.findIndex((e) => e.productId === productId);

  console.log("Cart Response : ", dataCart);

  if (indexOfProd === -1) {
    const ppp = {
      productId,
      quantity: 1,
    };

    dataCart.push(ppp);

    console.log("Cart : ", dataCart);

    const addedToCart = await userSchema.findByIdAndUpdate(id, {
      cart: dataCart,
    });

    const newCart = await userSchema.findById(id).select("cart");

    // // console.log("Added To Cart : ", newCart.cart);
    res.json(newCart.cart);
  } else {
    const newQuantity = dataCart[indexOfProd].quantity + 1;
    if (newQuantity > 10) {
      res.status(400).json({ message: "Can not add quantity more than 10 " });
    } else {
      dataCart[indexOfProd] = {
        productId,
        quantity: newQuantity,
      };

      console.log("indexOfProd : ", dataCart[indexOfProd]);

      const addedToCart = await userSchema.findByIdAndUpdate(id, {
        cart: dataCart,
      });

      const newCart = await userSchema.findById(id).select("cart");

      res.json(newCart.cart);
    }
  }
});

router.put("/updatecart/:id", protectBuyer, async (req, res) => {
  const productId = req.body.productId;
  const id = req.params.id;
  const newData = req.body;

  console.log("PRODUCT ID", newData.newQuantity);

  const response = await userSchema.findById(id).select("cart");

  const dataCart = response.cart;
  const indexOfProd = dataCart.findIndex((e) => e.productId === productId);

  dataCart[indexOfProd].quantity = newData.newQuantity;
  console.log("Cart Response : ", dataCart[indexOfProd].quantity);

  const addedToCart = await userSchema.findByIdAndUpdate(id, {
    cart: dataCart,
  });

  const newCart = await userSchema.findById(id).select("cart");

  const cartLength = newCart.cart.length;
  let cartProducts = [];

  for (let i = 0; i < cartLength; i++) {
    const product = await productSchema.findById(newCart.cart[i].productId);
    let newProduct = {
      _id: product._id,
      prodName: product.prodName,
      prodDesc: product.prodDesc,
      prodCategory: product.prodCategory,
      prodQuantity: product.prodQuantity,
      prodPrice: product.prodPrice,
      discount: product.discount,
      rating: product.rating,
      deliveryType: product.deliveryType,
      prodImage: product.prodImage,
      date: product.date,
      quantity: newCart.cart[i].quantity,
    };
    cartProducts.push(newProduct);
    // console.log("PRODUCTS : ", newProduct)
  }
  console.log("Cart Product : ", cartProducts);

  res.json(cartProducts);
});

router.delete("/removefromcart/:id", protectBuyer, async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.id;

  const response = await userSchema.findById(userId).select("cart");
  const dataCart = response.cart;
  const indexOfProd = dataCart.findIndex((e) => e.productId === productId);

  const removedItem = dataCart[indexOfProd];

  dataCart.splice(indexOfProd, 1);
  console.log("Attempt to delete the product in 'cart': ", removedItem);

  const removedFromCart = await userSchema.findByIdAndUpdate(userId, {
    cart: dataCart,
  });

  const newCart = await userSchema.findById(userId).select("cart");

  const cartLength = newCart.cart.length;
  let cartProducts = [];

  // console.log("Users Wishlist : ", cart.cart);
  // console.log("Cart : ", cart.cart[0].quantity);

  for (let i = 0; i < cartLength; i++) {
    const product = await productSchema.findById(newCart.cart[i].productId);
    let newProduct = {
      _id: product._id,
      prodName: product.prodName,
      prodDesc: product.prodDesc,
      prodCategory: product.prodCategory,
      prodQuantity: product.prodQuantity,
      prodPrice: product.prodPrice,
      discount: product.discount,
      rating: product.rating,
      deliveryType: product.deliveryType,
      prodImage: product.prodImage,
      date: product.date,
      quantity: newCart.cart[i].quantity,
    };
    cartProducts.push(newProduct);
    // console.log("PRODUCTS : ", newProduct)
  }
  console.log("Cart Product : ", cartProducts);

  res.json(cartProducts);
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

  // console.log("USER ID", id);

  const wishlist = await userSchema.findById(id).select("wishlist");
  // console.log("Users Wishlist : ", wishlist.wishlist);

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
  // console.log("Cart : ", cart.cart[0].quantity);

  for (let i = 0; i < cartLength; i++) {
    const product = await productSchema.findById(cart.cart[i].productId);
    let newProduct = {
      _id: product._id,
      prodName: product.prodName,
      prodDesc: product.prodDesc,
      prodCategory: product.prodCategory,
      prodQuantity: product.prodQuantity,
      prodPrice: product.prodPrice,
      discount: product.discount,
      rating: product.rating,
      deliveryType: product.deliveryType,
      prodImage: product.prodImage,
      date: product.date,
      quantity: cart.cart[i].quantity,
    };
    cartProducts.push(newProduct);
    // console.log("PRODUCTS : ", newProduct)
  }
  // console.log("Cart Product : ", cart.cart);

  res.json(cartProducts);
});

//Get all orders placed by the user...
router.get("/fetchallorders/:id", protectView, async (req, res) => {
  const userId = req.user.id;

  // console.log("User id : ", userId)

  const orders = await orderSchema.find({ userId });
  // console.log("Orders : ", orders);

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
  const checkoutData = req.body;
  const status = "pending";

  console.log("In Place Order Part...", checkoutData.length);

  const date = new Date();
  const orderDate =
    String(date.getDate()) +
    "/" +
    String(date.getMonth()) +
    "/" +
    String(date.getFullYear());

  for (let index = 0; index < checkoutData.length; index++) {
    const totalAmount =
      checkoutData[index].productPrice * checkoutData[index].quantity;
    const productId = checkoutData[index].productId;
    const orderQuantity = checkoutData[index].quantity;

    const orderData = new orderSchema({
      userId: checkoutData[index].userId,
      productId,
      prodImage: checkoutData[index].prodImage,
      prodName: checkoutData[index].prodName,
      quantity: orderQuantity,
      status,
      totalAmount,
      paymentType: checkoutData[index].paymentOption,
      orderDate,
    });
    // console.log("CHECK OUT DATA : ", orderData);

    const orderAdd = await orderData.save();
    // console.log("Order Add : ", orderAdd);

    if (orderAdd && checkoutData[index].buypage !== 1) {
      const response = await userSchema.findById(userId).select("cart");
      const dataCart = response.cart;
      const indexOfProd = dataCart.findIndex(
        (e) => e.productId === checkoutData[index].productId
      );

      const removedItem = dataCart[indexOfProd];

      dataCart.splice(indexOfProd, 1);
      // console.log("Attempt to delete the product in 'cart': ", removedItem);

      const removedFromCart = await userSchema.findByIdAndUpdate(userId, {
        cart: dataCart,
      });

      // console.log("Removed Item : ", removedFromCart);
    }

    if (orderAdd) {
      const productData = await productSchema
        .findById(productId)
        .select("prodQuantity");
      const newQuantity = productData.prodQuantity - orderQuantity;

      const updatedProdData = await productSchema.findByIdAndUpdate(productId, {
        prodQuantity : newQuantity
      })
      console.log("Total Quantity : ", productData.prodQuantity, "New Data : ", updatedProdData);
    }
  }
  res.status(200).json({ message: "Order Placed Successfully" });
});

module.exports = router;
