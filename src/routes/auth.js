const express = require("express");
const authRouter = express.Router();

const bcrypt = require("bcrypt")
const User = require("../models/user")
const validationSignUp = require("../utils/validation")
const jwt = require("jsonwebtoken")

authRouter.post("/signup", async (req, res) => {
    const {
        firstName,
        lastName,
        emailId,
        password
    } = req.body;

    try{
        validationSignUp(req);

        const validateEmail = await User.findOne({emailId: emailId});
        if(validateEmail){
            throw new Error("Email already exists")
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
                firstName,
                lastName,
                emailId,
                password: hashedPassword,
            })

        const savedUser = await user.save();

        const token = jwt.sign({_id: user._id}, process.env.TOKEN_KEY,{
                expiresIn: "1h"
            })
        res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
        maxAge: 1000 * 60 * 60,
        })

        res.json({
            message: "successfully signed up",
            data: savedUser,
        })

    }catch(err){
        res.status(500).send(err.message)
    }
})



authRouter.post("/login", async (req,res) => {
    const {
        emailId,
        password
    } = req.body
    try{
        const user = await User.findOne({emailId: emailId});

        if(!user){
            return res.status(404).send("user not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(isPasswordValid){

            const token = jwt.sign({_id: user._id}, process.env.TOKEN_KEY,{
                expiresIn: "1d"
            })
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "None",  
                path: "/",
                maxAge: 1000 * 60 * 60,
            })

            res.send(user)
        }else{
            throw new Error("Invalid credentials")
        }

    }catch(err){
        res.status(404).send(err.message)
    }
})

authRouter.post("/logout", async(req, res) => {
    res.cookie("token", null, { 
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
        expires: new Date(Date.now())
    })

    res.send("Logged out the user");
})


module.exports = authRouter;