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
            // console.log("[Backend] Received message:", parsedMessage);

            switch (parsedMessage.type) {
                case "NEW_MESSAGE":
                    try {
                        let content = (
                            parsedMessage.payload as { content: string }
                        ).content;
                        console.log(
                            "[Backend] Handling NEW_MESSAGE with content:",
                            content
                        );
                        const newMessage = handleNewMessage(
                            userId,
                            content,
                            wss
                        );

                        if (newMessage) {
                            console.log(
                                "[Backend] Broadcasting NEW_MESSAGE:",
                                newMessage
                            );
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
                            break;
                        }
                    } catch (error) {
                        console.error("Error processing NEW_MESSAGE:", error);
                        sendSocketError(
                            socket,
                            "Unexpected error while creating message",
                            500
                        );
                    }
                    break;

                case "EDIT_MESSAGE":
                    try {
                        let { id, content, editedAt, edited } =
                            parsedMessage.payload as {
                                id: string;
                                content: string;
                                editedAt: string;
                                edited: boolean;
                            };
                        console.log(
                            `{Backend} Handling EDIT_MESSAGE for ID: ${id}`
                        );
                        const editedMessage = handleEditMessage(
                            userId,
                            id,
                            content,
                            editedAt,
                            edited,
                            wss
                        );

                        if (editedMessage) {
                            console.log(
                                "[Backend] Broadcasting EDIT_MESSAGE:",
                                editedMessage
                            );
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
                            break;
                        }
                    } catch (error) {
                        console.error("Error processing EDIT_MESSAGE:", error);
                        sendSocketError(
                            socket,
                            "Unexpected error while editing message",
                            500
                        );
                    }
                    break;

                case "DELETE_MESSAGE":
                    try {
                        let { id } = parsedMessage.payload as {
                            id: string;
                            content: string;
                        };
                        console.log(
                            `{Backend} Handling DELETE_MESSAGE for ID: ${id}`
                        );
                        const deletedMessage = handleDeleteMessage(
                            userId,
                            id,
                            wss
                        );

                        if (deletedMessage) {
                            console.log(
                                "[Backend] Broadcasting DELETE_MESSAGE:",
                                deletedMessage
                            );
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
                            break;
                        }
                    } catch (error) {
                        console.error(
                            "Error processing DELETE_MESSAGE:",
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
                        // console.log("[Backend] Handling USER_JOINED:", newUser);
                        const updatedUser = handleUserJoined(userId, newUser);
                        // console.log(
                        //     "[Backend] Result from handleUserJoined:",
                        //     updatedUser
                        // );

                        if (updatedUser) {
                            // console.log(
                            //     "[Backend] Broadcasting USER_JOINED:",
                            //     updatedUser
                            // );
                            broadcast(
                                {
                                    type: "USER_JOINED",
                                    payload: updatedUser,
                                },
                                wss
                            );
                        }
                    } catch (error) {
                        console.error("Error processing USER_JOINED:", error);
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
            console.log("Error parsing message:", error);
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
            console.log(`User ${disconnectedUser?.id} disconnected`);
            broadcast({ type: "USER_LEFT", payload: publicUser }, wss);
            broadcastParticipants(getParticipants(), wss);
        }
    });

    socket.on("error", (error) => {
        console.log("Error:", error);
        sendSocketError(socket, "Connection error", 500);
    });
});

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
