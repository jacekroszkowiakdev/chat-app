import "./MessageItem.css";
import { Message } from "../../../../types/types";
import { formatTime } from "../../../../utils/formatTime";

interface MessageItemProps {
    message: Message;
    isOwn: boolean;
    onEdit: () => void;
    onDelete: () => void;
}

const MessageItem = ({
    message,
    isOwn,
    onEdit,
    onDelete,
}: MessageItemProps) => {
    return (
        <li className={`message-item ${isOwn ? "own-message" : ""}`}>
            <div className="message-meta">
                <strong className="message-user">{message.userName}</strong>
                <span className="message-time">
                    {formatTime(message.createdAt)}
                </span>
            </div>
            <div className="message-content-wrapper">
                <p className="message-content">
                    {message.content} {message.edited && <i>(edited)</i>}
                </p>
                {isOwn && !message.deleted && (
                    <div className="message-hover-actions">
                        <button onClick={onEdit}>Edit</button>
                        <button onClick={onDelete}>Delete</button>
                    </div>
                )}
            </div>
        </li>
    );
};

export default MessageItem;
