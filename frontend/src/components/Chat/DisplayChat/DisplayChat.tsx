import "./DisplayChat.css";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sendWebSocketMessage } from "../../../store/actions/websocket.actions";
import { RootState } from "../../../store/store";
import MessageComposer from "./MessageComposer/MessageComposer";
import { Message } from "../../../types/types";

const DisplayChat = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const [editingMessage, setEditingMessage] = useState<Message | null>(null);
    const messages = useSelector((state: RootState) => state.chat.messages);

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

    const handleDelete = (messageId: string) => {
        dispatch(
            sendWebSocketMessage({
                type: "DELETE_MESSAGE",
                payload: {
                    id: messageId,
                    userId: user.id,
                },
            })
        );
        if (editingMessage?.id === messageId) {
            setEditingMessage(null);
        }
    };

    return (
        <div className="display-chat">
            {messages.length === 0 ? (
                <p className="no-messages">No messages yet.</p>
            ) : (
                <ul className="message-list">
                    {messages.map((msg: Message) => (
                        // <li key={msg.id} className="message-item">
                        <li
                            key={msg.id}
                            className={`message-item ${
                                msg.userId === user.id ? "own-message" : ""
                            }`}
                        >
                            <div className="message-meta">
                                <strong className="message-user">
                                    {msg.userName}
                                </strong>
                                <span className="message-time">
                                    {new Date(msg.createdAt).toLocaleTimeString(
                                        [],
                                        {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        }
                                    )}
                                </span>
                            </div>

                            <div className="message-content-wrapper">
                                <p className="message-content">
                                    {msg.content}{" "}
                                    {msg.edited && <i>(edited)</i>}
                                </p>

                                {msg.userId === user.id && !msg.deleted && (
                                    <div className="message-hover-actions">
                                        <button
                                            onClick={() =>
                                                setEditingMessage(msg)
                                            }
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(msg.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <div className="composer-wrapper">
                <MessageComposer
                    editingMessage={editingMessage}
                    onEdit={handleEdit}
                    onCancelEdit={handleCancelEdit}
                />
            </div>
        </div>
    );
};

export default DisplayChat;
