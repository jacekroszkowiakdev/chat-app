import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sendWebSocketMessage } from "../../store/actions/websocket.actions";
import { RootState } from "../../store/store";
import MessageComposer from "./MessageComposer";
import { Message } from "../../types/types";

const Chat = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const [editingMessage, setEditingMessage] = useState<Message | null>(null);
    const messages = useSelector((state: RootState) => state.chat.messages);
    console.log("Messages from Redux store:", messages);

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

    const handleCancelEdit = () => {
        setEditingMessage(null);
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h3>Messages</h3>

            {messages.length === 0 ? (
                <p>No messages yet.</p>
            ) : (
                <ul
                    style={{
                        backgroundColor: "white",
                        padding: "1rem",
                        borderRadius: "5px",
                        listStyle: "none",
                        margin: 0,
                    }}
                >
                    {messages.map((msg: Message) => (
                        <li key={msg.id} style={{ marginBottom: "1rem" }}>
                            <p>
                                {msg.content} {msg.edited && <i>(edited)</i>}
                            </p>
                            {msg.userId === user.id && (
                                <div className="message-actions">
                                    <button
                                        onClick={() => setEditingMessage(msg)}
                                    >
                                        Edit
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <MessageComposer
                editingMessage={editingMessage}
                onEdit={handleEdit}
                onCancelEdit={handleCancelEdit}
            />
        </div>
    );
};

export default Chat;
