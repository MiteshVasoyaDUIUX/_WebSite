const express = require("express");
const router = express.Router();
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
  getDownloadURL,
} = require("firebase/storage");

const verify = require("../../firebase/config");

const orderSchema = require("../../schema/orderSchema");
const conversationIdSchema = require("../../schema/conversationIdSchema");
const chatSchema = require("../../schema/chatSchema");
const storage = getStorage();

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }).array(
  "prodImage",
  6
);

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

router.post(
  "/addproducts",
  protectDeletionUpdation,
  upload,
  async (req, res) => {
    const imageBytes = req.body;
    let prodImageArray = [];
    const newMetadata = {
      contentType: "image/jpeg",
    };
    const {
      prodName,
      prodDesc,
      prodCategory,
      prodQuantity,
      prodPrice,
      prodMRP,
      paymentType,
    } = req.body;

    const createDate = new Date(Date.now());
    const date = createDate
      .toLocaleString("en-Uk", { timeZone: "UTC" })
      .split(",")[0];

    const files = req.files;
    // console.log("Files Length: ", files);

    for (let index = 0; index < files.length; index++) {
      const bytes = files[index].buffer;
      const imgName = files[index].originalname.split(".")[0];
      const imgExt = files[index].originalname.split(".")[1];
      const imgUploadDate = date.replaceAll("/", "_");

      const imageStorageRef = ref(
        storage,
        `/product-images/${prodName}/${imgName}_${imgUploadDate}.${imgExt}`
      );

      const uploadImage = await uploadBytes(imageStorageRef, bytes, newMetadata)
        .then((snapshot) => {
          return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
          prodImageArray.push(downloadURL);
        });
    }

    // console.log("Prod Image Array : ", prodImageArray);

    const newProduct = new productSchema({
      prodName: prodName[0],
      prodDesc: prodDesc[0],
      prodCategory: prodCategory[0],
      prodQuantity: prodQuantity[0],
      prodPrice: prodPrice[0],
      prodMRP: prodMRP[0],
      paymentType: paymentType,
      prodImage: prodImageArray,
      date,
    });

    const productAdd = await newProduct.save();

    // console.log("Product Add Response :  ", newProduct);

    res.json(productAdd);
  }
);

//Get list of all Users (including Vendors and Buyers)...
router.get("/allusers", allUsers, async (req, res) => {
  const usersList = await userSchema.find();

  const allUsers = await verify.allUsersFromFirebase();

  // console.log("All Users : ", allUsers.users[0].uid);
  // console.log("All Users FROM DB : ", usersList);

  for (let iindex = 0; iindex < usersList.length; iindex++) {
    const dbUserData = usersList[iindex];

    if (!dbUserData.emailVerified) {
      // console.log("User not verified : ", dbUserData)

      for (let jindex = 0; jindex < allUsers.users.length; jindex++) {
        const fbUserData = allUsers.users[jindex];

        if (dbUserData._id === fbUserData.uid) {
          // console.log("Not Verified", dbUserData._id, dbUserData.emailVerified);
          const emailVerifiedUpdate = await userSchema.findByIdAndUpdate(
            dbUserData._id,
            { emailVerified: fbUserData.emailVerified }
          );

          // console.log("Update : ", emailVerifiedUpdate)
          // dbUserData.emailVerified = fbUserData.emailVerified;
        }
      }
    }
    // console.log("User Id : ", user._id)
  }
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
  let noOfOrder;
  for (let i = 1; i <= 12; i++) {
    let isoDateLt = `${year}-${i}-31`;
    let isoDateGt = `${year}-${i}-01`;
    orders = await orderSchema.find({
      createdAt: { $gte: isoDateGt, $lt: isoDateLt },
    });
    noOfOrder = Object.keys(orders).length;
    ordersMonthwise.push({ month: i, orders: noOfOrder });
  }
  // console.log("NO. of Orders : ", ordersMonthwise);

  res.json(ordersMonthwise);
});

router.get("/allorders", allUsers, async (req, res) => {
  const allOrders = await orderSchema.find().populate("userId");
  // console.log("ALL Orders : ", allOrders);
  res.json(allOrders);
});

//Temporarily allUsers middleware is used...
router.post("/orderuserwise", allUsers, async (req, res) => {
  // const userId = req.body.userId.userId;
  // console.log('req.body', userId);
  const ordersList = await orderSchema.find().select("-productId");
  // console.log("Order List By User Data : ", ordersList);
  if (ordersList) {
    res.json(ordersList);
  } else {
    res.json();
  }
});

router.delete("/product/:id", protectDeletionUpdation, async (req, res) => {
  const adminId = req.user.id;
  const role = req.user.role;

  // console.log("Attempt to delete the product with 'id': ", req.params.id);
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
  // console.log("ORDER DETAILS : ", adminId);

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
      // console.log("Conversaiton Schema : ", conversationId._id);
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
  // console.log("ORDER DETAILS : ", orderId);

  res.json(updatedData);
});

router.post("/deleteuser", protectDeletionUpdation, async (req, res) => {
  const userId = req.body.userId;

  console.log("User Id : ", userId);

  const deleteUser = await userSchema.findByIdAndUpdate(userId, {
    isDeleted: true,
  });

  const updatedUser = await userSchema.findById(userId);

  const updateData = {
    userId,
    isDeleted: updatedUser.isDeleted,
  };

  res.json(updateData);
});

router.post("/blockunblockuser", protectDeletionUpdation, async (req, res) => {
  const userId = req.body.userId;
  const blockedUnblock = req.body.blocked;

  // console.log("User Id : ", userId, "Block-UnBlock : ", blockedUnblock);

  const blockUser = await userSchema.findByIdAndUpdate(userId, {
    isBlocked: blockedUnblock,
  });

  const updatedUser = await userSchema.findById(userId);

  const updateData = {
    userId,
    isBlocked: updatedUser.isBlocked,
  };
  res.json(updateData);
});

module.exports = router;
