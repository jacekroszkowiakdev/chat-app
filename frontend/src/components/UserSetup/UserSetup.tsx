import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { setUserDetails, markUserJoined } from "../../store/slices/user.slice";
import { sendWebSocketMessage } from "../../store/actions/websocket.actions";
import { store } from "../../store/store";

const UserSetup = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [userName, setUserName] = useState("");

    const presetColors = [
        "#FF5C5C",
        "#FFD700",
        "#5CB85C",
        "#5BC0DE",
        "#9966FF",
    ];
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    const waitForWebSocket = () => {
        return new Promise<void>((resolve, reject) => {
            const maxAttempts = 10;
            let attempts = 0;

            const check = () => {
                const currentState: RootState = store.getState(); // import your store here
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

        dispatch(setUserDetails({ name: userName, color: `${selectedColor}` }));
        dispatch(markUserJoined());

        try {
            await waitForWebSocket();

            dispatch(
                sendWebSocketMessage({
                    type: "USER_JOINED",
                    payload: {
                        name: userName,
                        color: selectedColor || undefined,
                    },
                })
            );
        } catch (error) {
            console.error("WebSocket connection error:", error);
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>User Setup</h2>
            <input
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <div style={{ display: "flex", gap: "0.5rem", margin: "1rem 0" }}>
                {presetColors.map((color) => (
                    <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        style={{
                            width: "2rem",
                            height: "2rem",
                            borderRadius: "50%",
                            border:
                                selectedColor === color
                                    ? "3px solid black"
                                    : "1px solid #ccc",
                            backgroundColor: color,
                            cursor: "pointer",
                        }}
                    />
                ))}
            </div>

            <button onClick={handleSubmit}>Join Chat</button>
        </div>
    );
};

export default UserSetup;
