import "./MessageComposer.css";
import { useEffect, useState, useRef } from "react";
import { useSendMessage } from "../../../../hooks/useSendMessage";
import { Message } from "../../../../types/types";

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
    const sendMessage = useSendMessage();
    const [messageInput, setMessageInput] = useState(
        editingMessage?.content || ""
    );
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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
        if (editingMessage) {
            onEdit(editingMessage.id, messageInput);
        } else {
            sendMessage(messageInput);
        }
        setMessageInput("");
    };

    return (
        <div className="message-composer">
            <label htmlFor="message-input" className="sr-only">
                Message input
            </label>
            <textarea
                ref={textareaRef}
                id="message-input"
                className="composer-textarea"
                name="message"
                value={messageInput}
                onChange={handleInputChange}
                onKeyDown={handleSendOnEnter}
                placeholder={editingMessage ? "Editing message..." : "Message"}
            />
            {editingMessage && (
                <div className="composer-actions">
                    <button
                        className="composer-button save"
                        onClick={() => onEdit(editingMessage.id, messageInput)}
                    >
                        Save
                    </button>
                    <button
                        className="composer-button cancel"
                        onClick={onCancelEdit}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default MessageComposer;
