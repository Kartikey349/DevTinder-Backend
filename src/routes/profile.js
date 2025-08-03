const express = require("express")
const profileRouter = express.Router();

const userAuth = require("../middleware/auth");
const User = require("../models/user");


profileRouter.get("/profile/view", userAuth ,async(req, res) => {
    try{
        const user = req.user;
        res.send(user)
    }catch(err){
        res.status(500).send("somethiing went wrong: " + err.message)
    }
})


profileRouter.patch("/profile/edit", userAuth,async(req, res) => {
    const loggedInUser = req.user;
    const update = req.body
     
    const isAllowed = ["firstName", "lastName", "age", "about", "photoUrl", "gender"]
    try{
        const isValid = Object.keys(update).every((e) => isAllowed.includes(e))

        if(!isValid){
            throw new Error("Can not be updated");
        }

        const data = await User.findByIdAndUpdate(loggedInUser._id, update, {
            new: true,
            runValidators: true
        })
        res.json({
            message: "successfully updated",
            data
        })
    }catch(err){
        res.status(403).send("ERROR: "+ err.message)
    }
})



module.exports = profileRouter;