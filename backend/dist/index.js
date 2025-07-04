"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8081 });
let allSockets = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        let parsedMessage;
        try {
            parsedMessage = JSON.parse(message.toString());
        }
        catch (err) {
            return;
        }
        if (parsedMessage.type === "join") {
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            });
        }
        if (parsedMessage.type === "chat") {
            const currentUser = allSockets.find(u => u.socket === socket);
            if (!currentUser)
                return;
            const currentUserRoom = currentUser.room;
            allSockets.forEach(u => {
                if (u.room === currentUserRoom) {
                    u.socket.send(parsedMessage.payload.message);
                }
            });
        }
    });
    socket.on("close", () => {
        allSockets = allSockets.filter(u => u.socket !== socket);
    });
});
