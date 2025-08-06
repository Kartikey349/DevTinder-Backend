const socket = require("socket.io")
const crypto = require("crypto")

const secureRoomId = (loggedInId, targetId) => {
    return crypto.createHash("sha256").update([loggedInId, targetId].sort().join("_")).digest("hex");
}

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: [
    "http://localhost:5173",
    "https://dev-tinder-frontend-zeta.vercel.app"],
    })


    io.on("connection", (socket) => {
    
        socket.on("joinChat", ({loggedInId, targetId}) => {
            const room = secureRoomId(loggedInId, targetId)
            socket.join(room);
            console.log(room)
        })

        socket.on("sendMessage", ({firstName, targetId, senderId, text}) => {
            const room = secureRoomId(loggedInId, targetId)
            io.to(room).emit("receivedMessage", {firstName, text, senderId})
        })

        socket.on("disconnect", () => {

        })


    })

    
}

module.exports = initializeSocket