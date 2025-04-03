import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
    connectWebSocket,
    disconnectWebSocket,
} from "../store/actions/websocket.actions";

export function useWebSocket(joined: boolean) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!joined) return;
        dispatch(connectWebSocket());

        return () => {
            dispatch(disconnectWebSocket());
        };
    }, [joined, dispatch]);
}
