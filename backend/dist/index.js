"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8081 });
let userCount = 0;
wss.on("connection", (socket) => {
    userCount += 1;
    console.log("User Connected #" + userCount);
    socket.on("message", (message) => {
        console.log("Message sent by Postman ", message);
        setTimeout(() => {
            socket.send(message.toString() + " : Message sent by User Back");
        }, 500);
    });
});
