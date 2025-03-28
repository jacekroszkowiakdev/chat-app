import { v4 as uuidv4 } from "uuid";
import { Message, PublicUser } from "../types";

const messages: Message[] = [];

export function createMessage(user: PublicUser, content: string): Message {
    const newMessage: Message = {
        id: uuidv4(),
        userId: user.id,
        userName: user.name || `User_${user.id.slice(0, 7)}`,
        content,
        createdAt: new Date(),
    };

    messages.push(newMessage);
    return newMessage;
}

export function editMessage(
    messageId: string,
    content: string,
    userId: string
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

export function deleteMessage(
    messageId: string,
    userId: string
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
