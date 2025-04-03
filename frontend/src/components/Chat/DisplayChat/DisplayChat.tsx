import "./DisplayChat.css";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { Message } from "../../../types/types";
import { useMockMessages } from "../../../hooks/useMockMessages";
import MessageItem from "./MessageItem/MessageItem";
import MessageComposer from "./MessageComposer/MessageComposer";
import { useMessageHandlers } from "../../../hooks/useMessageHandlers";
import useScrollToBottom from "../../../hooks/useScrollToBottom.ts";

const DisplayChat = () => {
    const user = useSelector((state: RootState) => state.user);
    const messages = useSelector((state: RootState) => state.chat.messages);

    const [editingMessage, setEditingMessage] = useState<Message | null>(null);
    const { handleEdit, handleDelete } = useMessageHandlers(setEditingMessage);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messageContainerRef = useRef<HTMLUListElement>(null);

    const scrollToBottom = useScrollToBottom(messagesEndRef);

    // Inject mock messages only in development mode for performance testing or UI simulation
    useMockMessages();

    useEffect(() => {
        const timer = setTimeout(() => {
            scrollToBottom();
        }, 100);
        return () => clearTimeout(timer);
    }, [messages, scrollToBottom]);

    const handleCancelEdit = () => {
        setEditingMessage(null);
    };

    return (
        <div className="display-chat">
            {messages.length === 0 ? (
                <p className="no-messages">No messages yet.</p>
            ) : (
                <>
                    <ul className="message-list" ref={messageContainerRef}>
                        {messages.map((msg: Message) => (
                            <MessageItem
                                key={msg.id}
                                message={msg}
                                isOwn={msg.userId === user.id}
                                onEdit={() => setEditingMessage(msg)}
                                onDelete={() => handleDelete(msg.id)}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </ul>
                </>
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
