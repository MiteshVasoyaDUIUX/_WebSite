const express = require("express");
const router = express.Router();

const productSchema = require("../../schema/productSchema");

//Get all orders placed by the user...
router.get("/", async (req, res) => {
  const products = await productSchema.find();

  if (products) {
    // console.log(products);
    res.json(products);
  } else {
    res.status(404);
  }
});

router.get("/product/:id", async (req, res) => {

  const productId = req.params;
  console.log(productId);
  res.json(productId);
  // const products = await productSchema.find();

  // if (products) {
  //   // console.log(products);
  //   res.json(products);
  // } else {
  //   res.status(404);
  // }
});


module.exports = router;
