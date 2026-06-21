import { BASEURL } from "./http";
import { handleApiError } from "../utils/helper";


export async function joinVirtualRoomAPI(groupId, accessToken) {
    const res = await fetch(`${BASEURL}/api/groups/${groupId}/virtual-room/join`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });

    const data = await res.json();

    if (!res.ok) {
        console.error(handleApiError(data));
        throw new Error("Failed to join virtual room");
    }

    return data; 
    // Returns: { roomId, groupId, participants: [ { userId, username, avatarUrl } ] }
}