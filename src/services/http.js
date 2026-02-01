import { refreshAPI } from "./auth";

export const BASEURL = import.meta.env.VITE_API_BASE;

export function getCleanImageUrl(serverUrl) {
    if (!serverUrl) return "/default-avatar.png"; // Fallback

    // If we are on Netlify (Production), strip the domain!
    if (BASEURL === "") {
        // Replaces "http://tribeup.runasp.net/images/..." with "/images/..."
        return serverUrl.replace("http://tribeup.runasp.net", "");
    }

    // If on Localhost, keep it as is
    return serverUrl;
}

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
    queue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
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

    let response = await fetch(`${BASEURL}${url}`, {
        ...options,
        headers: {
            ...baseHeaders,
            ...(options.headers || {}),
        },
    });

    if (response.status !== 401) return response;

    // refresh path
    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            queue.push({
                resolve: (token) => {
                    resolve(
                        fetch(`${BASEURL}${url}`, {
                            ...options,
                            headers: {
                                ...baseHeaders,
                                Authorization: `Bearer ${token}`,
                            },
                        }),
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
        throw err;
    } finally {
        isRefreshing = false;
    }
}
