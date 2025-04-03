import "./ThemeToggle.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/store";
import { toggleDarkMode } from "../../../store/slices/theme.slice";
import { CgDarkMode } from "react-icons/cg";

const ThemeToggle = () => {
    const dispatch = useDispatch();
    const darkMode = useSelector((state: RootState) => state.theme.darkMode);

    return (
        <button
            className="theme-toggle"
            onClick={() => dispatch(toggleDarkMode())}
            aria-label="Toggle Dark Mode"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
            <CgDarkMode />
        </button>
    );
};

export default ThemeToggle;
