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
        return handleApiError(data);
    }
}

export async function deleteMessageAPI(accessToken, msgid) {
    const res = await fetch(`${BASEURL}/api/GroupChat/${msgid}/DeleteMessage`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(handleApiError(data));
    }

    return msgid;
}

export async function editMessageAPI(accessToken, msgid, content) {
    const res = await fetch(`${BASEURL}/api/GroupChat/${msgid}/EditMessage`, {
        method: "put",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            content,
        }),
    });

    const data = await res.json();

    if (!res.ok) {
        console.log(handleApiError(data));
        return handleApiError(data);
    }

    return data;
}
