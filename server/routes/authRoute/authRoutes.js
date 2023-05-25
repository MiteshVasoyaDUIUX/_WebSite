const express = require("express");
const app = express();
const router = express.Router();
const userSchema = require("../../schema/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { protect, protectView } = require("../../middleware/authMiddleware");
const buyerRoute = require("../buyerRoute/buyerRoute");
const verify = require("../../firebase/config");

const actionCodeSettings = {
  url: "http://localhost:3000/",
  handleCodeInApp: true,
};

let userData = {};

//User Registration...
router.post("/register", async (req, res) => {
  const { name, email, password, phoneNumber, role, address } = req.body;
  let addressArr = [];
  addressArr.push(address);
  // console.log("Data Entered By User : ", name, email, password, role);
  const findUser = await userSchema.findOne({ email });
  if (findUser) {
    res.status(404).json({ message: "User Already Exist" });
  } else {
    try {
      const userAdd = await verify.addUser(email, password);

      console.log("Added User : ", userAdd);
      console.log("Phone Number : ", phoneNumber);

      const uSchema = new userSchema({
        _id: userAdd.user.uid,
        name: name,
        email: userAdd.user.email,
        phoneNumber: phoneNumber,
        role: role,
        emailVerified: userAdd.user.emailVerified,
        address: addressArr,
      });

      const addUserToMDB = await uSchema.save();
      console.log("Add User to Mongo : ", addUserToMDB);

      const userId = userAdd.user.uid;

      const token = await generateToken(userId, role);

      if (uSchema.role === "buyer") {
        console.log(`/buyer`);
        res.redirect(`/buyer?token=${token}`);
      } else if (uSchema.role === "admin") {
        res.redirect(`/admin?token=${token}`);
      }
    } catch (error) {
      console.log(error);

      if (error.code === "auth/user-not-found") {
        res.status(404).json({ message: error.code });
      }
    }
  }
});

//User Login...
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFromFirebase = await verify.signInUser(email, password);
    userData = userFromFirebase;
    const userId = userFromFirebase.user.uid;

    const findInMDB = await userSchema.find({ _id: userId });

    const token = await generateToken(userId, findInMDB[0].role);

    console.log("USER LOGIN DATA : ", findInMDB);

    if (findInMDB[0].role === "buyer") {
      res.redirect(`/buyer?token=${token}`);
    } else if (findInMDB[0].role === "admin") {
      res.redirect(`/admin?token=${token}`);
    }

    res.json();
  } catch (error) {
    console.log("Error : ", error);

    if (error.code === "auth/user-not-found") {
      res.status(404).json({ message: "User Not Found" });
    }
    if (error.code === "auth/wrong-password") {
      res.status(404).json({ message: "Email or Password is Incorrect" });
    }
  }
});

router.post("/resetpassword", async (req, res) => {
  const email = req.body.email;

  const findEmail = await userSchema.findOne({ email }).select("name email");

  if (!findEmail) {
    res
      .status(401)
      .json({ message: `Account with Email Address "${email}" not found` });
  } else {
    // console.log("Email Id Exists : ", findEmail);

    const passwordReset = await verify.sendPasswordResetEmailLink(email);

    console.log("Password Reset Response : ", passwordReset);
  }
});

router.get("/user/verification", protectView, async (req, res) => {
  const user = req.user;

  let time = 0;

  console.log("User Email : ", user._id);

  const userVerification = await verify.verifyUser(actionCodeSettings);

  const interval = setInterval(async () => {
    const currentUser = await verify.curUser();

    currentUser.reload();

    console.log("Is Verified : ", currentUser.emailVerified, time);

    if (time === 60) {
      clearInterval(interval);
    }

    if (currentUser.emailVerified) {
      clearInterval(interval);
      await userSchema.findByIdAndUpdate(user._id, {
        emailVerified: true,
      });

      const updateData = await userSchema.findById(user._id);

      console.log("Updated data : ", updateData);

      res.json({ isVerified: true, user: updateData });
    }

    time++;
  }, 2000);
});

router.get("/user/updateuserdata", protectView, async (req, res) => {
  const userData = await userSchema.findById(req.user._id);
  console.log("req.user : ", userData);
  res.json(userData);
});

//User Registration...

router.post("/logout", async (req, res) => {
  const { email, password } = req.body;
  // const user = await userSchema.findOne({ email });

  try {
    const userSignOut = await verify.signOutUser(email, password);
    res.json({
      message: "Signed Out",
    });
    // console.log("SO : ")
  } catch (Error) {
    console.log("Error :", Error);
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
