// import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
    // connectWebSocket,
    sendWebSocketMessage,
    // disconnectWebSocket,
} from "../../store/actions/websocket.actions";
import { WebSocketMessage } from "../../types/types";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Message } from "../../types/types";

const Chat = () => {
    const dispatch = useDispatch<AppDispatch>();
    const isConnected = useSelector(
        (state: RootState) => state.websocket.connected
    );
    const messages = useSelector((state: RootState) => state.chat.messages);
    console.log("Messages from Redux store:", messages);
    // const socketRef = useRef<WebSocket | null>(null);

    const handleSendMessage = () => {
        if (!isConnected) {
            console.warn("Socket not connected yet — skipping send");
            return;
        }
        const messagePayload: WebSocketMessage = {
            type: "NEW_MESSAGE",
            payload: {
                id: Date.now().toString(),
                userId: "abc123",
                userName: "Test User",
                content: "Hello World",
                createdAt: new Date().toISOString(),
                edited: false,
                deleted: false,
            },
        };

        console.log("Dispatching WebSocket message:", messagePayload);
        dispatch(sendWebSocketMessage(messagePayload));
    };

    return (
        <div style={{ padding: "2rem" }}>
            <button onClick={handleSendMessage}>Send Test Message</button>
            <h3>Messages</h3>
            {messages.length === 0 ? (
                <p>No messages yet.</p>
            ) : (
                <ul
                    style={{
                        backgroundColor: "white",
                        padding: "1rem",
                        borderRadius: "5px",
                    }}
                >
                    {messages.map((msg: Message) => (
                        <li key={msg.id}>
                            <strong>{msg.userName}:</strong> {msg.content}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Chat;
