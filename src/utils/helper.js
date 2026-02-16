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

export function getDateLabel(dateString, locale = navigator.language) {
    const messageDate = new Date(dateString);

    // Normalize all dates to midnight (prevents timezone edge bugs)
    const normalize = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    };

    const today = normalize(new Date());
    const yesterday = normalize(new Date(today));
    yesterday.setDate(today.getDate() - 1);

    const msgDate = normalize(messageDate);

    if (msgDate.getTime() === today.getTime()) {
        return "Today";
    }

    if (msgDate.getTime() === yesterday.getTime()) {
        return "Yesterday";
    }

    // Localized date formatting
    const formatter = new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    return formatter.format(messageDate);
}

export function groupMessagesByDate(messages) {
    const groups = {};

    messages.forEach((msg) => {
        const dateKey = new Date(msg.createdAt).toDateString();

        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }

        groups[dateKey].push(msg);
    });

    return Object.entries(groups);
}

export function formatTimeOnly(dateString, locale = navigator.language) {
    const date = new Date(dateString + "Z");

    return new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }).format(date);
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
