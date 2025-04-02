import "./UserSetup.css";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { setUserDetails, markUserJoined } from "../../store/slices/user.slice";
import { sendWebSocketMessage } from "../../store/actions/websocket.actions";
import { useWaitForWebSocket } from "../../hooks/useWaitForWebSocket";

interface UserSetupProps {
    onComplete: () => void;
}

const UserSetup: React.FC<UserSetupProps> = ({ onComplete }) => {
    const waitForWebSocket = useWaitForWebSocket();
    const dispatch = useDispatch<AppDispatch>();
    const [userName, setUserName] = useState("");

    const handleSubmit = async () => {
        if (!userName.trim()) {
            console.warn("User name cannot be empty");
            return;
        }

        dispatch(setUserDetails({ name: userName }));
        dispatch(markUserJoined());

        try {
            await waitForWebSocket();

            dispatch(
                sendWebSocketMessage({
                    type: "USER_JOINED",
                    payload: {
                        name: userName,
                    },
                })
            );
            onComplete();
        } catch (error) {
            console.error("WebSocket connection error:", error);
        }
    };

    return (
        <div className="user-setup-container">
            <input
                type="text"
                id="username"
                name="username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit();
                }}
                placeholder="Enter your name"
                autoComplete="username"
            />
            <button onClick={handleSubmit}>Join Chat</button>
        </div>
    );
};

export default UserSetup;
