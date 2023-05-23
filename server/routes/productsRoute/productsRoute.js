const express = require("express");
const router = express.Router();
const colors = require("colors");
const productSchema = require("../../schema/productSchema");
const orderSchema = require("../../schema/orderSchema");
const {
  ratingFilter,
  priceFilter,
  PodFilter,
  discountFilter,
} = require("../../../FilterFunctions/filterFunctions");

//Get all orders placed by the user...
router.post("/products/", async (req, res) => {
  const productCategory = req.query.category;
  const page = req.query.page;
  const sortBy = req.query.sortBy;
  const to = 30;
  const filter = req.body;

  let price = filter.price;
  let rating = filter.rating !== null ? filter.rating : 0;
  let discount = filter.discount !== undefined ? Number(filter.discount) : 0;
  let POD = filter.POD === true ? "COD" : "";
  let includeOutOfStock = filter.includeOutOfStock === true ? 0 : 1;

  let moreProduct;
  let reqProdQuantity;

  if (filter.outOfStock) {
    reqProdQuantity = 0;
  } else {
    reqProdQuantity = 1;
  }

  const newArrivals = async () => {
    const skipProducts = page * to - 30;

    const totalProducts = await productSchema.find({
      $and: [
        { prodCategory: { $regex: `${productCategory}`, $options: "i" } },
        { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
        { rating: { $gte: `${rating}` } },
        { discount: { $gte: `${discount}` } },
        { paymentType: { $regex: `${POD}`, $options: "i" } },
        { prodQuantity: { $gte: `${includeOutOfStock}` } },
      ],
    });

    const resProducts = await productSchema
      .find({
        $and: [
          { prodCategory: { $regex: `${productCategory}`, $options: "i" } },
          { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
          { rating: { $gte: `${rating}` } },
          { discount: { $gte: `${discount}` } },
          { paymentType: { $regex: `${POD}`, $options: "i" } },
          { prodQuantity: { $gte: `${includeOutOfStock}` } },
        ],
      })
      .skip(skipProducts)
      .limit(to);

    moreProduct = Number(to) * Number(page) < totalProducts.length;

    const response = {
      products: resProducts,
      nextPage: Number(page) + 1,
      moreProduct,
    };

    // console.log("New Arrivals Total Products : ", totalProducts.length);
    // console.log("New Arrivals Limited Products : ", resProducts.length);
    // console.log("New Arrivals Sent Products : ", Number(page) * 30);

    if (response) {
      res.json(response);
    } else {
      res.status(404);
    }
  };

  const priceHighToLow = async () => {
    const skipProducts = page * to - 30;

    const totalProducts = await productSchema.find({
      $and: [
        { prodCategory: { $regex: `${productCategory}`, $options: "i" } },
        { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
        { rating: { $gte: `${rating}` } },
        { discount: { $gte: `${discount}` } },
        { paymentType: { $regex: `${POD}`, $options: "i" } },
        { prodQuantity: { $gte: `${includeOutOfStock}` } },
      ],
    });

    const resProducts = await productSchema
      .find({
        $and: [
          { prodCategory: { $regex: `${productCategory}`, $options: "i" } },
          { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
          { rating: { $gte: `${rating}` } },
          { discount: { $gte: `${discount}` } },
          { paymentType: { $regex: `${POD}`, $options: "i" } },
          { prodQuantity: { $gte: `${includeOutOfStock}` } },
        ],
      })
      .skip(skipProducts)
      .limit(to)
      .sort({ prodPrice: -1 });

    moreProduct = Number(to) * Number(page) < totalProducts.length;

    const response = {
      products: resProducts,
      nextPage: Number(page) + 1,
      moreProduct,
    };

    // console.log("Total Products : ", totalProducts.length);
    // console.log("Limited Products Price Hight To Low : ", resProducts.length);
    // console.log("Sent Products : ", Number(page) * 9);

    if (response) {
      res.json(response);
    } else {
      res.status(404);
    }
  };

  const priceLowToHigh = async () => {
    const skipProducts = page * to - 30;

    const totalProducts = await productSchema.find({
      $and: [
        { prodCategory: { $regex: `${productCategory}`, $options: "i" } },
        { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
        { rating: { $gte: `${rating}` } },
        { discount: { $gte: `${discount}` } },
        { paymentType: { $regex: `${POD}`, $options: "i" } },
        { prodQuantity: { $gte: `${includeOutOfStock}` } },
      ],
    });

    const resProducts = await productSchema
      .find({
        $and: [
          { prodCategory: { $regex: `${productCategory}`, $options: "i" } },
          { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
          { rating: { $gte: `${rating}` } },
          { discount: { $gte: `${discount}` } },
          { paymentType: { $regex: `${POD}`, $options: "i" } },
          { prodQuantity: { $gte: `${includeOutOfStock}` } },
        ],
      })
      .skip(skipProducts)
      .limit(to)
      .sort({ prodPrice: 1 });

    moreProduct = Number(to) * Number(page) < totalProducts.length;

    const response = {
      products: resProducts,
      nextPage: Number(page) + 1,
      moreProduct,
    };

    // console.log("Total Products : ", totalProducts.length);
    // console.log("Limited Products Price Hight To Low : ", resProducts.length);
    // console.log("Sent Products : ", Number(page) * 9);

    if (response) {
      res.json(response);
    } else {
      res.status(404);
    }
  };

  const highRating = async () => {
    const skipProducts = page * to - 30;

    const totalProducts = await productSchema.find({
      $and: [
        { prodCategory: { $regex: `${productCategory}`, $options: "i" } },
        { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
        { rating: { $gte: `${rating}` } },
        { discount: { $gte: `${discount}` } },
        { paymentType: { $regex: `${POD}`, $options: "i" } },
        { prodQuantity: { $gte: `${includeOutOfStock}` } },
      ],
    });

    const resProducts = await productSchema
      .find({
        $and: [
          { prodCategory: { $regex: `${productCategory}`, $options: "i" } },
          { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
          { rating: { $gte: `${rating}` } },
          { discount: { $gte: `${discount}` } },
          { paymentType: { $regex: `${POD}`, $options: "i" } },
          { prodQuantity: { $gte: `${includeOutOfStock}` } },
        ],
      })
      .skip(skipProducts)
      .limit(to)
      .sort({ rating: -1 });

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
  };

  switch (sortBy) {
    case "newArrivals":
      newArrivals();
      break;

    case "priceHighToLow":
      priceHighToLow();
      break;

    case "priceLowToHigh":
      priceLowToHigh();
      break;

    case "highRating":
      highRating();
      break;

    default:
      break;
  }
});

//Real-time Search Query Response...
router.get("/query/", async (req, res) => {
  const query = req.query.query;
  const queryWords = query.split(" ");

  // console.log(`Query Words  :  ${queryWords}`.rainbow.white);

  const regexArray = queryWords.map((word) => new RegExp(word, "i"));

  const conditionsProdName = regexArray.map((regex) => ({ prodName: regex }));
  const conditionsProdDesc = regexArray.map((regex) => ({ prodDesc: regex }));
  const conditionsProdCategory = regexArray.map((regex) => ({
    prodCategory: regex,
  }));

  const andQueryProdName = { $and: conditionsProdName };
  const andQueryProdDesc = { $and: conditionsProdDesc };
  const andQueryProdCategory = { $and: conditionsProdCategory };

  const orQueryProdName = { $or: conditionsProdName };
  const orQueryProdDesc = { $or: conditionsProdDesc };
  const orQueryProdCategory = { $or: conditionsProdCategory };

  const fieldConditions = queryWords.map((word) => ({
    $or: [
      { prodName: { $regex: word, $options: "i" } },
      { prodDesc: { $regex: word, $options: "i" } },
      { prodCategory: { $regex: word, $options: "i" } },
    ],
  }));

  // console.log("REGEX : ", regexArray);
  // console.log("OR REGEX : ", conditionsProdName);
  // console.log("OR QUERY : ", andQueryProdName);

  const queryResults = await productSchema
    .find(andQueryProdName)
    .select("prodName")
    .limit(10);

  if (queryResults.length <= 10) {
    const queryResults2 = await productSchema
      .find(andQueryProdDesc)
      .select("prodName")
      .limit(10);

    queryResults2.map((result) => {
      if (queryResults.length <= 10) queryResults.push(result);
    });
  }

  if (queryResults.length <= 10) {
    const queryResults3 = await productSchema
      .find(andQueryProdCategory)
      .select("prodName")
      .limit(10);

    queryResults3.map((result) => {
      if (queryResults.length <= 10) queryResults.push(result);
    });
  }

  if (queryResults.length <= 10) {
    const queryResults4 = await productSchema
      .find({ $or: fieldConditions })
      .select("prodName")
      .limit(10);

    queryResults4.map((result) => {
      if (queryResults.length <= 10) queryResults.push(result);
    });
  }
  // console.log("ProdName Length : ", queryResults);

  setTimeout(() => {
    res.json({ response: queryResults });
  }, 0);
});

router.post("/search", async (req, res) => {
  const page = req.query.page;
  const query = req.query.query;
  const sortBy = req.query.sortBy;
  const to = 30;
  const filter = req.body;
  let moreProduct;
  let reqProdQuantity;

  let price = filter.price;
  let rating = filter.rating !== null ? filter.rating : 0;
  let discount = filter.discount !== undefined ? Number(filter.discount) : 0;
  let POD = filter.POD === true ? "COD" : "";
  let includeOutOfStock = filter.includeOutOfStock === true ? 0 : 1;

  if (filter.outOfStock) {
    reqProdQuantity = 0;
  } else {
    reqProdQuantity = 1;
  }

  const newArrivals = async () => {
    const skipProducts = page * to - 30;

    const totalProducts = await productSchema.find({
      $and: [
        { prodName: { $regex: `${query}`, $options: "i" } },
        { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
        { rating: { $gte: `${rating}` } },
        { discount: { $gte: `${discount}` } },
        { paymentType: { $regex: `${POD}`, $options: "i" } },
        { prodQuantity: { $gte: `${includeOutOfStock}` } },
      ],
    });

    const resProducts = await productSchema
      .find({
        $and: [
          { prodName: { $regex: `${query}`, $options: "i" } },
          { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
          { rating: { $gte: `${rating}` } },
          { discount: { $gte: `${discount}` } },
          { paymentType: { $regex: `${POD}`, $options: "i" } },
          { prodQuantity: { $gte: `${includeOutOfStock}` } },
        ],
      })
      .skip(skipProducts)
      .limit(to);

    moreProduct = Number(to) * Number(page) < totalProducts.length;

    console.log("RESPONSE :", resProducts.length);

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
  };

  const priceHighToLow = async () => {
    const skipProducts = page * to - 30;

    const totalProducts = await productSchema.find({
      $and: [
        { prodName: { $regex: `${query}`, $options: "i" } },
        { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
        { rating: { $gte: `${rating}` } },
        { discount: { $gte: `${discount}` } },
        { paymentType: { $regex: `${POD}`, $options: "i" } },
        { prodQuantity: { $gte: `${includeOutOfStock}` } },
      ],
    });

    const resProducts = await productSchema
      .find({
        $and: [
          { prodName: { $regex: `${query}`, $options: "i" } },
          { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
          { rating: { $gte: `${rating}` } },
          { discount: { $gte: `${discount}` } },
          { paymentType: { $regex: `${POD}`, $options: "i" } },
          { prodQuantity: { $gte: `${includeOutOfStock}` } },
        ],
      })
      .skip(skipProducts)
      .limit(to)
      .sort({ prodPrice: -1 });

    moreProduct = Number(to) * Number(page) < totalProducts.length;

    const response = {
      products: resProducts,
      nextPage: Number(page) + 1,
      moreProduct,
    };

    // console.log("Total Products : ", totalProducts.length);
    console.log("Limited Products Price Hight To Low : ", resProducts.length);
    // console.log("Sent Products : ", Number(page) * 9);

    if (response) {
      res.json(response);
    } else {
      res.status(404);
    }
  };

  const priceLowToHigh = async () => {
    const skipProducts = page * to - 30;

    const totalProducts = await productSchema.find({
      $and: [
        { prodName: { $regex: `${query}`, $options: "i" } },
        { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
        { rating: { $gte: `${rating}` } },
        { discount: { $gte: `${discount}` } },
        { paymentType: { $regex: `${POD}`, $options: "i" } },
        { prodQuantity: { $gte: `${includeOutOfStock}` } },
      ],
    });

    const resProducts = await productSchema
      .find({
        $and: [
          { prodName: { $regex: `${query}`, $options: "i" } },
          { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
          { rating: { $gte: `${rating}` } },
          { discount: { $gte: `${discount}` } },
          { paymentType: { $regex: `${POD}`, $options: "i" } },
          { prodQuantity: { $gte: `${includeOutOfStock}` } },
        ],
      })
      .skip(skipProducts)
      .limit(to)
      .sort({ prodPrice: 1 });

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
  };

  const highRating = async () => {
    const skipProducts = page * to - 30;

    const totalProducts = await productSchema.find({
      $and: [
        { prodName: { $regex: `${query}`, $options: "i" } },
        { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
        { rating: { $gte: `${rating}` } },
        { discount: { $gte: `${discount}` } },
        { paymentType: { $regex: `${POD}`, $options: "i" } },
        { prodQuantity: { $gte: `${includeOutOfStock}` } },
      ],
    });

    const resProducts = await productSchema
      .find({
        $and: [
          { prodName: { $regex: `${query}`, $options: "i" } },
          { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
          { rating: { $gte: `${rating}` } },
          { discount: { $gte: `${discount}` } },
          { paymentType: { $regex: `${POD}`, $options: "i" } },
          { prodQuantity: { $gte: `${includeOutOfStock}` } },
        ],
      })
      .skip(skipProducts)
      .limit(to)
      .sort({ rating: -1 });

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
  };

  switch (sortBy) {
    case "newArrivals":
      newArrivals();
      break;

    case "priceHighToLow":
      priceHighToLow();
      break;

    case "priceLowToHigh":
      priceLowToHigh();
      break;

    case "highRating":
      highRating();
      break;

    default:
      break;
  }
});

router.get("/product/:id", async (req, res) => {
  const productId = req.params;
  const product = await productSchema.findById(productId.id);

  res.json(product);
});

router.post("/newarrivals", async (req, res) => {
  const page = req.query.page;
  const sortBy = req.query.sortBy;
  const to = 30;
  const filter = req.body;
  let moreProduct;
  let reqProdQuantity;

  let price = filter.price;
  let rating = filter.rating !== null ? filter.rating : 0;
  let discount = filter.discount !== undefined ? Number(filter.discount) : 0;
  let POD = filter.POD === true ? "COD" : "";
  let includeOutOfStock = filter.includeOutOfStock === true ? 0 : 1;

  if (filter.outOfStock) {
    reqProdQuantity = 0;
  } else {
    reqProdQuantity = 1;
  }

  const newArrivals = async () => {
    const skipProducts = page * to - 30;

    const totalProducts = await productSchema.find({
      $and: [
        { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
        { rating: { $gte: `${rating}` } },
        { discount: { $gte: `${discount}` } },
        { paymentType: { $regex: `${POD}`, $options: "i" } },
        { prodQuantity: { $gte: `${includeOutOfStock}` } },
      ],
    });

    const resProducts = await productSchema
      .find({
        $and: [
          { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
          { rating: { $gte: `${rating}` } },
          { discount: { $gte: `${discount}` } },
          { paymentType: { $regex: `${POD}`, $options: "i" } },
          { prodQuantity: { $gte: `${includeOutOfStock}` } },
        ],
      })
      .skip(skipProducts)
      .limit(to);

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
  };

  const priceHighToLow = async () => {
    const skipProducts = page * to - 30;

    const totalProducts = await productSchema.find({
      $and: [
        { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
        { rating: { $gte: `${rating}` } },
        { discount: { $gte: `${discount}` } },
        { paymentType: { $regex: `${POD}`, $options: "i" } },
        { prodQuantity: { $gte: `${includeOutOfStock}` } },
      ],
    });

    const resProducts = await productSchema
      .find({
        $and: [
          { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
          { rating: { $gte: `${rating}` } },
          { discount: { $gte: `${discount}` } },
          { paymentType: { $regex: `${POD}`, $options: "i" } },
          { prodQuantity: { $gte: `${includeOutOfStock}` } },
        ],
      })
      .skip(skipProducts)
      .limit(to)
      .sort({ prodPrice: -1 });

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
  };

  const priceLowToHigh = async () => {
    const skipProducts = page * to - 30;

    const totalProducts = await productSchema.find({
      $and: [
        { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
        { rating: { $gte: `${rating}` } },
        { discount: { $gte: `${discount}` } },
        { paymentType: { $regex: `${POD}`, $options: "i" } },
        { prodQuantity: { $gte: `${includeOutOfStock}` } },
      ],
    });

    const resProducts = await productSchema
      .find({
        $and: [
          { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
          { rating: { $gte: `${rating}` } },
          { discount: { $gte: `${discount}` } },
          { paymentType: { $regex: `${POD}`, $options: "i" } },
          { prodQuantity: { $gte: `${includeOutOfStock}` } },
        ],
      })
      .skip(skipProducts)
      .limit(to)
      .sort({ prodPrice: 1 });

    moreProduct = Number(to) * Number(page) < totalProducts.length;

    const response = {
      products: resProducts,
      nextPage: Number(page) + 1,
      moreProduct,
    };

    // console.log("Total Products : ", totalProducts.length);
    console.log("Limited Products Price Hight To Low : ", resProducts.length);
    // console.log("Sent Products : ", Number(page) * 9);

    if (response) {
      res.json(response);
    } else {
      res.status(404);
    }
  };

  const highRating = async () => {
    const skipProducts = page * to - 30;

    const totalProducts = await productSchema.find({
      $and: [
        { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
        { rating: { $gte: `${rating}` } },
        { discount: { $gte: `${discount}` } },
        { paymentType: { $regex: `${POD}`, $options: "i" } },
        { prodQuantity: { $gte: `${includeOutOfStock}` } },
      ],
    });

    const resProducts = await productSchema
      .find({
        $and: [
          { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
          { rating: { $gte: `${rating}` } },
          { discount: { $gte: `${discount}` } },
          { paymentType: { $regex: `${POD}`, $options: "i" } },
          { prodQuantity: { $gte: `${includeOutOfStock}` } },
        ],
      })
      .skip(skipProducts)
      .limit(to)
      .sort({ rating: -1 });

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
  };

  switch (sortBy) {
    case "newArrivals":
      newArrivals();
      break;

    case "priceHighToLow":
      priceHighToLow();
      break;

    case "priceLowToHigh":
      priceLowToHigh();
      break;

    case "highRating":
      highRating();
      break;

    default:
      break;
  }
});

router.get("/newarrivalscomp", async (req, res) => {
  const product = await productSchema
    .find({ prodQuantity: { $gte: 1 } })
    .limit(4);
  res.json(product);
});

router.post("/trendingproducts", async (req, res) => {
  const page = req.query.page;
  const sortBy = req.query.sortBy;
  const to = 30;
  const filter = req.body;
  let moreProduct;
  let reqProdQuantity;

  let price = filter.price;
  let rating = filter.rating !== null ? filter.rating : 0;
  let discount = filter.discount !== undefined ? Number(filter.discount) : 0;
  let POD = filter.POD === true ? "COD" : "";
  let includeOutOfStock = filter.includeOutOfStock === true ? 0 : 1;

  if (filter.outOfStock) {
    reqProdQuantity = 0;
  } else {
    reqProdQuantity = 1;
  }

  const newArrivals = async () => {
    const skipProducts = page * to - 30;

    console.log("Price : ", filter.price);

    const totalProducts = await productSchema.find({
      $and: [
        { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
        { rating: { $gte: `${rating}` } },
        { discount: { $gte: `${discount}` } },
        { paymentType: { $regex: `${POD}`, $options: "i" } },
        { prodQuantity: { $gte: `${includeOutOfStock}` } },
      ],
    });

    const resProducts = await productSchema
      .find({
        $and: [
          { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
          { rating: { $gte: `${rating}` } },
          { discount: { $gte: `${discount}` } },
          { paymentType: { $regex: `${POD}`, $options: "i" } },
          { prodQuantity: { $gte: `${includeOutOfStock}` } },
        ],
      })
      .skip(skipProducts)
      .limit(to);

    moreProduct = Number(to) * Number(page) < totalProducts.length;

    const response = {
      products: resProducts,
      nextPage: Number(page) + 1,
      moreProduct,
    };

    console.log("New Arrivals Total Products : ", totalProducts.length);
    console.log("New Arrivals Limited Products : ", resProducts.length);
    console.log("New Arrivals Sent Products : ", Number(page) * 9);

    if (response) {
      res.json(response);
    } else {
      res.status(404);
    }
  };

  const priceHighToLow = async () => {
    const skipProducts = page * to - 30;

    const totalProducts = await productSchema.find({
      $and: [
        { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
        { rating: { $gte: `${rating}` } },
        { discount: { $gte: `${discount}` } },
        { paymentType: { $regex: `${POD}`, $options: "i" } },
        { prodQuantity: { $gte: `${includeOutOfStock}` } },
      ],
    });

    const resProducts = await productSchema
      .find({
        $and: [
          { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
          { rating: { $gte: `${rating}` } },
          { discount: { $gte: `${discount}` } },
          { paymentType: { $regex: `${POD}`, $options: "i" } },
          { prodQuantity: { $gte: `${includeOutOfStock}` } },
        ],
      })
      .skip(skipProducts)
      .limit(to)
      .sort({ prodPrice: -1 });

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
  };

  const priceLowToHigh = async () => {
    const skipProducts = page * to - 30;

    const totalProducts = await productSchema.find({
      $and: [
        { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
        { rating: { $gte: `${rating}` } },
        { discount: { $gte: `${discount}` } },
        { paymentType: { $regex: `${POD}`, $options: "i" } },
        { prodQuantity: { $gte: `${includeOutOfStock}` } },
      ],
    });

    const resProducts = await productSchema
      .find({
        $and: [
          { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
          { rating: { $gte: `${rating}` } },
          { discount: { $gte: `${discount}` } },
          { paymentType: { $regex: `${POD}`, $options: "i" } },
          { prodQuantity: { $gte: `${includeOutOfStock}` } },
        ],
      })
      .skip(skipProducts)
      .limit(to)
      .sort({ prodPrice: 1 });

    moreProduct = Number(to) * Number(page) < totalProducts.length;

    const response = {
      products: resProducts,
      nextPage: Number(page) + 1,
      moreProduct,
    };

    // console.log("Total Products : ", totalProducts.length);
    console.log("Limited Products Price Hight To Low : ", resProducts.length);
    // console.log("Sent Products : ", Number(page) * 9);

    if (response) {
      res.json(response);
    } else {
      res.status(404);
    }
  };

  const highRating = async () => {
    const skipProducts = page * to - 30;

    const totalProducts = await productSchema.find({
      $and: [
        { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
        { rating: { $gte: `${rating}` } },
        { discount: { $gte: `${discount}` } },
        { paymentType: { $regex: `${POD}`, $options: "i" } },
        { prodQuantity: { $gte: `${includeOutOfStock}` } },
      ],
    });

    const resProducts = await productSchema
      .find({
        $and: [
          { prodPrice: { $gte: `${price[0]}`, $lte: `${price[1]}` } },
          { rating: { $gte: `${rating}` } },
          { discount: { $gte: `${discount}` } },
          { paymentType: { $regex: `${POD}`, $options: "i" } },
          { prodQuantity: { $gte: `${includeOutOfStock}` } },
        ],
      })
      .skip(skipProducts)
      .limit(to)
      .sort({ rating: -1 });

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
  };

  switch (sortBy) {
    case "newArrivals":
      newArrivals();
      break;

    case "priceHighToLow":
      priceHighToLow();
      break;

    case "priceLowToHigh":
      priceLowToHigh();
      break;

    case "highRating":
      highRating();
      break;

    default:
      break;
  }
});

router.get("/trendingproductscomp", async (req, res) => {
  const product = await productSchema.aggregate([{ $sample: { size: 4 } }]);

  res.json(product);
});

router.get("/topsellingcomp", async (req, res) => {
  const allOrders = await orderSchema.aggregate([
    {
      $group: {
        _id: "$productId",
        documents: { $push: "$$ROOT" },
        count: { $sum: 1 },
      },
    },
  ]);

  allOrders.sort((a, b) => {
    return b.count - a.count;
  });

  let responseData = [];

  if (allOrders.length > 0) {
    for (let index = 0; index < 4; index++) {
      const product = allOrders[index];
      const prod = await productSchema.findById(product.id);

      const {
        _id,
        prodName,
        prodDesc,
        prodQuantity,
        prodCategory,
        prodPrice,
        prodMRP,
        discount,
        rating,
        prodImage,
      } = prod;

      const prodData = {
        _id,
        prodName,
        prodDesc,
        prodQuantity,
        prodCategory,
        prodPrice,
        prodMRP,
        discount,
        rating,
        prodImage,
        ordersCount: product.count,
      };

      responseData.push(prodData);
    }
  } else {
    responseData;
  }

  res.json(responseData);
});

module.exports = router;
