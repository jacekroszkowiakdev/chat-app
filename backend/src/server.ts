import express from "express";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import { PublicUser, WebSocketMessage } from "./types";
import { broadcast, broadcastParticipants } from "./utils/websocket";
import {
    addUser,
    removeUser,
    getParticipants,
    getUserBySocket,
    handleUserJoined,
} from "./services/user.service";
import {
    handleNewMessage,
    handleEditMessage,
    handleDeleteMessage,
} from "./services/message.service";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const PORT = 3001;

wss.on("connection", (socket: WebSocket) => {
    console.log("Client connected");

    const user = addUser(socket);
    const userId = user.id;
    console.log(`${userId} joined with name ${user.name}`);

    broadcastParticipants(getParticipants(), wss);

    socket.on("message", (message) => {
        try {
            const parsedMessage: WebSocketMessage = JSON.parse(
                message.toString()
            );

            switch (parsedMessage.type) {
                case "NEW_MESSAGE":
                    try {
                        let content = (
                            parsedMessage.payload as { content: string }
                        ).content;
                        const newMessage = handleNewMessage(
                            userId,
                            content,
                            wss
                        );

                        if (newMessage) {
                            broadcast(
                                { type: "NEW_MESSAGE", payload: newMessage },
                                wss
                            );
                        } else {
                            socket.send("Failed to create message");
                            break;
                        }
                    } catch (error) {
                        console.error("Error processing new message:", error);
                        socket.send("Error processing message");
                    }
                    break;

                case "EDIT_MESSAGE":
                    try {
                        let { id, content } = parsedMessage.payload as {
                            id: string;
                            content: string;
                        };
                        const editedMessage = handleEditMessage(
                            userId,
                            id,
                            content,
                            wss
                        );

                        if (editedMessage) {
                            broadcast(
                                {
                                    type: "EDIT_MESSAGE",
                                    payload: editedMessage,
                                },
                                wss
                            );
                        } else {
                            socket.send("Failed to edit message");
                            break;
                        }
                    } catch (error) {
                        console.error("Error editing message:", error);
                        socket.send("Error editing message:");
                    }
                    break;

                case "DELETE_MESSAGE":
                    try {
                        let { id } = parsedMessage.payload as {
                            id: string;
                            content: string;
                        };

                        const deletedMessage = handleDeleteMessage(
                            userId,
                            id,
                            wss
                        );

                        if (deletedMessage) {
                            broadcast(
                                {
                                    type: "DELETE_MESSAGE",
                                    payload: deletedMessage,
                                },
                                wss
                            );
                        } else {
                            socket.send("Failed to edit message");
                            break;
                        }
                    } catch (error) {
                        console.error("Error deleting message:", error);
                        socket.send("Error deleting message:");
                    }
                    break;

                case "USER_JOINED":
                    try {
                        const newUser = parsedMessage.payload as PublicUser;
                        const updatedUser = handleUserJoined(userId, newUser);

                        if (updatedUser) {
                            broadcast(
                                {
                                    type: "USER_JOINED",
                                    payload: updatedUser,
                                },
                                wss
                            );
                        }
                    } catch (error) {
                        console.error("Error processing user join:", error);
                        socket.send("Error processing chat join request");
                    }
                    broadcastParticipants(getParticipants(), wss);
                    break;
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
        const disconnectedUser = getUserBySocket(socket);

        if (disconnectedUser) {
            const publicUser: PublicUser = {
                id: disconnectedUser.id,
                name: disconnectedUser.name,
                color: disconnectedUser.color,
            };

            removeUser(disconnectedUser.id);
            console.log(`User ${disconnectedUser?.id} disconnected`);
            broadcast({ type: "USER_LEFT", payload: publicUser }, wss);
            broadcastParticipants(getParticipants(), wss);
        }
    });

    socket.on("error", (error) => {
        console.log("Error:", error);
    });
});

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
