import express from "express";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import { User } from "./types";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const PORT = 3001;

const users: Map<string, User> = new Map();

function generateColorCode(): string {
    return `#${Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0")}`;
}

function broadcastParticipants() {
    const participants = Array.from(users.values()).map((user: User) => ({
        id: user.id,
        socket: user.socket,
        name: user.name,
        color: user.color,
    }));

    const message = JSON.stringify({
        type: "participants",
        participants,
    });

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

wss.on("connection", (socket: WebSocket) => {
    console.log("Client connected");
    const userId = uuidv4();
    users.set(userId, {
        id: userId,
        socket: socket,
        name: `User_${userId.slice(0, 7)}`,
        color: generateColorCode(),
    });
    console.log("Users:", users);
    console.log(`${userId} joined with name ${users.get(userId)?.name}`);
    broadcastParticipants();

    socket.on("message", (message) => {
        console.log("Received: " + message);
        socket.send("Echo: " + message);

        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    socket.on("close", () => {
        const disconnectedUser = Array.from(users.values()).find(
            (user) => user.socket === socket
        );

        if (disconnectedUser) {
            users.delete(disconnectedUser.id);
            console.log("Users:", users);
            console.log(`User ${disconnectedUser?.id} disconnected`);
            broadcastParticipants();
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
