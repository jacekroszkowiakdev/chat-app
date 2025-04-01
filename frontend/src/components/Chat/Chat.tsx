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
                <div>
                    <div className="tab-buttons">
                        <button
                            onClick={() => setActiveTab("chat")}
                            className={activeTab === "chat" ? "active" : ""}
                        >
                            Chat
                        </button>
                        <button
                            onClick={() => setActiveTab("participants")}
                            className={
                                activeTab === "participants" ? "active" : ""
                            }
                        >
                            Participants ({participants.length})
                        </button>
                    </div>

                    {activeTab === "chat" && <DisplayChat />}
                    {activeTab === "participants" && (
                        <DisplayParticipants participants={participants} />
                    )}
                </div>
            )}
        </div>
    );
};

export default Chat;
