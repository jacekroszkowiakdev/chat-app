import "./styles/global.css";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store/store.ts";
import Chat from "./components/Chat/Chat.tsx";

const App = () => {
    const darkMode = useSelector((state: RootState) => state.theme.darkMode);

    useEffect(() => {
        document.body.className = darkMode ? "dark" : "light";
    }, [darkMode]);
    return <Chat />;
};

export default App;
