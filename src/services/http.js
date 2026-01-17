import { refreshAPI } from "./auth";

export const BASEURL = "http://tribeup.runasp.net/api";

export function getDeviceId() {
    let deviceId = localStorage.getItem("deviceId");

    if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem("deviceId", deviceId);
    }

    return deviceId;
}

let accessToken = null;
let isRefreshing = false;
let queue = [];

export function setAccessToken(token) {
    accessToken = token;
}
export function clearAccessToken() {
    accessToken = null;
}

function resolveQueue(error, token = null) {
    queue.forEach(p => (error ? p.reject(error) : p.resolve(token)));
    queue = [];
}

export async function authFetch(url, options = {}) {
    const baseHeaders = {
        "Content-Type": "application/json",
        "X-Device-Id": getDeviceId(),
    };

    if (accessToken) {
        baseHeaders.Authorization = `Bearer ${accessToken}`;
    }
    console.log("AUTH FETCH → using token:", accessToken);

    let response = await fetch(`${BASEURL}${url}`, {
        ...options,
        headers: {
            ...baseHeaders,
            ...(options.headers || {}),
        },
    });

    if (response.status !== 401) return response;

    // 🔁 refresh path
    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            queue.push({
                resolve: token => {
                    resolve(
                        fetch(`${BASEURL}${url}`, {
                            ...options,
                            headers: {
                                ...baseHeaders,
                                Authorization: `Bearer ${token}`,
                            },
                        })
                    );
                },
                reject,
            });
        });
    }

    isRefreshing = true;

    try {
        const refreshToken = localStorage.getItem("refreshToken");
        const data = await refreshAPI(refreshToken);

        accessToken = data.accessToken;
        localStorage.setItem("refreshToken", data.refreshToken);

        resolveQueue(null, accessToken);

        return fetch(`${BASEURL}${url}`, {
            ...options,
            headers: {
                ...baseHeaders,
                Authorization: `Bearer ${accessToken}`,
            },
        });
    } catch (err) {
        resolveQueue(err);
        throw err; // let AuthContext decide
    } finally {
        isRefreshing = false;
    }
}

// export async function authFetch(url, options = {}) {
//     const headers = {
//         "Content-Type": "application/json",
//         "X-Device-Id": getDeviceId(),
//         ...(options.headers || {}),
//     };

//     if (accessToken) {
//         headers.Authorization = `Bearer ${accessToken}`;
//     }

//     let response = await fetch(`${BASEURL}${url}`, {
//         ...options,
//         headers,
//     });
//     if (response.status !== 401) return response;
//     console.log(response.body);

//     // 🔁 ACCESS TOKEN EXPIRED
//     if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//             queue.push({
//                 resolve: token => {
//                     headers.Authorization = `Bearer ${token}`;
//                     resolve(fetch(`${BASEURL}${url}`, { ...options, headers }));
//                 },
//                 reject,
//             });
//         });
//     }

//     isRefreshing = true;

//     try {
//         const refreshToken = localStorage.getItem("refreshToken");
//         const data = await refreshAPI(refreshToken);

//         localStorage.setItem("refreshToken", data.refreshToken);
//         accessToken = data.accessToken;

//         resolveQueue(null, data.accessToken);

//         headers.Authorization = `Bearer ${data.accessToken}`;

//         return fetch(`${BASEURL}${url}`, {
//             ...options,
//             headers: {
//                 ...headers,
//                 ...(options.headers || {}),
//             },
//         });
//     } catch (err) {
//         resolveQueue(err);
//         localStorage.removeItem("refreshToken");
//         window.location.href = "/login";
//         throw err;
//     } finally {
//         isRefreshing = false;
//     }
// }
