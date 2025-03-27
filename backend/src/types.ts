import WebSocket from "ws";

export interface User {
    id: string;
    socket: WebSocket;
    name?: string;
    color?: string;
}

export type Users = User[];

export interface Message {
    id: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: Date;
    edited?: boolean;
    editedAt?: Date;
    deleted?: boolean;
    deletedAt?: Date;
}

export type MessageType =
    | "NEW_MESSAGE"
    | "EDIT_MESSAGE"
    | "DELETE_MESSAGE"
    | "USER_JOINED"
    | "USER_LEFT"
    | "PARTICIPANT_LIST"
    | "ERROR";

export type MessagePayload = string | Message | User | Users;

export type WebSocketMessage = {
    type: MessageType;
    payload: MessagePayload;
};
