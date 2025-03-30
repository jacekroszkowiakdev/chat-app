import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
    connectWebSocket,
    sendWebSocketMessage,
    disconnectWebSocket,
} from "../../store/actions/websocket.actions";
import { WebSocketMessage } from "../../types/types";

const Chat = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(connectWebSocket());
        console.log("Mounting Chat component and connecting to WebSocket");

        return () => {
            dispatch(disconnectWebSocket());
        };
    }, [dispatch]);

    const handleSendMessage = () => {
        const messagePayload: WebSocketMessage = {
            type: "NEW_MESSAGE",
            payload: {
                id: Date.now().toString(),
                userId: "currentUserId",
                userName: "currentUserName",
                createdAt: new Date().toISOString(),
                content: "Hello, this is a message dispatch test!",
            },
        };

        console.log("Dispatching WebSocket message:", messagePayload);
        dispatch(sendWebSocketMessage(messagePayload));
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Chat Component</h2>
            <button onClick={handleSendMessage}>Send Test Message</button>
        </div>
    );
};

export default Chat;
