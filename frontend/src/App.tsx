import "./styles/global.css";
import Chat from "./components/Chat/Chat.tsx";
import { useDarkMOde } from "./hooks/useDarkMode.ts";

const App = () => {
    useDarkMOde();
    return <Chat />;
};

export default App;
