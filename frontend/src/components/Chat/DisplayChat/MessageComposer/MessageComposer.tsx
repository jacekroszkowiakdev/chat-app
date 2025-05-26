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
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingMessage) {
            setMessageInput(editingMessage.content);
        } else {
            setMessageInput("");
        }
    }, [editingMessage]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageInput(e.target.value);
    };

    const handleSubmitMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingMessage) {
            onEdit(editingMessage.id, messageInput);
        } else {
            sendMessage(messageInput);
        }
        setMessageInput("");
    };

    const handleSave = () => {
        if (!messageInput.trim()) return;
        onEdit(editingMessage!.id, messageInput);
    };

    return (
        <div className="message-composer">
            <label htmlFor="message-input" className="sr-only">
                Message input
            </label>
            <form onSubmit={handleSubmitMessage}>
                <input
                    ref={inputRef}
                    id="message-input"
                    className="composer-textarea"
                    name="message"
                    value={messageInput}
                    onChange={handleInputChange}
                    placeholder={
                        editingMessage ? "Editing message..." : "Message"
                    }
                />
            </form>
            {editingMessage && (
                <div className="composer-actions">
                    <button
                        type="button"
                        className="composer-button save"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                    <button
                        type="button"
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
