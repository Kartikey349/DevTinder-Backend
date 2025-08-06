const socket = require("socket.io")

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    })


    io.on("connection", (socket) => {
    
        socket.on("joinChat", ({loggedInId, targetId}) => {
            const room = [loggedInId, targetId].sort().join("_")
            socket.join(room);
        })

        socket.on("sendMessage", ({firstName, targetId, senderId, text}) => {
            const room = [senderId, targetId].sort().join("_");
            io.to(room).emit("receivedMessage", {firstName, text, senderId})
        })

        socket.on("disconnect", () => {

        })


    })

    
}

module.exports = initializeSocket