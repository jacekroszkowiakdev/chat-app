import "./Chat.css";
import { useEffect, useState } from "react";
import {
    connectWebSocket,
    disconnectWebSocket,
} from "../../store/actions/websocket.actions";
import { RootState } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import UserSetup from "../UserSetup/UserSetup";
import DisplayChat from "../Chat/DisplayChat/DisplayChat";
import DisplayParticipants from "../Chat/DisplayParticipants/DisplayParticipants";
import ThemeToggle from "../ui/ThemeToggle/ThemeToggle";

const Chat = () => {
    const dispatch = useDispatch();
    const participants = useSelector(
        (state: RootState) => state.chat.participants
    );
    const joined = useSelector((state: RootState) => state.user.joined);
    const [userReady, setUserReady] = useState(false);
    const [activeTab, setActiveTab] = useState<"chat" | "participants">("chat");

    useEffect(() => {
        if (!joined) return;
        dispatch(connectWebSocket());
        return () => {
            dispatch(disconnectWebSocket());
        };
    }, [joined, dispatch]);

    return (
        <div>
            {!userReady ? (
                <UserSetup onComplete={() => setUserReady(true)} />
            ) : (
                <div className="chat-container">
                    <ThemeToggle />
                    <div className="chat-header">
                        <div className="chat-header-top">
                            Status Meeting Standup
                        </div>
                        <div className="tab-buttons">
                            <button
                                onClick={() => setActiveTab("participants")}
                                className={`tab-button ${
                                    activeTab === "participants" ? "active" : ""
                                }`}
                            >
                                Participants ({participants.length})
                            </button>
                            <button
                                onClick={() => setActiveTab("chat")}
                                className={`tab-button ${
                                    activeTab === "chat" ? "active" : ""
                                }`}
                            >
                                Chat
                            </button>
                        </div>
                    </div>

                    <div className="chat-content">
                        {activeTab === "participants" && (
                            <DisplayParticipants participants={participants} />
                        )}
                        {activeTab === "chat" && <DisplayChat />}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
