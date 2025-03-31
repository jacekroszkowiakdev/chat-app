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

export type NewMessagePayload = Omit<Message, "id">;

export type EditedMessagePayload = {
    id: string;
    content: string;
    editedAt: string;
    edited: boolean;
};

interface ChatError {
    message: string;
    code: number;
}

export type WebSocketMessage =
    | { type: "NEW_MESSAGE"; payload: NewMessagePayload }
    | { type: "EDIT_MESSAGE"; payload: EditedMessagePayload }
    | { type: "DELETE_MESSAGE"; payload: Message }
    | { type: "USER_JOINED"; payload: PublicUser }
    | { type: "USER_LEFT"; payload: PublicUser }
    | { type: "PARTICIPANT_LIST"; payload: PublicUser[] }
    | { type: "ERROR"; payload: ChatError };
