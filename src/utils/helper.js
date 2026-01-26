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
