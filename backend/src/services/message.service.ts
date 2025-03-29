import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import { Message } from "../types";
import { getPublicUser } from "./user.service";

const messages: Message[] = [];

// TODO: extract handlers to files
export function handleNewMessage(
    userId: string,
    content: string,
    _wss: WebSocketServer
): Message | null {
    const user = getPublicUser(userId);
    if (!user) return null;

    const newMessage: Message = {
        id: uuidv4(),
        userId,
        userName: user.name || `User_${userId.slice(0, 7)}`,
        content,
        createdAt: new Date(),
    };

    messages.push(newMessage);
    return newMessage;
}

export function handleEditMessage(
    userId: string,
    messageId: string,
    content: string,
    _wss: WebSocketServer
): Message | null {
    const indexToEdit = messages.findIndex(
        (message) => message.id === messageId
    );

    if (indexToEdit === -1) {
        console.log(`Message not found: ${messageId}`);
        return null;
    }

    const message = messages[indexToEdit];
    if (message.userId === userId) {
        message.content = content;
        message.edited = true;
        message.editedAt = new Date();
        return message;
    } else {
        console.log(`User ${userId} insufficient permissions to edit message`);
        return null;
    }
}

export function handleDeleteMessage(
    userId: string,
    messageId: string,
    _wss: WebSocketServer
): Message | null {
    const indexToDelete = messages.findIndex(
        (message) => message.id === messageId
    );

    if (indexToDelete === -1) {
        console.log(`Message not found: ${messageId}`);
        return null;
    }
    const message = messages[indexToDelete];
    if (message.userId === userId) {
        message.content = "";
        message.deleted = true;
        message.deletedAt = new Date();
        return message;
    } else {
        console.log(
            `User ${userId} insufficient permissions to delete message`
        );
        return null;
    }
}
