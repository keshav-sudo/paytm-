const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

//middleware is just to varify token and u .. irt is like a middleware it is work is that to vaerify your token with secret key and return userid that allows or verifyy u


//first take req inputs 

const authMiddleware = (req , res , next) => {
    const authheader = req.headers.authorization;

    if (!authheader || authheader.startsWith("Bearer ")){
        return res.status(403).json({});
    }

    const token = authheader.split(" ")[1];

    try {
        const decode = jwt.verify (token , JWT_SECRET);
        req.userId = decode.userId;
        next();
    } catch (error) {
        res.status(403).json({});
    } 
};

module.exports = { authMiddleware };