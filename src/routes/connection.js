const express = require("express")
const connectionRouter = express.Router();
const sendMail  = require("../utils/sendMail")

const userAuth = require("../middleware/auth")
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

connectionRouter.post("/request/send/:status/:userId", userAuth,async(req, res) => {
    const fromUserId = req.user._id;
    const toUserId = req.params.userId;
    const status = req.params.status;

    try{
        const isValid = ["ignored", "interested"].includes(status);
        if(!isValid){
            throw new Error("invalid status type "+ status);
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            throw new Error("user does not exists")
        }

        if(fromUserId.equals(toUserId)){
            throw new Error("you cant send connection request to yourself")
        }

        const existing = await ConnectionRequest.findOne({
            $or: [
                {
                    fromUserId,
                    toUserId
                }, {
                    fromUserId: toUserId,
                    toUserId: fromUserId
                }
            ]
        })


        if(existing){
            throw new Error("Connection request already exist")
        }


        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        await connectionRequest.save()

        if(status === "interested"){
            const result = await sendMail({
            to: "kartikey7518@gmail.com",
            subject: `${req.user.firstName} wants to connect on DevTinder!`,
            text: `Hi ${toUser.firstName}, ${req.user.firstName} has sent you a connection request.`,
        })
        }

        
        res.send({messgae : req.user.firstName + " sent connection request successfully to " + toUser.firstName})

    }catch(err){
        res.status(400).send("ERROR: "+ err.message)
    }
})


connectionRouter.post("/request/review/:status/:requestId", userAuth, async(req, res) => {
    const loggedInUser = req.user;
    const requestId = req.params.requestId;
    const status = req.params.status;

    try{    
        const isAllowed = ["accepted", "rejected"].includes(status);
        if(!isAllowed){
            throw new Error("invalid status type")
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        });

        if(!connectionRequest){
            throw new Error("connection request not found")
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({
            message: `connection request is successfully ${status}`,
            data,
        })

    }catch(err){
        res.status(400).send("ERROR: "+ err.message)
    }
})

connectionRouter.get("/test-email", async (req, res) => {
  const result = await sendMail({
    to: "kartikey7518@gmail.com",
    subject: "Test Email",
    text: "Hello from DevTinder!",
  });

  res.send(result);
});

module.exports = connectionRouter;