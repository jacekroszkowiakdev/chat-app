import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WebSocketMessage } from "../../types/types";

interface WebSocketState {
    connected: boolean;
    error: string | null;
    messages: WebSocketMessage[];
}

const initialState: WebSocketState = {
    connected: false,
    error: null,
    messages: [],
};

export const websocketSlice = createSlice({
    name: "websocket",
    initialState,
    reducers: {
        connected: (state) => {
            state.connected = true;
            state.error = null;
        },
        disconnected: (state) => {
            state.connected = false;
            state.error = null;
        },
        connectionError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
    },
});

export const { connected, disconnected, connectionError } =
    websocketSlice.actions;

export default websocketSlice.reducer;
