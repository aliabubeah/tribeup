export function formatPostDate(isoString) {
    const postDate = new Date(isoString);
    const now = new Date();

    const diffMs = now - postDate;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const time = postDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    // Just now / minutes ago
    if (diffMinutes < 60) {
        return diffMinutes <= 1 ? "Just now" : `${diffMinutes}m ago`;
    }

    // Hours ago
    if (diffHours < 24) {
        return `${diffHours}h ago`;
    }
    if (diffDays === 1) return `Yesterday · ${time}`;
    // Days ago (up to 6 days) + time
    if (diffDays < 7) {
        return `${diffDays}d ago · ${time}`;
    }

    // Older than a week → full date + time
    const fullDate = postDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return `${time} · ${fullDate}`;
}

export function messageRoomData(isoString) {
    const postDate = new Date(isoString);
    const now = new Date();

    const diffMs = now - postDate;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const time = postDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    // Just now / minutes ago
    if (diffMinutes < 60) {
        return diffMinutes <= 1 ? "Just now" : `${diffMinutes}m ago`;
    }

    // Hours ago
    if (diffHours < 24) {
        return `${diffHours}h ago`;
    }
    if (diffDays === 1) return `Yesterday · ${time}`;
    // Days ago (up to 6 days) + time
    if (diffDays < 7) {
        return `${diffDays}d ago · ${time}`;
    }

    // Older than a week → full date + time
    const fullDate = postDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return `${time} · ${fullDate}`;
}

export function handleApiError(errorResponse) {
    // Network / unexpected crash
    if (!errorResponse) {
        return {
            status: 0,
            message: "Network error. Please try again.",
        };
    }

    const { status, title, errors, code } = errorResponse;

    if (status === 400 && errors) {
        return {
            status,
            type: "validation",
            message: title,
            errors: errors,
        };
    }

    if (status === 401) {
        return {
            status,
            type: "auth",
            message: title || "Unauthorized",
            code,
        };
    }

    if (status === 403) {
        return {
            status,
            type: "forbidden",
            message:
                title || "You don’t have permission to perform this action.",
        };
    }

    if (status === 404) {
        return {
            status,
            type: "not_found",
            message: title || "Resource not found.",
        };
    }

    return {
        status: status ?? 500,
        type: "unknown",
        message: title || "Something went wrong.",
    };
}

// export async function apiClient(url, options = {}) {
//     try {
//         const res = await fetch(url, {
//             headers: {
//                 "Content-Type": "application/json",
//                 ...options.headers,
//             },
//             ...options,
//         });

//         const data = await res.json();

//         if (!res.ok) {
//             throw handleApiError(data);
//         }

//         return data;
//     } catch (error) {
//         if (error?.status) throw error;

//         throw handleApiError(null);
//     }
// }
