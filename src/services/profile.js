import { BASEURL } from "./http";

// export async function getprofile(token) {
//     const result = await fetch(`${BASEURL}/Profile/Me`, {
//         method: "GET",
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });

//     if (!result.ok) {
//         console.log(result);
//         return result;
//     }

//     const data = await result.json();
//     return data;
// }

import { authFetch } from "./http";

// export async function getprofile() {
//     const res = await authFetch("/Profile/Me");
//     return res.json();
// }

export async function getprofile() {
    console.log("Calling Profile API");
    const res = await authFetch("/Profile/Me");
    console.log("Profile response status:", res.status);
    return res.json();
}
