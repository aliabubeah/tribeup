import { handleApiError } from "../utils/helper";
import { BASEURL } from "./http";

export async function MyGroupsAPI(accessToken) {
    const res = await fetch(`${BASEURL}/api/Groups/MyGroups`, {
        headers: {
            "Content-Type": "application/json",
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
