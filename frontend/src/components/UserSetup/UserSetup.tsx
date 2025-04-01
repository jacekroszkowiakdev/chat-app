import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { setUserDetails, markUserJoined } from "../../store/slices/user.slice";
import { sendWebSocketMessage } from "../../store/actions/websocket.actions";
import { store } from "../../store/store";

interface UserSetupProps {
    onComplete: () => void;
}

const UserSetup: React.FC<UserSetupProps> = ({ onComplete }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [userName, setUserName] = useState("");

    const waitForWebSocket = () => {
        return new Promise<void>((resolve, reject) => {
            const maxAttempts = 10;
            let attempts = 0;

            const check = () => {
                const currentState: RootState = store.getState();
                if (currentState.websocket.connected) {
                    resolve();
                } else if (attempts < maxAttempts) {
                    attempts++;
                    setTimeout(check, 300);
                } else {
                    reject(new Error("WebSocket not connected"));
                }
            };

            check();
        });
    };

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
        <div style={{ padding: "2rem" }}>
            <h2>User Setup</h2>
            <input
                type="text"
                id="username"
                name="username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                autoComplete="username"
            />
            <button onClick={handleSubmit}>Join Chat</button>
        </div>
    );
};

export default UserSetup;
