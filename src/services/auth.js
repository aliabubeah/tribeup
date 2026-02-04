import toast from "react-hot-toast";
import { BASEURL, getDeviceId } from "./http";
import { handleApiError } from "../utils/helper";
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
        console.log(handleApiError(loginData));
        return handleApiError(loginData);
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
        console.log(handleApiError(registerdata));
        return handleApiError(registerdata);
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
    token,
    email,
    newPassword,
    confirmPassword,
) {
    const result = await fetch(`${BASEURL}/api/Authentication/Reset-Password`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            token,
            email,
            newPassword,
            confirmPassword,
        }),
    });

    if (result.ok) {
        toast.success("succesfully reset password");
        return true;
    }

    const data = await result.json();

    if (!result.ok) {
        console.log(handleApiError(data));
        return handleApiError(data);
    }
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
        console.log(handleApiError(data));
        return handleApiError(data);
    }
    toast.success("passwordChanged Successfully");
    return result;
}
