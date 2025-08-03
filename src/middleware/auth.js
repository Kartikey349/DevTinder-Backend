const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async (req, res,next) => {
    const {token} = req.cookies;
    try{
    if(!token){
        return res.status(401).send("Please login")
    }
        const decoded = jwt.verify(token, process.env.TOKEN_KEY)
        const {_id} = decoded;
        
        const user = await User.findById(_id)

        req.user= user;
        next();

    }catch(err){
        res.status(500).send("ERROR: " + err.message);
    }
}

module.exports = userAuth;