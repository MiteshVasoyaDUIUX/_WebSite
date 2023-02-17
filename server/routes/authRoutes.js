const express = require('express');
const router = express.Router();
const userSchema = require('../schema/userSchema');

router.get('/login', async (req, res) => {
    const user = await userSchema.find({});
    res.end(user);
});

router.post('/post', async (req, res) => {
    // console.log(req.body);
    const userData = {
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        role : req.body.role
    }

    const addStatus = await userSchema.create(userData);
    res.json(addStatus);
});

router.get('/Register', (req, res) => {
    res.end("Register Page");
});

// router.get('/login', (req, res) => {
//     res.end("Login Page");
// });

module.exports = router;