const express = require("express");
const app = express();
const router = express.Router();
const userSchema = require("../../schema/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { protect } = require("../../middleware/authMiddleware");
const buyerRoute = require("../buyerRoute/buyerRoute");

//User Login...
router.get("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userSchema.findOne({ email });
  console.log("In Login : ", user);
  if (!user) {
    res.end("User Not Found...");
  } else {
    const passwordCmp = await bcrypt.compareSync(password, user.password);
    if (passwordCmp) {
      const token = await generateToken(user._id, user.role);
      console.log("In Login : ", token);
      console.log(
        "----------------------------------------------------------------------------------"
      );
      console.log({
        Email: user.email,
        role: user.role,
        token: token,
      });

      if (user.role === "buyer") {
        console.log(`/buyer?token=${token}`);
        res.redirect(`/buyer?token=${token}`);
      } else if (user.role === "vendor") {
        res.redirect(`/vendor?token=${token}`);
      } else if (user.role === "admin") {
        res.redirect(`/admin?token=${token}`);
      }
    } else {
      res.end("Invalid Credentials...");
    }
  }

  //   res.json(user);
});

//User Registration...
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  // console.log(name, email, password, role);

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // console.log("Salt : ", salt, "Hashed : ", hashedPassword);

  const findUser = await userSchema.findOne({ email });
  if (findUser) {
    res.status(401).end("User Already Exists...");
  } else {
    const schema = new userSchema({
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
    });

    const userAdd = await schema.save();

    const token = await generateToken(userAdd._id);
    console.log("Token : ", token);
    res.json({
      userAdd,
      token: token,
    });
  }
});

// router.get('/login', (req, res) => {
//     res.end("Login Page");
// });

//Token Generation...
const generateToken = async (id, role) => {
  // console.log(id.toString());
  const token = await jwt.sign({ id, role }, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });
  // console.log(token);
  return token;
};

module.exports = router;
