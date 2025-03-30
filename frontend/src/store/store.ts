import { configureStore } from "@reduxjs/toolkit";
import websocketSlice from "./slices/websocket.slice";

export const store = configureStore({
    reducer: {
        websocket: websocketSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
