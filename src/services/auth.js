import { BASEURL, getDeviceId } from "./http";

export async function loginAPI(data) {
    const deviceId = getDeviceId();

    const res = await fetch(`${BASEURL}/Authentication/Login`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "X-Device-Id": deviceId,
        },
        body: JSON.stringify(data),
    });

    const loginData = await res.json();

    if (!res.ok) {
        let errorMessage = "Login failed";

        // 401 Unauthorized
        if (loginData.Message) {
            errorMessage = loginData.Message;
        }

        // 400 Validation error
        else if (Array.isArray(loginData.errors)) {
            errorMessage = loginData.errors
                .map(err => err.errors)
                .flat()
                .join(", ");
        }

        return {
            error: errorMessage,
            statusCode: res.status,
        };
    }

    return loginData;
}

export async function registerAPI(data) {
    const res = await fetch(`${BASEURL}/Authentication/Register`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const registerdata = await res.json();

    if (!res.ok) {
        let errors = [];

        if (Array.isArray(registerdata.Errors)) {
            errors = registerdata.Errors.map(err => err).flat();
        } else if (registerdata.Message) {
            errors = registerdata.Message;
        }

        return {
            errors: errors,
            status: res.status,
        };
    }

    return registerdata;
}

export async function refreshAPI(refreshToken) {
    const deviceId = getDeviceId();

    const result = await fetch(`${BASEURL}/Authentication/Refresh`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Device-Id": deviceId,
        },
        body: JSON.stringify({
            refreshToken,
            deviceId,
        }),
    });

    let errorBody = null;
    let data = null;

    const contentType = result.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
        data = await result.json();
    } else {
        errorBody = await result.text();
    }

    // 👇 HANDLE ERROR
    if (!result.ok) {
        console.error("Refresh failed:", {
            status: result.status,
            statusText: result.statusText,
            body: data ?? errorBody,
        });

        throw new Error(
            data?.Message ||
                data?.error ||
                "Refresh token is invalid or expired"
        );
    }

    console.log("Refresh success:", data);

    return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
    };
}
