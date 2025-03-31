import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import Chat from "./components/Chat/Chat";
import UserSetup from "./components/UserSetup/UserSetup";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
    connectWebSocket,
    disconnectWebSocket,
} from "./store/actions/websocket.actions";

const App = () => {
    const dispatch = useDispatch();
    const joined = useSelector((state: RootState) => state.user.joined);

    useEffect(() => {
        if (!joined) return;
        dispatch(connectWebSocket());
        return () => {
            dispatch(disconnectWebSocket());
        };
    }, [joined, dispatch]);

    return joined ? <Chat /> : <UserSetup />;
};

export default App;
