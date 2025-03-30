import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
    connectWebSocket,
    disconnectWebSocket,
    sendWebSocketMessage,
} from "../actions/websocket.actions";
import {
    connected,
    disconnected,
    connectionError,
} from "../slices/websocket.slice";

let socket: WebSocket | null = null;
let shouldReconnect = true;

export const websocketMiddleware: Middleware<unknown, RootState> =
    (store) => (next) => (action) => {
        // Connect
        if (connectWebSocket.match(action)) {
            if (socket && socket.readyState === WebSocket.OPEN) return;

            socket = new WebSocket("ws://localhost:3001");

            socket.onopen = () => {
                store.dispatch(connected());
                console.log("Connected to WebSocket server");
            };

            socket.onclose = () => {
                store.dispatch(disconnected());
                console.log("Disconnected from WebSocket server");

                if (shouldReconnect) {
                    setTimeout(() => {
                        store.dispatch(connectWebSocket());
                    }, 1000);
                }
            };

            socket.onerror = (error) => {
                console.error("WebSocket error:", error);
                store.dispatch(connectionError("WebSocket connection error"));
            };
        }

        // Disconnect
        else if (disconnectWebSocket.match(action)) {
            shouldReconnect = false;
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
            socket = null;
        }

        // Send message
        else if (sendWebSocketMessage.match(action)) {
            if (socket && socket.readyState === WebSocket.OPEN) {
                console.log("Sending to WebSocket server:", action.payload);
                socket.send(JSON.stringify(action.payload));
            } else {
                console.error("❗ WebSocket is not open. Cannot send message.");
                store.dispatch(
                    connectionError(
                        "WebSocket is not open. Cannot send message."
                    )
                );
            }
        }

        return next(action);
    };
