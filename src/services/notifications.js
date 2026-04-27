import { handleApiError } from "../utils/helper";
import { BASEURL } from "./http";

export async function getNotificationsAPI({ accessToken, page = 1 }) {
    const res = await fetch(
        `${BASEURL}/api/Notification?pageNumber=${page}&pageSize=20`,
        {
            headers: {
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

export async function markReadAPI({ accessToken, id }) {
    const res = await fetch(`${BASEURL}/api/Notification/${id}/read`, {
        method: "put",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (res.ok) {
        return true;
    }
    const data = await res.json();
    console.log(handleApiError(data));
    handleApiError(data);
}
