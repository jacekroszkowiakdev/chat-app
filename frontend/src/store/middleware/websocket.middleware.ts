import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
    connectWebSocket,
    disconnectWebSocket,
    sendWebSocketMessage,
    messageReceived,
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

            socket = new WebSocket(import.meta.env.VITE_WS_URL);
            socket.onopen = () => {
                store.dispatch(connected());
                console.log("[WebSocket] Connected to server");
            };

            socket.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    store.dispatch(messageReceived(message));
                } catch (error) {
                    console.error("[WebSocket] Error parsing message:", error);
                }
            };

            socket.onclose = () => {
                store.dispatch(disconnected());
                console.warn("[WebSocket] Disconnected from server");

                if (shouldReconnect) {
                    setTimeout(() => {
                        store.dispatch(connectWebSocket());
                    }, 1000);
                }
            };

            socket.onerror = (error) => {
                console.error("[WebSocket] Connection error:", error);
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
            if (
                socket !== null &&
                (socket.readyState === WebSocket.OPEN ||
                    socket.readyState === WebSocket.CONNECTING)
            ) {
                socket.send(JSON.stringify(action.payload));
            } else {
                console.warn("[WebSocket] Cannot send — socket not open");
                store.dispatch(
                    connectionError(
                        "WebSocket is not open. Cannot send message."
                    )
                );
            }
        }

        return next(action);
    };

export default websocketMiddleware;
