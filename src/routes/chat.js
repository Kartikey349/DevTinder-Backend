const express = require("express");
const userAuth = require("../middleware/auth");
const Chat = require("../models/chat");
const chatRouter = express.Router();

chatRouter.get("/chat/:targetId", userAuth , async(req, res) => {
    const senderId = req.user._id;
    const targetId = req.params.targetId;

    try{
        let chat = await Chat.findOne({
            participants: {
                $all: [senderId, targetId]
            }
        }).populate("messages.senderId", "firstName lastName")

        if(!chat){
             chat = new Chat({
                participants: [
                    senderId,
                    targetId
                ], 
                messages: []
            })
            await chat.save();
        }
        res.send(chat)

    }catch(err){
        res.status(500).send("ERROR: " + err.message)
    }

})


chatRouter.patch("/chat/:targetId/delete", userAuth,  async(req,res) => {
    const senderId = req.user._id
    const targetId = req.params.targetId
    
    try{
        let chat = await Chat.findOne({
            participants: {
                $all: [
                    senderId,
                    targetId
                ]
            }
        })

        chat.messages = [];
        await chat.save()
        res.send(chat.messages)
    }catch(err){
        res.status(401).send("ERROR: "+ err.message)
    }
})

module.exports = chatRouter