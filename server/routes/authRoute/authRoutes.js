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

//User Login...
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // const user = await userSchema.findOne({ email });

  try {
    const userFromFirebase = await verify.signInUser(email, password);

    userData = userFromFirebase;
    // console.log("Auth IN login ", userData);

    // console.log("userFromFirebase : ", userFromFirebase)
    const userId = userFromFirebase.user.uid;

    const findInMDB = await userSchema.find({ _id: userId });

    const token = await generateToken(userId, findInMDB[0].role);
    // console.log("userId in Mongo : ", token);

    if (findInMDB[0].role === "buyer") {
      // console.log(`/buyer`);
      res.redirect(`/buyer?token=${token}`);
    } else if (findInMDB[0].role === "admin") {
      // console.log("Admin Panel", findInMDB);
      res.redirect(`/admin?token=${token}`);
    }
    // else if (findInMDB.role === "vendor") {
    //   res.redirect(`/vendor?token=${token}`);
    // }
  } catch (error) {
    console.log("Error : ", error);
  }

  res.json();
});

router.get("/user/verification", protectView, async (req, res) => {
  const user = req.user;

  console.log("User Email : ", user._id);

  // console.log("Verification : ", auth.currentUser)
  // console.log("UATUH : ", userData);
  const userVerification = await verify.verifyUser(actionCodeSettings);

  const interval = setInterval(async () => {
    const currentUser = await verify.curUser();

    currentUser.reload();

    console.log("CUUUUU : ", currentUser.emailVerified);

    if (currentUser.emailVerified) {
      clearInterval(interval);
      await userSchema.findByIdAndUpdate(user._id, {
        emailVerified: true,
      });

      const updateData = await userSchema.findById(user._id);

      console.log("Updated data : ", updateData);

      res.json({ isVerified: true, user : updateData });
    }
  }, 3000);

  // console.log("LLINK L :", userVerification)
});

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

//User Registration...
router.post("/register", async (req, res) => {
  const { name, email, password, phoneNumber, role, address } = req.body;
  // console.log("Data Entered By User : ", name, email, password, role);
  const findUser = await userSchema.findOne({ email });
  if (findUser) {
    res.status(401).end();
  } else {
    try {
      const userAdd = await verify.addUser(email, password);
      const userVerification = await verify.verifyUser(actionCodeSettings);

      console.log("Added User : ", userAdd);
      console.log("Phone Number : ", phoneNumber);

      const uSchema = new userSchema({
        _id: userAdd.user.uid,
        name: name,
        email: userAdd.user.email,
        phoneNumber: phoneNumber,
        role: role,
        emailVerified: userAdd.user.emailVerified,
        address,
      });

      const addUserToMDB = await uSchema.save();
      console.log("Add User to Mongo : ", addUserToMDB);

      const userId = userAdd.user.uid;

      const token = await generateToken(userId, role);

      //Checking for Email Verification Status...
      // setInterval(()=> {
      //   const changedState = onAuthStateChanged(auth, (user) => {
      //     console.log("SignedIn User Email Verification Status : ", user.emailVerified);
      //   })
      // }, 5000);

      if (uSchema.role === "buyer") {
        console.log(`/buyer`);
        res.redirect(`/buyer?token=${token}`);
      } else if (uSchema.role === "admin") {
        res.redirect(`/admin?token=${token}`);
      }

      console.log("Firebase User Verification Response : ", userVerification);
    } catch (error) {
      console.log(error);
    }
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
