const express = require("express");
const userAuth = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();


userRouter.get("/user/request/received", userAuth, async(req, res) => {
        const toUserId = req.user._id;
    try{
        const connectionRequest = await ConnectionRequest.find({
            toUserId: toUserId,
            status: "interested"
        }).populate("fromUserId", "firstName lastName age gender about photoUrl")


        res.send({
            message: "Data fetched successfully",
            data: connectionRequest
        })

    }catch(err){
        res.status(404).send("ERROR: "+  err.message)
    }
})


userRouter.get("/user/connection", userAuth, async(req, res) => {
    const loggedInUser = req.user;

    try{
        const connections = await ConnectionRequest.find({
            $or: [
                {
                    toUserId: loggedInUser._id,
                    status: "accepted"
                },
                {
                    fromUserId: loggedInUser._id,
                    status: "accepted"
                }
            ]
        }).populate("fromUserId", "firstName lastName age gender about photoUrl").populate("toUserId", "firstName lastName age gender about photoUrl");

        
        const data = connections.map((row) => {
            if(row.fromUserId.equals(loggedInUser._id)){
                return row.toUserId;
            }else{
                return row.fromUserId;
            }
        })

        res.json({
            message: "here are the your connections",
            data
        })

    }catch(err){
        res.status(400).send("ERROR "+ err.message)
    }
})


//feed api
userRouter.get("/user/feed", userAuth, async(req,res) => {
    //exclude youself
    //exclude ignored
    //connections
    //user who already recieved connection request

    const page = parseInt(req.query.page || 1);
    let limit = parseInt(req.query.limit || 10);
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const loggedInUser = req.user;
    try{
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {
                    toUserId: loggedInUser._id
                }, {
                    fromUserId: loggedInUser._id
                }
            ]
        }).select("fromUserId toUserId")


        const hideFromFeed = new Set();
        connectionRequest.forEach((req) => {
            hideFromFeed.add(req.fromUserId.toString())
            hideFromFeed.add(req.toUserId.toString());
        });


        const data = await User.find({
            $and: [
                {
                    _id: {$nin: Array.from(hideFromFeed)}
                },{
                    _id: {$ne: loggedInUser._id}
                }, {
                    gender: {$ne : loggedInUser.gender}
                }
            ]
        })
        .select("firstName lastName age gender about photoUrl")
        .skip(skip)
        .limit(limit)


        res.send(data)

    }catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
})


module.exports = userRouter