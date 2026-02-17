import { handleApiError } from "../utils/helper";
import { authFetch, BASEURL } from "./http";

export async function getprofile() {
    const res = await authFetch("/api/Profile/Me");
    return res.json();
}

export async function profileInfoAPI(accessToken) {
    const res = await fetch(`${BASEURL}/api/Profile/profile-info`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        console.log(handleApiError(data));
        return handleApiError(data);
    }

    return data;
}
