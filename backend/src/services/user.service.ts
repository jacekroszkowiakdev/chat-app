import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";
import { WebSocketUser, PublicUser } from "../types";
import { generateColorCode } from "../utils/colorGenerator";

const users: Map<string, WebSocketUser> = new Map();

export function getParticipants(): PublicUser[] {
    return Array.from(users.values()).map((user: PublicUser) => ({
        id: user.id,
        name: user.name,
        color: user.color,
    }));
}

export function addUser(socket: WebSocket): WebSocketUser {
    const userId = uuidv4();
    const user: WebSocketUser = {
        id: userId,
        socket,
        name: `User_${userId.slice(0, 7)}`,
        color: generateColorCode(),
    };

    users.set(userId, user);
    return user;
}

export function getPublicUserById(userId: string): PublicUser | undefined {
    return users.get(userId);
}

export function getUserBySocket(socket: WebSocket): WebSocketUser | undefined {
    return Array.from(users.values()).find((user) => user.socket === socket);
}

export function removeUser(userId: string): boolean {
    return users.delete(userId);
}
