import express from "express";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import { PublicUser, WebSocketMessage } from "./types";
import {
    broadcast,
    broadcastParticipants,
    sendSocketError,
} from "./utils/websocket";
import {
    addUser,
    removeUser,
    getParticipants,
    getUserBySocket,
} from "./services/user.service";
import { handleUserJoined } from "./handlers/user.handlers";
import {
    handleNewMessage,
    handleEditMessage,
    handleDeleteMessage,
} from "./handlers/message.handlers";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const PORT = 3001;

wss.on("connection", (socket: WebSocket) => {
    const user = addUser(socket);
    const userId = user.id;

    broadcastParticipants(getParticipants(), wss);

    socket.on("message", (message) => {
        try {
            const parsedMessage: WebSocketMessage = JSON.parse(
                message.toString()
            );

            switch (parsedMessage.type) {
                case "NEW_MESSAGE":
                    try {
                        const content = (
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
                            sendSocketError(
                                socket,
                                "Failed to create message",
                                422
                            );
                        }
                    } catch (error) {
                        console.error(
                            "[WebSocket] Error processing NEW_MESSAGE:",
                            error
                        );
                        sendSocketError(
                            socket,
                            "Unexpected error while creating message",
                            500
                        );
                    }
                    break;

                case "EDIT_MESSAGE":
                    try {
                        const { id, content, editedAt, edited } =
                            parsedMessage.payload as {
                                id: string;
                                content: string;
                                editedAt: string;
                                edited: boolean;
                            };

                        const editedMessage = handleEditMessage(
                            userId,
                            id,
                            content,
                            editedAt,
                            edited,
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
                            sendSocketError(
                                socket,
                                "Error editing message",
                                500
                            );
                        }
                    } catch (error) {
                        console.error(
                            "[WebSocket] Error processing EDIT_MESSAGE:",
                            error
                        );
                        sendSocketError(
                            socket,
                            "Unexpected error while editing message",
                            500
                        );
                    }
                    break;

                case "DELETE_MESSAGE":
                    try {
                        const { id } = parsedMessage.payload as {
                            id: string;
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
                            sendSocketError(
                                socket,
                                "An error occurred processing your request",
                                500
                            );
                        }
                    } catch (error) {
                        console.error(
                            "[WebSocket] Error processing DELETE_MESSAGE:",
                            error
                        );
                        sendSocketError(
                            socket,
                            "Unexpected error while deleting message",
                            500
                        );
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
                        console.error(
                            "[WebSocket] Error processing USER_JOINED:",
                            error
                        );
                        sendSocketError(
                            socket,
                            "Error processing chat join request",
                            400
                        );
                    }

                    broadcastParticipants(getParticipants(), wss);
                    break;
            }
        } catch (error) {
            console.error("[WebSocket] Error parsing message:", error);
            sendSocketError(socket, "Invalid message format", 400);
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

            broadcast({ type: "USER_LEFT", payload: publicUser }, wss);
            broadcastParticipants(getParticipants(), wss);
        }
    });

    socket.on("error", (error) => {
        console.error("[WebSocket] Connection error:", error);
        sendSocketError(socket, "Connection error", 500);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});
