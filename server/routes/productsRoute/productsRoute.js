const express = require("express");
const router = express.Router();

const productSchema = require("../../schema/productSchema");

//Get all orders placed by the user...
router.get("/products/", async (req, res) => {
  const productCategory = req.query.category;
  const page = req.query.page;
  const to = 9;
  let moreProduct;

  const skipProducts = page * to - 9;

  // console.log("productReqData : ", productCategory);
  const totalProducts = await productSchema.find({
    prodCategory: { $regex: `${productCategory}`, $options: "i" },
  });

  const resProducts = await productSchema
    .find({
      prodCategory: { $regex: `${productCategory}`, $options: "i" },
    })
    .skip(skipProducts)
    .limit(to);

  console.log("Products :", totalProducts, resProducts);

  moreProduct = Number(to) * Number(page) < totalProducts.length;

  const response = {
    products: resProducts,
    nextPage: Number(page) + 1,
    moreProduct,
  };

  if (response) {
    res.json(response);
  } else {
    res.status(404);
  }
});

router.get("/search/:quary", async (req, res) => {
  const quary = req.quary;
  console.log("Quary : ", quary);
  const searchedProducts = await productSchema.find({
    prodName: { $regex: `${quary}`, $options: "i" },
  });
  res.json(searchedProducts);
});

router.get("/product/:id", async (req, res) => {
  const productId = req.params;
  // console.log(productId);
  const product = await productSchema.findById(productId.id);
  // console.log("Found One Product  : ", product);

  res.json(product);
  // if (products) {
  //   // console.log(products);
  //   res.json(products);
  // } else {
  //   res.status(404);
  // }
});

router.get("/newarrivals", async (req, res) => {
  const product = await productSchema.find();
  console.log("Found One Product  : ", product.length);
  res.json(product);
});

router.get("/trendingproducts", async (req, res) => {
  const product = await productSchema.find().sort({ rating: -1 });
  // console.log("Found One Product  : ", product.length);
  res.json(product);
});

module.exports = router;
