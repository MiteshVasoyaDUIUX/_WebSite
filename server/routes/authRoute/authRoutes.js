const express = require("express");
const app = express();
const router = express.Router();
const userSchema = require("../../schema/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { protect } = require("../../middleware/authMiddleware");
const buyerRoute = require("../buyerRoute/buyerRoute");
const verify = require("../../firebase/config");
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");

const auth = getAuth();

const actionCodeSettings = {
  url: "https://localhost:3000/",
  handleCodeInApp: true,
};

//User Login...
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // const user = await userSchema.findOne({ email });

  try {
    const userFromFirebase = await verify.signInUser(email, password);
    console.log("Firebase SignedIn User ID : ", userFromFirebase.uid);
    // if (!) {
    //   console.log(".....User Not Found...");
    // } else {
    //   const passwordCmp = await bcrypt.compareSync(password, user.password);
    //   if (passwordCmp) {
    //     const token = await generateToken(user._id, user.role);

    //     if (user.role === "buyer") {
    //       // console.log(`/buyer?token=${token}`);
    //       res.redirect(`/buyer?token=${token}`);
    //     } else if (user.role === "vendor") {
    //       res.redirect(`/vendor?token=${token}`);
    //     } else if (user.role === "admin") {
    //       res.redirect(`/admin?token=${token}`);
    //     }
    //   } else {
    //     res.end("Invalid Credentials...");
    //   }
    // }
  } catch (error) {
    console.log("Error If User Not ", error);
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
  // const authentication = firebase.createUserWithEmailAndPassword();
  if (findUser) {
    res.status(401).end();
  } else {
    const schema = new userSchema({
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
      varificationStatus: "pending",
    });

    const userAdd = await schema.save();

    const token = await generateToken(userAdd._id);

    try {
      const userAuth = await verify.addUser(email, password);
      const userVerification = await verify.verifyUser(
        email,
        actionCodeSettings
      );

      const signedInUser = auth.currentUser;

      // setInterval(()=> {
      //   console.log("SignedIn User Verification Status : ", signedInUser.emailVerified);
      // }, 5000);

      // console.log("Firebase Response : ", userAuth);
      console.log("Firebase Use Verification Response : ", userVerification);
      // console.log("isUseVerified : ", userAuth.UserImpl.reloadUserInfo);
    } catch (error) {
      console.log(error);
    }

    console.log("Token : ", token);
    res.json({
      userAdd,
      token: token,
      verified: false,
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
