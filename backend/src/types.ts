import WebSocket from "ws";

export interface User {
    id: string;
    socket: WebSocket;
    name?: string;
    color?: string;
}

export interface Message {
    id: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: Date;
    edited?: boolean;
    editedAt?: Date;
}
