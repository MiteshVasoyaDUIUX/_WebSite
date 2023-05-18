const express = require("express");
const router = express.Router();
const {
  protectLoginRegister,
  protectView,
  protectDeletionUpdation,
  protectBuyer,
  protectChat,
} = require("../../middleware/authMiddleware");
const orderSchema = require("../../schema/orderSchema");
// const buyerSchema = require("../schema/buyerSchema");
const { route } = require("../authRoute/authRoutes");
const productSchema = require("../../schema/productSchema");
const userSchema = require("../../schema/userSchema");
const chatSchema = require("../../schema/chatSchema");
const conversationIdSchema = require("../../schema/conversationIdSchema");
const verify = require("../../firebase/config");
const { getAuth } = require("firebase/auth");
const couponCodeSchema = require("../../schema/couponCodeSchema");
const auth = getAuth();

const adminId = "aUS1ZeUBOHeZwYdiKlFV4wIPpvh2";

const actionCodeSettings = {
  url: "http://localhost:3000/",
  handleCodeInApp: true,
};

{
  //Dashboard of User...
  router.get("/", protectLoginRegister, async (req, res) => {
    const user = req.user;
    const role = req.user.role;
    const token = req.token;

    if (role === "buyer") {
      // console.log("allOrders");
      res.json({
        user,
        role,
        token,
      });
    } else {
      res.end("Not Buyer...");
    }
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

  router.put("/addtocart/:id", protectBuyer, async (req, res) => {
    const productId = req.body.productId;
    const id = req.params.id;

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

        res.status(200).json({ message: "Product Added To Cart" });
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

  router.put("/removewishlist/:id", protectBuyer, async (req, res) => {
    const productId = req.body.productId;
    const id = req.params.id;
    // const token = req.token;

    console.log("PRODUCT ID", productId);

    const response = await userSchema.findById(id).select("wishlist");

    console.log("Wishlist Response : ", response.wishlist);

    const inWishlist = response.wishlist;

    const isAddedtoWishlist = inWishlist.includes(productId);

    inWishlist.splice(inWishlist.indexOf(productId), 1);

    const removeFromWishlist = await userSchema.findByIdAndUpdate(id, {
      wishlist: inWishlist,
    });

    res.json({ productId });
  });

  router.get("/fetchwishlistprodid/:id", protectBuyer, async (req, res) => {
    // const productId = req.body.productId;
    const id = req.params.id;

    const wishlist = await userSchema.findById(id).select("wishlist");
    // console.log("Users Wishlist : ", wishlist.wishlist);
    res.json(wishlist.wishlist);
  });

  router.get("/fetchwishlistproducts/:id", protectBuyer, async (req, res) => {
    // const productId = req.body.productId;
    const id = req.params.id;
    let wishlistProducts = [];

    const wishlist = await userSchema.findById(id).select("wishlist");

    for (let index = 0; index < wishlist.wishlist.length; index++) {
      const productId = wishlist.wishlist[index];

      const findProduct = await productSchema
        .findById(productId)
        .select("-date -prodCategory -prodQuantity -paymentType -discount");

      wishlistProducts.push(findProduct);
    }

    res.json(wishlistProducts);
  });

  //Get all orders placed by the user...
  router.get("/fetchallorders/:id", protectView, async (req, res) => {
    const userId = req.user.id;

    const orders = await orderSchema.find({ userId }).sort({ createdAt: -1 });

    // console.log("orders : ", orders);

    if (orders) {
      res.status(200).json(orders);
    } else {
      res.json({ message: "No Order" });
    }
  });

  router.post("/rating", protectView, async (req, res) => {
    const ratingData = req.body;
    const userId = req.body.userId;
    const orderId = req.body.orderId;
    const productId = req.body.productId;
    const ratingValue = req.body.ratingValue;

    const product = await productSchema
      .findById(productId)
      .select("prodName rating reviews");

    let reviews = product.reviews;
    let rating = product.rating;

    const newRating =
      (rating * reviews.length + ratingValue) / (reviews.length + 1);

    const newReview = {
      userId,
      rating: ratingValue,
    };

    reviews.push(newReview);

    const updateRating = await productSchema.findByIdAndUpdate(productId, {
      reviews: reviews,
      rating: newRating.toFixed(1),
    });

    const updateOrder = await orderSchema.findByIdAndUpdate(orderId, {
      rating: ratingValue,
    });
    console.log("updateOrder : ", updateOrder);

    res.status(200).end();
  });

  //Call this when User select item and Pass ItemId in Params with URL...
  router.post("/placeorder", protectView, async (req, res) => {
    const userId = req.user.id;
    const checkoutData = req.body;
    const status = "Pending";
    let coupon;

    const productData = await productSchema
      .findById(checkoutData.productId)
      .select("prodQuantity");

    if (
      productData.prodQuantity > 0 &&
      productData.prodQuantity >= checkoutData.quantity
    ) {
      if (checkoutData.couponCode) {
        coupon = await couponCodeSchema.findOne({
          couponcode: checkoutData.couponCode,
        });
        if (coupon && coupon.quantity > 0) {
          totalAmount = Math.ceil(
            (checkoutData.productPrice *
              checkoutData.quantity *
              (100 - coupon.discount)) /
              100
          );
          console.log("Total Amount : ", totalAmount);
        } else {
          res.status(401).json({ message: "Coupon is not Valid" });
          return;
        }
      } else {
        totalAmount = checkoutData.productPrice * checkoutData.quantity;
      }

      const productId = checkoutData.productId;
      const orderQuantity = checkoutData.quantity;
      const deliveryAddress = checkoutData.deliveryAddress;
      let addressFound = false;

      const orderData = new orderSchema({
        userId: checkoutData.userId,
        productId,
        prodImage: checkoutData.prodImage,
        prodName: checkoutData.prodName,
        quantity: orderQuantity,
        status,
        totalAmount,
        paymentType: checkoutData.paymentOption,
        deliveryAddress: deliveryAddress,
        couponApplied: coupon?.couponcode,
      });

      const allAddress = await userSchema.findById(userId).select("address");

      for (let index = 0; index < allAddress.address.length; index++) {
        const element = allAddress.address[index];
        if (
          element.street === deliveryAddress.street &&
          element.city === deliveryAddress.city &&
          element.state === deliveryAddress.state &&
          element.pincode === deliveryAddress.pincode
        ) {
          addressFound = true;
        } else {
          continue;
        }
      }

      if (!addressFound) {
        allAddress.address.push(deliveryAddress);
        console.log("Adding Address...");

        const updateAddress = await userSchema.findByIdAndUpdate(userId, {
          address: allAddress.address,
        });
      }

      const orderAdd = await orderData.save();

      if (orderAdd) {
        const productData = await productSchema
          .findById(productId)
          .select("prodQuantity");
        const newQuantity = productData.prodQuantity - orderQuantity;

        const updatedProdData = await productSchema.findByIdAndUpdate(
          productId,
          {
            prodQuantity: newQuantity,
          }
        );

        if (coupon) {
          const reduceCouponQuantity = await couponCodeSchema
            .findOne({
              couponcode: coupon?.couponcode,
            })
            .select("quantity");
          const updateQuantity = await couponCodeSchema.findByIdAndUpdate(
            reduceCouponQuantity._id,
            { quantity: reduceCouponQuantity.quantity - 1 }
          );
        }
      }
      console.log("Order Data : ", orderAdd);
      res.status(200).json({ message: "Order Placed Successfully" });
    } else {
      res.status(400).json({ message: "Not Enough Quantity" });
    }
  });
}

router.post("/placecartorder", protectView, async (req, res) => {
  const userId = req.user.id;
  const checkoutData = req.body;
  const status = "Pending";
  let outOfStock = [];
  let successfull = [];

  console.log("Place Cart Order...");

  for (let index = 0; index < checkoutData.length; index++) {
    let totalAmount;
    let coupon;

    const productData = await productSchema
      .findById(checkoutData[index].productId)
      .select("prodQuantity");

    if (
      productData.prodQuantity > 0 &&
      productData.prodQuantity >= checkoutData[index].quantity
    ) {
      if (checkoutData[index].couponCode) {
        coupon = await couponCodeSchema.findOne({
          couponcode: checkoutData[index].couponCode,
        });
        if (coupon && coupon.quantity > 0) {
          totalAmount = Math.ceil(
            (checkoutData[index].productPrice *
              checkoutData[index].quantity *
              (100 - coupon.discount)) /
              100
          );
        } else {
          res.status(401).json({ message: "Coupon is not Valid" });
          return;
        }
      } else {
        totalAmount =
          checkoutData[index].productPrice * checkoutData[index].quantity;
      }

      const productId = checkoutData[index].productId;
      const orderQuantity = checkoutData[index].quantity;
      const deliveryAddress = checkoutData[index].deliveryAddress;
      let addressFound = false;

      const orderData = new orderSchema({
        userId: checkoutData[index].userId,
        productId,
        prodImage: checkoutData[index].prodImage,
        prodName: checkoutData[index].prodName,
        quantity: orderQuantity,
        status,
        totalAmount,
        paymentType: checkoutData[index].paymentOption,
        deliveryAddress: deliveryAddress,
        couponApplied: coupon?.couponcode,
      });

      const allAddress = await userSchema.findById(userId).select("address");

      for (let index = 0; index < allAddress.address.length; index++) {
        const element = allAddress.address[index];
        if (
          element.street === deliveryAddress.street &&
          element.city === deliveryAddress.city &&
          element.state === deliveryAddress.state &&
          element.pincode === deliveryAddress.pincode
        ) {
          addressFound = true;
        } else {
          continue;
        }
      }

      if (!addressFound) {
        allAddress.address.push(deliveryAddress);
        console.log("Adding Address...");

        const updateAddress = await userSchema.findByIdAndUpdate(userId, {
          address: allAddress.address,
        });
      }

      const orderAdd = await orderData.save();

      if (orderAdd && checkoutData[index].buypage !== 1) {
        const response = await userSchema.findById(userId).select("cart");
        const dataCart = response.cart;
        const indexOfProd = dataCart.findIndex(
          (e) => e.productId === checkoutData[index].productId
        );

        const removedItem = dataCart[indexOfProd];

        dataCart.splice(indexOfProd, 1);
        const removedFromCart = await userSchema.findByIdAndUpdate(userId, {
          cart: dataCart,
        });

        successfull.push(checkoutData[index].productId);
      }

      if (orderAdd) {
        const productData = await productSchema
          .findById(productId)
          .select("prodQuantity");
        const newQuantity = productData.prodQuantity - orderQuantity;

        const updatedProdData = await productSchema.findByIdAndUpdate(
          productId,
          {
            prodQuantity: newQuantity,
          }
        );
      }
    } else {
      outOfStock.push(productData.productId);
      console.log("Out Of Stocks Products : ", outOfStock.length);
      // res.status(400).json({ message: "Not Enough Quantity..." });
    }

    if (index === checkoutData.length - 1) {
      if (coupon) {
        const reduceCouponQuantity = await couponCodeSchema
          .findOne({
            couponcode: coupon?.couponcode,
          })
          .select("quantity");
        const updateQuantity = await couponCodeSchema.findByIdAndUpdate(
          reduceCouponQuantity._id,
          { quantity: reduceCouponQuantity.quantity - 1 }
        );
      }
    }
  }
  res.status(200).json({
    message: "Order Placed Successfully",
    outOfStock: outOfStock.length,
    successfull: successfull.length,
  });
});

router.get("/applycoupon/:couponcode", async (req, res) => {
  const coupon = await couponCodeSchema.findOne({
    couponcode: req.params.couponcode,
  });

  if (coupon.quantity <= 0 || coupon === null) {
    console.log("Coupon is not Valid...");
    res.status(401).json({ message: "Coupon is not valid...", isValid: false });
  } else {
    console.log("Send Coupon Data...", typeof coupon.quantity);
    res.status(200).json({
      discount: coupon.discount,
      couponcode: coupon.couponcode,
      message: "Coupon Applied Successfully",
      isValid: true,
    });
  }
});

router.post("/addaddress", protectView, async (req, res) => {
  try {
    const newAddress = req.body;
    const user = req.user;

    const findAddress = await userSchema.findById(user._id).select("address");

    findAddress.address.push(newAddress);

    const updateAddress = await userSchema.findByIdAndUpdate(user._id, {
      address: findAddress.address,
    });
    // console.log("Adding New Address :", findAddress);
    res.status(200).json(newAddress);
  } catch (error) {
    console.log("Error :", error.message);
  }
});

router.post("/removeaddress", protectView, async (req, res) => {
  try {
    const reqAddress = req.body;

    console.log("Remove Address/..;.");

    const findAddress = await userSchema
      .find({
        "address.street": reqAddress.street,
        "address.city": reqAddress.city,
        "address.state": reqAddress.state,
        "address.pincode": reqAddress.pincode,
      })
      .select("address");

    const userId = findAddress[0].id;
    const allAddress = findAddress[0].address;

    for (let index = 0; index < allAddress.length; index++) {
      if (
        allAddress[index].street === reqAddress.street &&
        allAddress[index].city === reqAddress.city &&
        allAddress[index].state === reqAddress.state &&
        allAddress[index].pincode === reqAddress.pincode
      ) {
        allAddress.splice(index, 1);
        const removeAddress = await userSchema.findByIdAndUpdate(userId, {
          address: allAddress,
        });
        res.status(200).json(index);
        break;
      }
    }
  } catch (error) {
    console.log("Error : ", error.message);
  }
  // console.log("New Address Array  :", findAddress[0].id);
});
module.exports = router;
