const socket = require("socket.io")
const crypto = require("crypto");
const Chat = require("../models/chat");

const secureRoomId = (loggedInId, targetId) => {
    return crypto.createHash("sha256").update([loggedInId, targetId].sort().join("_")).digest("hex");
}

const initializeSocket = (server) => {
    const io = socket(server, {
    cors: {
        origin: [
        "http://localhost:5173",
        "https://dev-tinder-frontend-zeta.vercel.app"
        ],
    methods: ["GET", "POST"],
    credentials: true
  }
});


    io.on("connection", (socket) => {
    
        socket.on("joinChat", ({loggedInId, targetId}) => {
            const room = secureRoomId(loggedInId, targetId)
            socket.join(room);
        })

        socket.on("sendMessage", async ({firstName, targetId, senderId, text}) => {
            const room = secureRoomId(senderId, targetId)

            try{
                let chat = await Chat.findOne({
                    participants: {$all: [senderId, targetId]}
                }) 

                if(!chat){
                     chat = new Chat({
                        participants: [senderId
                            , targetId
                        ],
                        messages: []
                    })
                }
                chat.messages.push({
                    senderId,
                    text
                })
                await chat.save();
                io.to(room).emit("receivedMessage", {firstName, text, senderId})
            }catch(err){
                console.log(err)
            }
        })

        socket.on("disconnect", () => {

        })

    })    
}

module.exports = initializeSocket