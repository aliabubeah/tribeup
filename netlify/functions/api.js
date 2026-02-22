export async function handler(event) {
    const path = event.path.replace("/.netlify/functions/api", "");
    const query = event.rawQuery ? `?${event.rawQuery}` : "";
    // eslint-disable-next-line no-undef
    const response = await fetch(`${process.env.API_BASE}${path}${query}`, {
        method: event.httpMethod,
        headers: {
            ...event.headers,
            "Content-Type": "application/json",
        },
        body:
            event.httpMethod !== "GET" && event.httpMethod !== "HEAD"
                ? event.body
                : undefined,
    });

    const text = await response.text();

    return {
        statusCode: response.status,
        body: text,
        headers: {
            "Content-Type": "application/json",
        },
    };
}
