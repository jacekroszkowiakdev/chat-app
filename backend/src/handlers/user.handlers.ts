import { getPublicUserById } from "../services/user.service";
import { PublicUser } from "../types";

export function handleUserJoined(
    userId: string,
    userData: PublicUser
): PublicUser | null {
    const user = getPublicUserById(userId);

    if (!user) {
        console.warn(`[UserHandler] User not found: ${userId}`);
        return null;
    }

    if (userData.name !== undefined) user.name = userData.name;
    if (userData.color !== undefined) user.color = userData.color;

    return {
        id: user.id,
        name: user.name,
        color: user.color,
    };
}
