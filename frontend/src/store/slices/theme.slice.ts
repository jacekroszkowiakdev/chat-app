import { createSlice } from "@reduxjs/toolkit";

interface ThemeSlice {
    darkMode: boolean;
}

const initialState: ThemeSlice = {
    darkMode: localStorage.getItem("dark-mode") === "true",
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
            localStorage.setItem("dark-mode", state.darkMode.toString());
        },
    },
});

export const { toggleDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
