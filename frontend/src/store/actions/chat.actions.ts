import { sendWebSocketMessage } from "../actions/websocket.actions";
import { AppDispatch } from "../store";

export const sendChatMessage = (content: string) => (dispatch: AppDispatch) => {
    if (!content.trim()) return;

    dispatch(
        sendWebSocketMessage({
            type: "NEW_MESSAGE",
            payload: {
                id: Date.now().toString(),
                userId: "currentUserId",
                userName: "currentUserName",
                createdAt: new Date().toISOString(),
                content,
            },
        })
    );
};
