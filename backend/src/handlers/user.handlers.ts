import { getPublicUserById } from "../services/user.service";
import { PublicUser } from "../types";

export function handleUserJoined(
    userId: string,
    userData: PublicUser
): PublicUser | null {
    const user = getPublicUserById(userId);

    // console.log("[handleUserJoined] Looking up userId:", userId);
    // console.log("[handleUserJoined] Found user in Map:", user);
    // console.log("[handleUserJoined] Incoming userData:", userData);

    if (!user) {
        console.log(`User not found: ${userId}`);
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
