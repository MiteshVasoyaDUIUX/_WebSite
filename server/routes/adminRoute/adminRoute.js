const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  protectLoginRegister,
  protectView,
  protectDeletionUpdation,
  allUsers,
  put,
} = require("../../middleware/authMiddleware");
const productSchema = require("../../schema/productSchema");
const userSchema = require("../../schema/userSchema");
const imageToBase = require("image-to-base64");

const {
  getStorage,
  ref,
  uploadBytes,
  listAll,
  deleteObject,
  updateMetadata,
} = require("firebase/storage");
const orderSchema = require("../../schema/orderSchema");
const conversationIdSchema = require("../../schema/conversationIdSchema");
const chatSchema = require("../../schema/chatSchema");

const storage = getStorage();

const multStorage = multer.memoryStorage();
const upload = multer({
  dest : "downloads/"
}).array("prodImage", 6);

//Admin Dashboard...
router.get("/", protectLoginRegister, (req, res) => {
  const user = req.user;
  const role = req.user.role;
  const token = req.token;

  if (role === "admin") {
    // console.log("Token In Auth Route : ", token);
    res.json({
      user,
      role,
      token,
    });
  } else {
    res.end("Not Admin...");
  }
});

//Get list of all Items by all Vendors...
router.get("/allproducts", protectDeletionUpdation, async (req, res) => {
  const allProducts = await productSchema.find();
  // console.log(allProducts);
  res.json(allProducts);
});

router.post("/addproducts", async (req, res) => {
  const imageBytes = req.body;
  let imgBytesArr = [];

  upload(req, res, (err) => {
    if (err) console.log("Error ", err);

    console.log("Upload : ", req.files)
  })

  // const file = req.files;
  // console.log("Image File : ", file);
  // console.log("Product Data : ", req.headers["content-type"]);

  const imageStorageRef = ref(storage, "image-6.jpeg");

  // const urlData = await fetch(image[0]);
  // const blob = await urlData.blob();
  // const objectUrl = URL.createObjectURL(image[0]);

  const newMetadata = {
    contentType: "image/jpeg",
  };

  // Update metadata properties
  updateMetadata(imageStorageRef, newMetadata)
    .then((metadata) => {
      // Updated metadata for 'images/forest.jpg' is returned in the Promise
    })
    .catch((error) => {
      // Uh-oh, an error occurred!
    });

  // console.log(objectUrl);

  const bytes = new Uint8Array([
    98, 108, 111, 98, 58, 104, 116, 116, 112, 58, 47, 47, 108, 111, 99, 97, 108,
    104, 111, 115, 116, 58, 51, 48, 48, 48, 47, 54, 98, 55, 56, 99, 101, 50, 51,
    45, 53, 97, 52, 56, 45, 52, 98, 54, 56, 45, 56, 102, 49, 55, 45, 48, 48, 51,
    97, 55, 52, 53, 57, 99, 51, 52, 55,
  ]);

  // const uploadImage = uploadBytes(imageStorageRef, bytes);

  // console.log(base64);
  // console.log(typeof image[0]);

  // var len = Buffer.byteLength(imageBytes[0]);
  // console.log(len);

  const {
    prodName,
    prodDesc,
    prodCategory,
    prodQuantity,
    prodPrice,
    prodImage,
  } = req.body;

  // console.log(
  //   prodName,
  //   prodDesc,
  //   prodCategory,
  //   prodQuantity,
  //   prodPrice,
  //   prodImage
  // );

  const createDate = new Date(Date.now());
  const date = createDate
    .toLocaleString("en-Uk", { timeZone: "UTC" })
    .split(",")[0];

  const newProduct = new productSchema({
    prodName,
    prodDesc,
    prodCategory,
    prodQuantity,
    prodPrice,
    prodImage,
    date,
  });

  // const productAdd = await newProduct.save();

  // console.log("Product Add Response :  ", productAdd);

  // res.json(productAdd);
});

//Get list of all Users (including Vendors and Buyers)...
router.get("/allusers", allUsers, async (req, res) => {
  const usersList = await userSchema.find();
  // console.log("usersList : ", usersList.length);
  if (usersList.length == 0) {
    console.log("Users Not found");
  } else {
    res.json(usersList);
  }
});

//Get all data...
router.get("/allorders/monthwise", allUsers, async (req, res) => {
  let ordersMonthwise = [];
  let date = new Date();
  let orders;
  const year = date.getFullYear();
  let nuoOfOrder;
  for (let i = 1; i <= 12; i++) {
    let isoDateLt = `${year}-${i}-31`;
    let isoDateGt = `${year}-${i}-01`;
    orders = await orderSchema.find({
      createdAt: { $gte: isoDateGt, $lt: isoDateLt },
    });
    noOfOrder = Object.keys(orders).length;
    ordersMonthwise.push({ month: i, orders: noOfOrder });
  }
  console.log("NO. of Orders : ", ordersMonthwise);

  res.json(ordersMonthwise);
});

router.get("/allorders", allUsers, async (req, res) => {
  const allOrders = await orderSchema.find().populate("userId");
  console.log("ALL Orders : ", allOrders);
  res.json(allOrders);
});

//Temporarily allUsers middleware is used...
router.post("/orderuserwise", allUsers, async (req, res) => {
  // const userId = req.body.userId.userId;
  // console.log('req.body', userId);
  const ordersList = await orderSchema.find().select("-productId");
  console.log("Order List By User Data : ", ordersList);
  if (ordersList) {
    res.json(ordersList);
  } else {
    res.json();
  }
});

router.delete("/product/:id", protectDeletionUpdation, async (req, res) => {
  const adminId = req.user.id;
  const role = req.user.role;

  console.log("Attempt to delete the product with 'id': ", req.params.id);
  const product = await productSchema.findByIdAndDelete(req.params.id);
  // console.log("req.user.role : ", req.user.role);

  if (!product) {
    console.log("No items found");
  } else {
    res.json(product);
  }
});

router.put("/product/:id", protectDeletionUpdation, async (req, res) => {
  const updatedData = req.body;
  // console.log("Attempt to Update the product with 'id': ", newData);
  const updatedProduct = await productSchema.findByIdAndUpdate(
    req.params.id,
    updatedData
  );

  if (!updatedProduct) {
    console.log("No items found");
  } else {
    res.status(200).json(updatedProduct);
  }
});

router.post("/acceptorder", protectDeletionUpdation, async (req, res) => {
  const orderId = req.body.orderId;
  const adminId = req.user.id;

  const updateData = await orderSchema.findByIdAndUpdate(orderId, {
    status: "Success",
  });

  const updatedData = await orderSchema.find();
  console.log("ORDER DETAILS : ", adminId);

  if (updateData) {
    const newMessage = `Congratulations, Your order is placed successfully. Order ID : ${updateData._id}`;
    const userId = updateData.userId;
    const date = new Date();

    let conversationId = "";

    conversationId = await conversationIdSchema
      .findOne({
        users: { $all: [adminId, userId] },
      })
      .select("_id");

    if (conversationId) {
      console.log("Conversation Schema : ", String(conversationId._id));
    } else {
      let newUsers = [adminId, userId];

      const newConversationData = new conversationIdSchema({
        users: newUsers,
      });

      const conversationEntry = await newConversationData.save();
      conversationId = await conversationIdSchema
        .findOne({
          users: { $all: [adminId, userId] },
        })
        .select("_id");
      console.log("Conversaiton Schema : ", conversationId._id);
    }

    const newChat = new chatSchema({
      conversationId: conversationId._id,
      senderId: adminId,
      message: newMessage,
      time: date,
    });
    const message = await newChat.save();
  }

  res.json(updatedData);
});

router.post("/cancelorder", protectDeletionUpdation, async (req, res) => {
  const orderId = req.body.orderId;

  const updateData = await orderSchema.findByIdAndUpdate(orderId, {
    status: "Cancel",
  });

  const updatedData = await orderSchema.find();
  console.log("ORDER DETAILS : ", orderId);

  res.json(updatedData);
});

module.exports = router;
