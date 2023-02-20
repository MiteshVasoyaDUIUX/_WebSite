const express = require("express");
const router = express.Router();
const userSchema = require("../schema/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userSchema.findOne({ email });
console.log(user);
  if(!user) {
    res.end("User Not Found...");
  } else{
    const passwordCmp = await bcrypt.compareSync(password, user.password);
  if(passwordCmp) {
    const token = await generateToken(user._id);
    console.log(token);
    console.log("----------------------------------------------------------------------------------");
    res.json({
        Email : user.email,
        role : user.role,
        token : token
    });
  } else {
    res.end("Invalid Credentials...");
  }
  }
  

//   res.json(user);
});

router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log(name, email, password, role);

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("Salt : ", salt, "Hashed : ", hashedPassword);

  const schema = new userSchema({
    name: name,
    email: email,
    password: hashedPassword,
    role: role,
  });

  const userAdd = await schema.save();
  res.json(userAdd);
});

router.get("/Register", (req, res) => {
  res.end("Register Page");
});

// router.get('/login', (req, res) => {
//     res.end("Login Page");
// });

const generateToken = async (id) => {
    // console.log(id.toString());
    const token = await jwt.sign({id}, "SECRET_KEY", {
        expiresIn : '30d'
    });
// console.log(token);
    return token;
};

module.exports = router;
