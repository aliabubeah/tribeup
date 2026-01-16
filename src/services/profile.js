import { BASEURL } from "./http";

export async function getprofile(token) {
    const result = await fetch(`${BASEURL}/Profile/Me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!result.ok) {
        console.log(result);
        return result;
    }

    const data = await result.json();
    return data;
}
