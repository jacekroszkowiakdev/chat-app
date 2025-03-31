import { sendWebSocketMessage } from "../actions/websocket.actions";
import { RootState, AppDispatch } from "../store";

export const sendChatMessage =
    (content: string) => (dispatch: AppDispatch, getState: () => RootState) => {
        if (!content.trim()) return;

        const { user } = getState();

        if (!user.id || !user.name) {
            console.warn("User not initialized — cannot send message.");
            return;
        }

        dispatch(
            sendWebSocketMessage({
                type: "NEW_MESSAGE",
                payload: {
                    userId: user.id,
                    userName: user.name,
                    createdAt: new Date().toISOString(),
                    content,
                },
            })
        );
    };
