import { handleApiError } from "../utils/helper";
import { BASEURL } from "./http";

export async function getNotificationsAPI({ accessToken, page = 1 }) {
    const res = await fetch(
        `${BASEURL}/api/Notification?pageNumber=${page}&pageSize=20`,
        {
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

export async function sendNotificationAPI({ accessToken, id }) {
    const res = await fetch(`${BASEURL}/api/Notification/${id}/read`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (res.ok) {
        return true;
    }

    const data = await res.json();
    return handleApiError(data);
}
