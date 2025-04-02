import { configureStore } from "@reduxjs/toolkit";
import type { EnhancedStore } from "@reduxjs/toolkit";
import websocketReducer from "./slices/websocket.slice";
import websocketMiddleware from "./middleware/websocket.middleware";
import chatReducer from "./slices/chat.slice";
import userReducer from "./slices/user.slice";
import themeReducer from "./slices/theme.slice";

export const store: EnhancedStore = configureStore({
    reducer: {
        websocket: websocketReducer,
        chat: chatReducer,
        user: userReducer,
        theme: themeReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(websocketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
