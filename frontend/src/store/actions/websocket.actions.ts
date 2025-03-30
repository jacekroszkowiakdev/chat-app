import { createAction } from "@reduxjs/toolkit";
import { WebSocketMessage } from "../../types/types";

export const connectWebSocket = createAction("websocket/connect");
export const disconnectWebSocket = createAction("websocket/disconnect");
export const sendWebSocketMessage = createAction<WebSocketMessage>(
    "websocket/sendMessage"
);
export const messageReceived = createAction<WebSocketMessage>(
    "websocket/messageReceived"
);
