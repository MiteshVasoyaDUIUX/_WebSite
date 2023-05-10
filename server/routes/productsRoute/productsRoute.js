const express = require("express");
const router = express.Router();

const productSchema = require("../../schema/productSchema");

//Get all orders placed by the user...
router.post("/products/", async (req, res) => {
  const productCategory = req.query.category;
  const page = req.query.page;
  const to = 9;
  const filter = req.body;
  let moreProduct;
  let reqProdQuantity;

  if (filter.outOfStock) {
    reqProdQuantity = 0;
  } else {
    reqProdQuantity = 1;
  }

  const skipProducts = page * to - 9;

  const totalProducts = await productSchema.find({
    prodCategory: { $regex: `${productCategory}`, $options: "i" },
  });

  const resProducts = await productSchema
    .find({
      prodCategory: { $regex: `${productCategory}`, $options: "i" },
    })
    .skip(skipProducts)
    .limit(to);

  moreProduct = Number(to) * Number(page) < totalProducts.length;

  const response = {
    products: resProducts,
    nextPage: Number(page) + 1,
    moreProduct,
  };

  // console.log("Total Products : ", totalProducts.length);
  // console.log("Limited Products : ", resProducts.length);
  // console.log("Sent Products : ", Number(page) * 9);

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
  const product = await productSchema.findById(productId.id);

  res.json(product);
});

router.get("/newarrivals", async (req, res) => {
  const page = req.query.page;
  const to = 9;
  const filter = req.body;
  let moreProduct;
  let reqProdQuantity;

  // console.log("Req.Query : ", page);

  const skipProducts = page * to - 9;

  const totalProducts = await productSchema.find();

  const resProducts = await productSchema.find().skip(skipProducts).limit(to);

  moreProduct = Number(to) * Number(page) < totalProducts.length;

  const response = {
    products: resProducts,
    nextPage: Number(page) + 1,
    moreProduct,
  };

  console.log("Total Products : ", totalProducts.length);
  console.log("Limited Products : ", resProducts.length);
  console.log("Sent Products : ", Number(page) * 9);

  if (response) {
    res.json(response);
  } else {
    res.status(404);
  }
});

router.get("/newarrivalscomp", async (req, res) => {
  const product = await productSchema
    .find({ prodQuantity: { $gte: 1 } })
    .limit(4);
  res.json(product);
});

router.get("/trendingproducts", async (req, res) => {
  const page = req.query.page;
  const to = 9;
  const filter = req.body;
  let moreProduct;
  let reqProdQuantity;

  // console.log("Req.Query : ", page);

  const skipProducts = page * to - 9;

  const totalProducts = await productSchema.find();

  const resProducts = await productSchema
    .find()
    .skip(skipProducts)
    .limit(to)
    .sort({ rating: -1 });

  moreProduct = Number(to) * Number(page) < totalProducts.length;

  const response = {
    products: resProducts,
    nextPage: Number(page) + 1,
    moreProduct,
  };

  // console.log("Total Products : ", totalProducts.length);
  // console.log("Limited Products : ", resProducts.length);
  // console.log("Sent Products : ", Number(page) * 9);

  if (response) {
    res.json(response);
  } else {
    res.status(404);
  }
});

router.get("/trendingproductscomp", async (req, res) => {
  const product = await productSchema
    .find({ prodQuantity: { $gte: 1 } })
    .limit(50);
  res.json(product);
});

module.exports = router;
