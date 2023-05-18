const express = require("express");
const router = express.Router();

const productSchema = require("../../schema/productSchema");

//Get all orders placed by the user...
router.get("/products/", async (req, res) => {
  const productCategory = req.query.category;
  const page = req.query.page;
  const sortBy = req.query.sortBy;
  const to = 30;
  const filter = req.body;
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
      prodCategory: { $regex: `${productCategory}`, $options: "i" },
    });

    const resProducts = await productSchema
      .find({
        prodCategory: { $regex: `${productCategory}`, $options: "i" },
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
      prodCategory: { $regex: `${productCategory}`, $options: "i" },
    });

    const resProducts = await productSchema
      .find({
        prodCategory: { $regex: `${productCategory}`, $options: "i" },
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
      prodCategory: { $regex: `${productCategory}`, $options: "i" },
    });

    const resProducts = await productSchema
      .find({
        prodCategory: { $regex: `${productCategory}`, $options: "i" },
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

router.get("/search", async (req, res) => {
  const page = req.query.page;
  const query = req.query.query;
  const sortBy = req.query.sortBy;
  const to = 30;
  const filter = req.body;
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
      prodName: { $regex: `${query}`, $options: "i" },
    });

    const resProducts = await productSchema
      .find({
        prodName: { $regex: `${query}`, $options: "i" },
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
      prodName: { $regex: `${query}`, $options: "i" },
    });

    const resProducts = await productSchema
      .find({
        prodName: { $regex: `${query}`, $options: "i" },
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
      prodName: { $regex: `${query}`, $options: "i" },
    });

    const resProducts = await productSchema
      .find({
        prodName: { $regex: `${query}`, $options: "i" },
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
      prodName: { $regex: `${query}`, $options: "i" },
    });

    const resProducts = await productSchema
      .find({
        prodName: { $regex: `${query}`, $options: "i" },
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

router.get("/newarrivals", async (req, res) => {
  const page = req.query.page;
  const sortBy = req.query.sortBy;
  const to = 30;
  const filter = req.body;
  let moreProduct;
  let reqProdQuantity;

  if (filter.outOfStock) {
    reqProdQuantity = 0;
  } else {
    reqProdQuantity = 1;
  }

  const newArrivals = async () => {
    const skipProducts = page * to - 30;

    const totalProducts = await productSchema.find();

    const resProducts = await productSchema.find().skip(skipProducts).limit(to);

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

    const totalProducts = await productSchema.find();

    const resProducts = await productSchema
      .find()
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

    const totalProducts = await productSchema.find();

    const resProducts = await productSchema
      .find()
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

router.get("/trendingproducts", async (req, res) => {
  const page = req.query.page;
  const sortBy = req.query.sortBy;
  const to = 30;
  const filter = req.body;
  let moreProduct;
  let reqProdQuantity;

  if (filter.outOfStock) {
    reqProdQuantity = 0;
  } else {
    reqProdQuantity = 1;
  }

  const newArrivals = async () => {
    const skipProducts = page * to - 30;

    const totalProducts = await productSchema.find();

    const resProducts = await productSchema.find().skip(skipProducts).limit(to);

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

    const totalProducts = await productSchema.find();

    const resProducts = await productSchema
      .find()
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

    const totalProducts = await productSchema.find();

    const resProducts = await productSchema
      .find()
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
  const product = await productSchema
    .find({ prodQuantity: { $gte: 1 } })
    .limit(50);
  res.json(product);
});

module.exports = router;
