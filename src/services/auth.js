import toast from "react-hot-toast";
import { BASEURL, getDeviceId } from "./http";
const deviceId = getDeviceId();

export async function loginAPI(data) {
    const res = await fetch(`${BASEURL}/api/Authentication/Login`, {
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
                .map((err) => err.errors)
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
    const res = await fetch(`${BASEURL}/api/Authentication/Register`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "X-Device-Id": deviceId,
        },
        body: JSON.stringify(data),
    });

    const registerdata = await res.json();

    if (!res.ok) {
        let errors = [];

        if (Array.isArray(registerdata.Errors)) {
            errors = registerdata.Errors.map((err) => err).flat();
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

export async function logoutAPI(accessToken) {
    const result = await fetch(`${BASEURL}/api/Authentication/Logout`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "X-Device-Id": deviceId,
            Authorization: `Bearer ${accessToken}`,
        },
    });
    console.log(result);
    return result;
}

export async function refreshAPI(refreshToken) {
    const deviceId = getDeviceId();

    const result = await fetch(`${BASEURL}/api/Authentication/Refresh`, {
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

    // HANDLE ERROR
    if (!result.ok) {
        console.error("Refresh failed:", {
            status: result.status,
            statusText: result.statusText,
            body: data ?? errorBody,
        });

        throw new Error(
            data?.Message ||
                data?.error ||
                "Refresh token is invalid or expired",
        );
    }

    return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
    };
}

export async function forgetPasswordAPI(email) {
    const result = await fetch(
        `${BASEURL}/api/Authentication/Forgot-Password`,
        {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
            }),
        },
    );
    return result;
}

export async function resetPasswordAPI(
    accessToken,
    email,
    newPassword,
    confirmPassword,
) {
    const result = await fetch(`${BASEURL}/api/Authentication/Reset-Password`, {
        method: "post",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            email,
            token: accessToken,
            newPassword,
            confirmPassword,
        }),
    });

    const data = await result.json();

    if (!result.ok) {
        let errorMessage = "Reset Failed";

        // 401 Unauthorized
        if (data.Message) {
            errorMessage = data.Message;
        }

        // 400 Validation error
        else if (Array.isArray(data.errors)) {
            errorMessage = data.errors
                .map((err) => err.errors)
                .flat()
                .join(", ");
        }

        return {
            error: errorMessage,
            statusCode: result.status,
        };
    }
    console.log(result);
    console.log(data);
    return data;
}

export async function changePasswordAPI(
    currentPassword,
    newPassword,
    confirmNewPassword,
    accessToken,
) {
    const result = await fetch(
        `${BASEURL}/api/Authentication/Change-Password`,

        {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                currentPassword,
                newPassword,
                confirmNewPassword,
            }),
        },
    );
    let data = null;
    if (result.headers.get("content-type")?.includes("application/json")) {
        data = await result.json();
    }

    if (!result.ok) {
        let errorMessage = "changePassworrd Failed";

        // 400 Validation error
        if (Array.isArray(data.Errors)) {
            errorMessage = data.Errors.map((err) => err)
                .flat()
                .join(", ");
        }

        // 401 Unauthorized
        else if (data.Message) {
            errorMessage = data.Message;
        }

        // return result;
        return {
            error: errorMessage,
            statusCode: result.status,
        };
    }
    toast.success("passwordChanged Successfully");
    return result;
}
