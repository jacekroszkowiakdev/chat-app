import "./DisplayChat.css";
import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { RootState } from "../../../store/store";
import { Message } from "../../../types/types";
import { useMockMessages } from "../../../hooks/useMockMessages";
import MessageItem from "./MessageItem/MessageItem";
import MessageComposer from "./MessageComposer/MessageComposer";
import { useMessageHandlers } from "../../../hooks/useMessageHandlers";

const DisplayChat = () => {
    const user = useSelector((state: RootState) => state.user);
    const messages = useSelector((state: RootState) => state.chat.messages);

    const [editingMessage, setEditingMessage] = useState<Message | null>(null);
    const { handleEdit, handleDelete } = useMessageHandlers(setEditingMessage);

    const listRef = useRef<List>(null);

    // Inject mock messages only in development mode for performance testing or UI simulation
    useMockMessages();

    useEffect(() => {
        const timer = setTimeout(() => {
            listRef.current?.scrollToItem(messages.length - 1, "end");
        }, 100);
        return () => clearTimeout(timer);
    }, [messages]);

    const handleCancelEdit = () => {
        setEditingMessage(null);
    };

    const Row = useCallback(
        ({ index, style }: ListChildComponentProps) => {
            const msg = messages[index];
            return (
                <div style={style}>
                    <MessageItem
                        key={msg.id}
                        message={msg}
                        isOwn={msg.userId === user.id}
                        onEdit={() => setEditingMessage(msg)}
                        onDelete={() => handleDelete(msg.id)}
                    />
                </div>
            );
        },
        [messages, user.id, handleDelete]
    );

    return (
        <div className="display-chat">
            {messages.length === 0 ? (
                <p className="no-messages">No messages yet.</p>
            ) : (
                <>
                    <List
                        ref={listRef}
                        className="message-list"
                        height={500}
                        itemCount={messages.length}
                        itemSize={80}
                        width="100%"
                        outerElementType="ul"
                    >
                        {Row}
                    </List>
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
