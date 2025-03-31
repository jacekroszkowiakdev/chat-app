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

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        clearChat: (state) => {
            state.messages = [];
            state.participants = [];
            state.error = null;
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
                            state.messages[index] = editedMessage;
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
                                state.messages[deleteIndex].deleted = true;
                                state.messages[deleteIndex].deletedAt =
                                    new Date().toISOString();
                            }
                        }
                        break;

                    case "USER_JOINED":
                        {
                            const newUser = payload as PublicUser;
                            console.log("[chatSlice] USER_JOINED:", newUser);
                            if (
                                !state.participants.some(
                                    (user) => user.id === newUser.id
                                )
                            ) {
                                state.participants.push(newUser);
                            }
                        }
                        break;

                    case "USER_LEFT":
                        {
                            const disconnectedUser = payload as PublicUser;
                            state.participants = state.participants.filter(
                                (user) => user.id !== disconnectedUser.id
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

export const { clearChat } = chatSlice.actions;
export default chatSlice.reducer;
