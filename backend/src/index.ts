import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8081 });

interface User {
    socket: WebSocket;
    room: string;
}

let allSockets: User[] = [];

wss.on("connection", (socket: WebSocket) => {
    socket.on("message", (message: Buffer) => {
        let parsedMessage;
        try {
            parsedMessage = JSON.parse(message.toString());
        } catch (err) {
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
            if (!currentUser) return;
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


/*

Syntax

{
    "type" : "___",
    "payload":{
        "message":"______"
    }
}

*/