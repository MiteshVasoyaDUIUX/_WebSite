const jwt = require("jsonwebtoken");
const userSchema = require("../schema/userSchema");
const asyncHandler = require("express-async-handler");

//Check User Authorization...
const protectLoginRegister = asyncHandler(async (req, res, next) => {
  let token;

  console.log("Params : ", req.query.token);
  if (req.query.token) {
    try {
      token = req.query.token;

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      console.log("In Auth Path : ", decoded.role, decoded.id);

      req.user = await userSchema.findById(decoded.id).select("-password");
      req.token = token;
      // console.log("Token : ", req.token);
      next();
    } catch (error) {
      res.status(401).end();
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

//Check for User is authentic for View...
const protectView = asyncHandler(async (req, res, next) => {
  let token;

  //   console.log("Params : ", req.query.token);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      // console.log("In Auth Path : ", decoded);

      req.user = await userSchema.findById(decoded.id).select("-password");
      // console.log("In Auth Path : ", req.user);
      next();
    } catch (error) {
      res.json({
        message: "Not Authorized Person",
        error: error,
      });
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const protectBuyer = asyncHandler(async (req, res, next) => {
  let token;

  console.log("Params : ",req.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      console.log("In Auth Path : ", decoded);

      req.user = await userSchema.findById(decoded.id).select("-password");
      // console.log("In Auth Path : ", req.user);
      next();
    } catch (error) {
      res.json({
        message: "Not Authorized Person",
        error: error,
      });
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const protectDeletionUpdation = asyncHandler(async (req, res, next) => {
  let token;

  //   console.log("Params : ", req.query.token);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      // console.log("In Auth Path : ", decoded);

      req.user = await userSchema.findById(decoded.id).select("-password");

      if (req.user.role === "admin" || req.user.role === "vendor") {
        // console.log("In Auth Path : ", req.user.role);
        next();
      } else {
        console.log("You are not valid User...");
        setTimeout(() => {
          res.redirect(`/buyer?token=${token}`);
        }, 4000);
      }
    } catch (error) {
      res.json({
        message: "Not Authorized Person",
        error: error,
      });
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const allUsers = asyncHandler(async (req, res, next) => {
  let token;

  //   console.log("Params : ", req.query.token);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      console.log("In Auth Path : ", decoded);

      req.user = await userSchema.findById(decoded.id).select("-password");

      if (req.user.role === "admin") {
        // console.log("In Auth Path : ", req.user.role);
        next();
      } else {
        console.log("You are not valid User...");
        if (req.user.role === "buyer") {
          setTimeout(() => {
            res.redirect(`/buyer?token=${token}`);
          }, 4000);
        } else if (req.user.role === "vendor") {
          setTimeout(() => {
            res.redirect(`/vendor?token=${token}`);
          }, 4000);
        }
      }
    } catch (error) {
      res.json({
        message: "Not Authorized Person",
        error: error,
      });
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = {
  protectLoginRegister,
  protectView,
  protectDeletionUpdation,
  allUsers,
  protectBuyer,
};
