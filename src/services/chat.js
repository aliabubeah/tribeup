import { handleApiError } from "../utils/helper";
import { BASEURL } from "./http";

export async function chatInboxAPI() {
    const res = await fetch(`${BASEURL}/api/GroupChat/ChatInbox`, {});
    const data = await res.json();

    if (!res.ok) {
        return handleApiError(data);
    }
    return data;
}
