import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { sendWebSocketMessage } from "../store/actions/websocket.actions";

export const useSendMessage = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const isConnected = useSelector(
        (state: RootState) => state.websocket.connected
    );

    const sendMessage = (content: string) => {
        if (!isConnected) {
            console.warn("Socket not connected yet — skipping send");
            return;
        }

        if (!content.trim()) {
            console.warn("Message content cannot be empty");
            return;
        }

        dispatch(
            sendWebSocketMessage({
                type: "NEW_MESSAGE",
                payload: {
                    userId: user.id,
                    userName: user.name,
                    content,
                    createdAt: new Date().toISOString(),
                    edited: false,
                    deleted: false,
                },
            })
        );
    };

    return sendMessage;
};
