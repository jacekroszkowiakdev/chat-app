import { useCallback } from "react";
import { RootState, store } from "../store/store";

export const useWaitForWebSocket = () => {
    return useCallback((): Promise<void> => {
        return new Promise((resolve, reject) => {
            const maxAttempts = 10;
            let attempts = 0;

            const check = () => {
                const state: RootState = store.getState();
                if (state.websocket.connected) {
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
    }, []);
};
