const inCart = response.cart;
    const isAddedtoCart = inCart.includes(productId);

    const ppp = {
      productId,
      product : productId
    }

    if (!isAddedtoCart) {
      inCart.push(ppp);
      const addedToCart = await userSchema.findByIdAndUpdate(id, {
        cart: inCart,
      });
      const newCart = await userSchema.findById(id).select("cart");

      // console.log("Added To Cart : ", newCart.cart);
      res.json(newCart.cart);
    } else {

      inCart.push(ppp);
      const addedToCart = await userSchema.findByIdAndUpdate(id, {
        cart: inCart,
      });
      
      const newCart = await userSchema.findById(id).select("cart");

      // console.log("Added To Cart : ", newCart.cart);
      res.json(newCart.cart);
    }