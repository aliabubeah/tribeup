import { authFetch } from "./http";

export async function getprofile() {
    const res = await authFetch("/api/Profile/Me");
    return res.json();
}
