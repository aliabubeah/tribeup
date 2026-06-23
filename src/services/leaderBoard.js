import { handleApiError } from "../utils/helper";
import { BASEURL } from "./http";

export async function leaderBoardAPI(accessToken, top = 5) {
    const res = await fetch(`${BASEURL}/api/Leaderboard?top=${top}`, {
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
