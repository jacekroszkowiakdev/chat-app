import "./DisplayChat.css";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { Message } from "../../../types/types";
import MessageItem from "./MessageItem/MessageItem";
import MessageComposer from "./MessageComposer/MessageComposer";
import { useMessageHandlers } from "../../../hooks/useMessageHandlers";

const DisplayChat = () => {
    const user = useSelector((state: RootState) => state.user);
    const [editingMessage, setEditingMessage] = useState<Message | null>(null);
    const { handleEdit, handleDelete } = useMessageHandlers(setEditingMessage);
    const messages = useSelector((state: RootState) => state.chat.messages);

    const handleCancelEdit = () => {
        setEditingMessage(null);
    };

    return (
        <div className="display-chat">
            {messages.length === 0 ? (
                <p className="no-messages">No messages yet.</p>
            ) : (
                <ul className="message-list">
                    {messages.map((msg: Message) => (
                        <MessageItem
                            key={msg.id}
                            message={msg}
                            isOwn={msg.userId === user.id}
                            onEdit={() => setEditingMessage(msg)}
                            onDelete={() => handleDelete(msg.id)}
                        />
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
