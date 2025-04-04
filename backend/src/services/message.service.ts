import { v4 as uuidv4 } from "uuid";
import { Message, PublicUser } from "../types";

const messages: Message[] = [];

export function createMessage(user: PublicUser, content: string): Message {
    const newMessage: Message = {
        id: uuidv4(),
        userId: user.id,
        userName: user.name || `User_${user.id.slice(0, 7)}`,
        content,
        createdAt: new Date().toISOString(),
    };

    messages.push(newMessage);
    return newMessage;
}

export function editMessage(
    userId: string,
    messageId: string,
    content: string,
    editedAt: string,
    edited: boolean
): Message | null {
    const indexToEdit = messages.findIndex(
        (message) => message.id === messageId
    );

    if (indexToEdit === -1) {
        console.warn(`Message not found: ${messageId}`);
        return null;
    }

    const message = messages[indexToEdit];

    if (message.userId !== userId) {
        console.warn(
            `User ${userId} does not have permission to edit message ${messageId}`
        );
        return null;
    }

    message.content = content;
    message.edited = edited;
    message.editedAt = editedAt;

    return message;
}

export function deleteMessage(
    messageId: string,
    userId: string
): Message | null {
    const indexToDelete = messages.findIndex(
        (message) => message.id === messageId
    );

    if (indexToDelete === -1) {
        console.warn(`[MessageService] Message not found: ${messageId}`);
        return null;
    }

    const message = messages[indexToDelete];

    if (message.userId !== userId) {
        console.warn(
            `[MessageService] User ${userId} has no permission to delete message ${messageId}`
        );
        return null;
    }

    message.content = "(Message was deleted)";
    message.deleted = true;
    message.deletedAt = new Date().toISOString();

    return message;
}
