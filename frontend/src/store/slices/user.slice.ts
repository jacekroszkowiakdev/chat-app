import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PublicUser } from "../../types/types";
import { messageReceived } from "../actions/websocket.actions";

interface UserState {
    id: string;
    name: string;
    color: string;
    joined: boolean;
}

const initialState: UserState = {
    id: "",
    name: "",
    color: "#000000",
    joined: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserDetails: (state, action: PayloadAction<Partial<PublicUser>>) => {
            if (action.payload.name) state.name = action.payload.name;
            if (action.payload.color) state.color = action.payload.color;
        },
        markUserJoined: (state) => {
            state.joined = true;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(messageReceived, (state, action) => {
            const { type, payload } = action.payload;

            if (type === "USER_JOINED") {
                const joinedUser = payload as PublicUser;

                if (joinedUser.name === state.name) {
                    state.id = joinedUser.id || "";
                    state.color = joinedUser.color || "";
                    state.name = joinedUser.name || "";
                    state.joined = true;
                }
            }
        });
    },
});

export const { setUserDetails, markUserJoined } = userSlice.actions;
export default userSlice.reducer;
