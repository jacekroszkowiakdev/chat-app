import { WebSocketServer } from "ws";
import { Message } from "../types";
import { getPublicUserById } from "../services/user.service";
import {
    createMessage,
    editMessage,
    deleteMessage,
} from "../services/message.service";

export function handleNewMessage(
    userId: string,
    content: string,
    _wss: WebSocketServer
): Message | null {
    const user = getPublicUserById(userId);
    if (!user) return null;
    const newMessage = createMessage(user, content);
    return newMessage;
}

export function handleEditMessage(
    userId: string,
    messageId: string,
    content: string,
    _wss: WebSocketServer
): Message | null {
    return editMessage(userId, messageId, content);
}

export function handleDeleteMessage(
    userId: string,
    messageId: string,
    _wss: WebSocketServer
): Message | null {
    return deleteMessage(userId, messageId);
}
