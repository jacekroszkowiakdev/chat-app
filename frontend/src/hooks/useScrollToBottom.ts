import { useCallback } from "react";

const useScrollToBottom = (ref: React.RefObject<HTMLElement | null>) => {
    const scrollToBottom = useCallback(() => {
        if (ref.current) {
            ref.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest",
            });
        }
    }, [ref]);

    return scrollToBottom;
};

export default useScrollToBottom;
