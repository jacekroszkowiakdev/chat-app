import express from "express";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import { User, Message } from "./types";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const PORT = 3001;

const users: Map<string, User> = new Map();
const messages: Message[] = [];

function generateColorCode(): string {
    return `#${Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0")}`;
}

function broadcastMessage(message: Message) {
    const messageString = JSON.stringify(message);

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(messageString);
        }
    });
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
    console.log(`${userId} joined with name ${users.get(userId)?.name}`);
    broadcastParticipants();

    socket.on("message", (message) => {
        try {
            const parsedMessage = JSON.parse(message.toString());
            const user = users.get(parsedMessage.userId);
            parsedMessage.id = uuidv4();
            parsedMessage.userId = userId;
            parsedMessage.userName = `${users.get(userId)?.name}`;
            parsedMessage.content = "text";
            parsedMessage.createdAt = new Date();
            messages.push(parsedMessage);
            console.log("Messages array:", messages);
            broadcastMessage(parsedMessage);

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        } catch (error) {
            console.log("Error parsing message:", error);
        }
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

    socket.on("error", (error) => {
        console.log("Error:", error);
    });
});

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
