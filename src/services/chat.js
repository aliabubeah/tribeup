import { handleApiError } from "../utils/helper";
import { BASEURL } from "./http";

export async function chatInboxAPI(accessToken) {
    const res = await fetch(`${BASEURL}/api/GroupChat/ChatInbox`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = await res.json();

    if (!res.ok) {
        return handleApiError(data);
    }
    return data;
}

export async function getMessagesAPI(accessToken, groupId, page) {
    const res = await fetch(
        `${BASEURL}/api/GroupChat/GetMessages?groupId=${groupId}&page=${page}&pageSize=20`,
        {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );

    const data = await res.json();

    if (!res.ok) {
        return handleApiError(data);
    }

    return data;
}

export async function sendMessageAPI(accessToken, groupId, content) {
    const res = await fetch(`${BASEURL}/api/GroupChat/SendMessage/${groupId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content }),
    });

    if (res.ok) {
        return true;
    }
    const data = await res.json();

    if (!res.ok) {
        console.log(handleApiError(data));
        return handleApiError(data);
    }
}
