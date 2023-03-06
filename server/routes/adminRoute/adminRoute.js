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
const productSchema = require('../../schema/productSchema');
const userSchema = require("../../schema/userSchema");
const imageToBase = require("image-to-base64");

const {
  getStorage,
  ref,
  uploadBytes,
  listAll,
  deleteObject,
} = require("firebase/storage");

const storage = getStorage();
const memoryStorage = multer.memoryStorage();
const upload = multer({ memoryStorage });

//Admin Dashboard...
router.get("/", protectLoginRegister, (req, res) => {
  const adminId = req.user.id;
  const role = req.user.role;
  const token = req.token;

  if (role === "admin") {
    console.log("Token In Auth Route : ", token);
    res.json({
      adminId,
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
  console.log(allProducts);
  res.json(allProducts);
});

router.post("/addproducts", protectDeletionUpdation, async (req, res) => {
  // const image = req.body.prodImage;
  // const imageStorageRef = ref(storage, "image-1");

  // const urlData = await fetch(image[0]);
  // const blob = await urlData.blob();
  // const objectUrl = URL.createObjectURL(image[0]);

  // console.log(objectUrl);
  // const uploadImage = uploadBytes(imageStorageRef, image[0]);

  // console.log(base64);
  // console.log(typeof image[0]);

  const {
    prodName,
    prodDesc,
    prodCategory,
    prodQuantity,
    prodPrice,
    prodImage,
  } = req.body;
  console.log(
    prodName,
    prodDesc,
    prodCategory,
    prodQuantity,
    prodPrice,
    prodImage
  );

  const newProduct = new productSchema({
    prodName,
    prodDesc,
    prodCategory,
    prodQuantity,
    prodPrice,
    prodImage,
  });

  const productAdd = await newProduct.save();

  console.log("Product Add Response :  ", productAdd);

  res.json(productAdd);
});

//Get list of all Users (including Vendors and Buyers)...
router.get("/allusers", allUsers, async (req, res) => {
  const adminId = req.user.id;
  const role = req.user.role;

  if (role === "admin") {
    const items = await userSchema.find();
    console.log("req.user.role : ", req.user.role);
    if (items.length == 0) {
      console.log("Item Not found");
    } else {
      res.json(items);
    }
  } else {
    res.end("Not Admin. If You are, Contact another Admin...");
  }
});

router.delete("/item/:id", protectDeletionUpdation, async (req, res) => {
  const adminId = req.user.id;
  const role = req.user.role;

  const item = await productSchema.findByIdAndDelete(req.params.id);
  // console.log("req.user.role : ", req.user.role);

  if (!item) {
    console.log("No items found");
  } else {
    res.json(item);
  }
});

module.exports = router;
