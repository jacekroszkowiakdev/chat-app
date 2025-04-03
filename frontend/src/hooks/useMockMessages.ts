import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateMockMessages } from "../utils/generateMockMessages";
import { addMockMessages } from "../store/slices/chat.slice";
import { RootState } from "../store/store";

export const useMockMessages = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const mockCount = Number(import.meta.env.VITE_MOCK_MESSAGE_COUNT || 0);

    useEffect(() => {
        if (import.meta.env.DEV && user.id && user.name && mockCount > 0) {
            const mocks = generateMockMessages(mockCount, user.id, user.name);
            dispatch(addMockMessages(mocks));
        }
    }, [user.id, user.name, dispatch, mockCount]);
};
