import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export const useDarkMOde = () => {
    const darkMode = useSelector((state: RootState) => state.theme.darkMode);

    useEffect(() => {
        document.body.className = darkMode ? "dark" : "light";
    }, [darkMode]);
};
