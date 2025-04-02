import { useDispatch, useSelector } from "react-redux";
import { sendWebSocketMessage } from "../store/actions/websocket.actions";
import { RootState } from "../store/store";

export const useMessageHandlers = (setEditingMessage: (msg: null) => void) => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);

    const handleEdit = (id: string, content: string) => {
        dispatch(
            sendWebSocketMessage({
                type: "EDIT_MESSAGE",
                payload: {
                    id,
                    content,
                    editedAt: new Date().toISOString(),
                    edited: true,
                },
            })
        );
        setEditingMessage(null);
    };

    const handleDelete = (
        messageId: string,
        editingMessageId?: string | null
    ) => {
        dispatch(
            sendWebSocketMessage({
                type: "DELETE_MESSAGE",
                payload: {
                    id: messageId,
                    userId: user.id,
                },
            })
        );

        if (editingMessageId === messageId) {
            setEditingMessage(null);
        }
    };

    return { handleEdit, handleDelete };
};
