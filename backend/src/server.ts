import express from "express";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import { User, Message, WebSocketMessage } from "./types";

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

function broadcast(message: WebSocketMessage) {
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

    broadcast({ type: "PARTICIPANT_LIST", payload: participants });
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
            const parsedMessage: WebSocketMessage = JSON.parse(
                message.toString()
            );

            switch (parsedMessage.type) {
                case "NEW_MESSAGE":
                    const user = users.get(userId);
                    const newMessage: Message = {
                        id: uuidv4(),
                        userId,
                        userName: `${users.get(userId)?.name}`,
                        content: (parsedMessage.payload as { content: string })
                            .content,
                        createdAt: new Date(),
                    };
                    messages.push(newMessage);
                    console.log("Messages array:", messages);
                    broadcast({ type: "NEW_MESSAGE", payload: newMessage });
                    break;

                case "EDIT_MESSAGE":
                    const editedMessage = parsedMessage.payload as Message;
                    const indexToEdit = messages.findIndex(
                        (message) => message.id === editedMessage.id
                    );
                    if (indexToEdit !== -1) {
                        const message = messages[indexToEdit];
                        if (message.userId === userId) {
                            message.content = editedMessage.content;
                            message.edited = true;
                            message.editedAt = new Date();
                            broadcast({
                                type: "EDIT_MESSAGE",
                                payload: message,
                            });
                        } else {
                            console.log(
                                `User ${userId} insufficient permissions to edit message`
                            );
                        }
                    } else {
                        console.log(`Message not found: ${editedMessage.id}`);
                    }
                    break;

                case "DELETE_MESSAGE":
                    const deletedMessageContent =
                        parsedMessage.payload as Message;
                    const indexToDelete = messages.findIndex(
                        (message) => message.id === deletedMessageContent.id
                    );
                    if (indexToDelete !== -1) {
                        const message = messages[indexToDelete];

                        if (message.userId === userId) {
                            message.content = "";
                            message.deleted;
                            message.deletedAt = new Date();
                            broadcast({
                                type: "DELETE_MESSAGE",
                                payload: message,
                            });
                        }
                    }
            }
        } catch (error) {
            console.log("Error parsing message:", error);
            socket.send(
                JSON.stringify({
                    type: "ERROR",
                    payload: {
                        message: "An error occurred processing your request",
                    },
                })
            );
        }
    });

    socket.on("close", () => {
        const disconnectedUser = Array.from(users.values()).find(
            (user) => user.socket === socket
        );

        if (disconnectedUser) {
            users.delete(disconnectedUser.id);
            console.log(`User ${disconnectedUser?.id} disconnected`);
            broadcast({ type: "USER_LEFT", payload: disconnectedUser });
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
