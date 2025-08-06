const socket = require("socket.io")
const crypto = require("crypto")

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

        socket.on("sendMessage", ({firstName, targetId, senderId, text}) => {
            const room = secureRoomId(senderId, targetId)
            io.to(room).emit("receivedMessage", {firstName, text, senderId})
        })

        socket.on("disconnect", () => {

        })


    })

    
}

module.exports = initializeSocket