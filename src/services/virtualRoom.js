import { BASEURL } from "./http";

export async function joinVirtualRoomAPI(groupId, accessToken) {
    const res = await fetch(
        `${BASEURL}/api/groups/${groupId}/virtual-room/join`,
        {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` },
        },
    );
    return res; // return raw response — caller checks status codes
}

export async function leaveVirtualRoomAPI(groupId, accessToken) {
    return fetch(
        `${BASEURL}/api/groups/${groupId}/virtual-room/leave`,
        {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` },
            keepalive: true, // must use keepalive so it fires on tab close
        },
    ).catch(() => {});
}

export async function getVoiceTokenAPI(groupId, accessToken) {
    const res = await fetch(
        `${BASEURL}/api/groups/${groupId}/virtual-room/voice-token`,
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        },
    );
    if (!res.ok) return null; // non-fatal — voice just won't work
    return res.json(); // returns { token, url }
}

export async function getParticipantsAPI(groupId, accessToken) {
    const res = await fetch(
        `${BASEURL}/api/groups/${groupId}/virtual-room/participants`,
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        },
    );
    if (!res.ok) return [];
    return res.json(); // returns array of { id, username, avatarUrl }
}