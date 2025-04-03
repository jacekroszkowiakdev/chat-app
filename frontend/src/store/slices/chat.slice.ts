import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PublicUser, Message, WebSocketMessage } from "../../types/types";
import { messageReceived } from "../actions/websocket.actions";

interface ChatState {
    messages: Message[];
    participants: PublicUser[];
    error: string | null;
}

const initialState: ChatState = {
    messages: [],
    participants: [],
    error: null,
};

export function pushChatLogMessage(
    messages: Message[],
    user: PublicUser,
    action: "joined" | "left"
): void {
    if (!user || !user.id) {
        console.warn(
            `[chatSlice] Skipping USER_${action.toUpperCase()} system message: invalid user`
        );
        return;
    }

    const displayName = user.name || `User_${user.id.slice(0, 5)}`;

    messages.push({
        id: `Meetingbot-${action}-${user.id}-${Date.now()}`,
        userId: "Meetingbot",
        userName: "Meetingbot",
        content: `${displayName} ${action} the chat`,
        createdAt: new Date().toISOString(),
    });
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        clearChat: (state) => {
            state.messages = [];
            state.participants = [];
            state.error = null;
        },
        addMockMessages: (state, action: PayloadAction<Message[]>) => {
            state.messages = [...state.messages, ...action.payload];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(
            messageReceived,
            (state, action: PayloadAction<WebSocketMessage>) => {
                const { type, payload } = action.payload;

                switch (type) {
                    case "NEW_MESSAGE":
                        {
                            const newMsg = payload as Message;
                            const exists = state.messages.some(
                                (m) => m.id === newMsg.id
                            );
                            if (!exists) {
                                state.messages.push(newMsg);
                            }
                        }
                        break;

                    case "EDIT_MESSAGE": {
                        const editedMessage = payload as Message;
                        const index = state.messages.findIndex(
                            (message) => message.id === editedMessage.id
                        );
                        if (index !== -1) {
                            state.messages[index] = {
                                ...state.messages[index],
                                ...editedMessage,
                            };
                        }
                        break;
                    }

                    case "DELETE_MESSAGE":
                        {
                            const deletedMessage = payload as Message;
                            const deleteIndex = state.messages.findIndex(
                                (message) => message.id === deletedMessage.id
                            );
                            if (deleteIndex !== -1) {
                                state.messages[deleteIndex] = {
                                    ...state.messages[deleteIndex],
                                    content: "(Message was deleted)",
                                    deleted: true,
                                    deletedAt: deletedMessage.deletedAt,
                                };
                            }
                        }
                        break;

                    case "USER_JOINED":
                        {
                            const newUser = payload as PublicUser;
                            console.log("[chatSlice] USER_JOINED");
                            if (
                                !state.participants.some(
                                    (user) => user.id === newUser.id
                                )
                            ) {
                                state.participants.push(newUser);
                            }

                            if (!newUser || !newUser.id) {
                                console.warn(
                                    "[chatSlice] Skipping USER_JOINED system message: invalid user"
                                );
                                break;
                            }

                            pushChatLogMessage(
                                state.messages,
                                newUser,
                                "joined"
                            );
                        }
                        break;

                    case "USER_LEFT":
                        {
                            const disconnectedUser = payload as PublicUser;

                            state.participants = state.participants.filter(
                                (user) => user.id !== disconnectedUser.id
                            );

                            if (!disconnectedUser || !disconnectedUser.id) {
                                console.warn(
                                    "[chatSlice] Skipping USER_LEFT system message: invalid user"
                                );
                                break;
                            }

                            pushChatLogMessage(
                                state.messages,
                                disconnectedUser,
                                "left"
                            );
                        }
                        break;

                    case "PARTICIPANT_LIST":
                        {
                            const participants = payload as PublicUser[];
                            state.participants = participants;
                        }
                        break;

                    case "ERROR":
                        {
                            const errorMessage = (
                                payload as { message: string }
                            ).message;
                            state.error = errorMessage;
                        }
                        break;
                }
            }
        );
    },
});

export const { clearChat, addMockMessages } = chatSlice.actions;
export default chatSlice.reducer;
