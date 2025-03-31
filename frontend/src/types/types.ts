export interface PublicUser {
    id?: string;
    name?: string;
    color?: string;
}

export type Users = PublicUser[];

export interface Message {
    id: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: string;
    edited?: boolean;
    editedAt?: string;
    deleted?: boolean;
    deletedAt?: string;
}

interface ChatError {
    message: string;
    code: number;
}

export type WebSocketMessage =
    | { type: "NEW_MESSAGE"; payload: Message }
    | { type: "EDIT_MESSAGE"; payload: Message }
    | { type: "DELETE_MESSAGE"; payload: Message }
    | { type: "USER_JOINED"; payload: PublicUser }
    | { type: "USER_LEFT"; payload: PublicUser }
    | { type: "PARTICIPANT_LIST"; payload: PublicUser[] }
    | { type: "ERROR"; payload: ChatError };
