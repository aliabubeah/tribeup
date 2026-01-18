import { authFetch } from "./http";

export async function getprofile() {
    const res = await authFetch("/Profile/Me");
    return res.json();
}
