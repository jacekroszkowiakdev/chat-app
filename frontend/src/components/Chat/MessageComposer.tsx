import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { sendWebSocketMessage } from "../../store/actions/websocket.actions";
import { RootState } from "../../store/store";
import { WebSocketMessage, Message } from "../../types/types";

interface MessageComposerProps {
    editingMessage: Message | null;

    onEdit: (id: string, content: string) => void;
    onCancelEdit: () => void;
}

const MessageComposer: React.FC<MessageComposerProps> = ({
    editingMessage,
    onEdit,
    onCancelEdit,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user);
    const isConnected = useSelector(
        (state: RootState) => state.websocket.connected
    );
    const [messageInput, setMessageInput] = useState(
        editingMessage?.content || ""
    );

    useEffect(() => {
        if (editingMessage) {
            setMessageInput(editingMessage.content);
        } else {
            setMessageInput("");
        }
    }, [editingMessage]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessageInput(e.target.value);
    };

    const handleSendOnEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleSendMessage = () => {
        if (!isConnected) {
            console.warn("Socket not connected yet — skipping send");
            return;
        }

        if (!messageInput.trim()) {
            console.warn("Message content cannot be empty");
            return;
        }

        if (editingMessage) {
            onEdit(editingMessage.id, messageInput);
            console.log("Saving edit:", editingMessage.id, messageInput);
        } else {
            const messagePayload: WebSocketMessage = {
                type: "NEW_MESSAGE",
                payload: {
                    userId: user.id,
                    userName: user.name,
                    content: messageInput,
                    createdAt: new Date().toISOString(),
                    edited: false,
                    deleted: false,
                },
            };
            dispatch(sendWebSocketMessage(messagePayload));
        }
    };

    return (
        <div className="message-composer">
            <label htmlFor="message-input" className="sr-only">
                HIDE THIS WITH CSS :)
            </label>
            <textarea
                id="message-input"
                name="message"
                value={messageInput}
                onChange={handleInputChange}
                onKeyDown={handleSendOnEnter}
                placeholder={editingMessage ? "Editing message..." : "Message"}
            />
            <div className="actions">
                {editingMessage ? (
                    <>
                        <button
                            onClick={() =>
                                onEdit(editingMessage.id, messageInput)
                            }
                        >
                            Save
                        </button>
                        <button onClick={onCancelEdit}>Cancel</button>
                    </>
                ) : (
                    <button onClick={handleSendMessage}>Send</button>
                )}
            </div>
        </div>
    );
};

export default MessageComposer;
