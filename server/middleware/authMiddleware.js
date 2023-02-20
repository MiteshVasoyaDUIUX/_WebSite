const jwt = require('jsonwebtoken');
const userSchema = require('../schema/userSchema');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            console.log("In Auth Path : ", decoded);

            req.user = await userSchema.findById(decoded.id).select('-password');
            console.log("In Auth Path : ", req.user);
            next();
        } catch (error) {
            res.json({
                "message" : "Not Authorized Person",
                "error" : error
            })
        }
    }
    
    if(!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
}
)

module.exports = {
    protect
}