import { handleApiError } from "../utils/helper";
import { authFetch, BASEURL } from "./http";

export async function getprofile() {
    const res = await authFetch("/api/Profile/Me");
    return res.json();
}

export async function profileInfoAPI(accessToken) {
    const res = await fetch(`${BASEURL}/api/Profile/profile-info`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        console.log(handleApiError(data));
        return handleApiError(data);
    }

    return data;
}

export async function updateNameAPI(accessToken, firstName, lastName) {
    const res = await fetch(`${BASEURL}/api/Profile/Name`, {
        method: "put",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            firstName,
            lastName,
        }),
    });

    if (!res.ok) {
        const data = await res.json();
        console.log(handleApiError(data));
        return handleApiError(data);
    }

    console.log(true);
    return true;
}

export async function updateBioAPI(accessToken, bio) {
    const res = await fetch(`${BASEURL}/api/Profile/Bio`, {
        method: "put",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            bio,
        }),
    });

    if (!res.ok) {
        const data = await res.json();
        console.log(handleApiError(data));
        return handleApiError(data);
    }

    console.log(true);
    return true;
}

export async function deleteBioAPI(accessToken) {
    const res = await fetch(`${BASEURL}/api/Profile/Bio/Delete`, {
        method: "delete",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        const data = await res.json();
        console.log(handleApiError(data));
        return handleApiError(data);
    }

    return true;
}

export async function updateNumberAPI(accessToken, phoneNumber) {
    const res = await fetch(`${BASEURL}/api/Profile/Phone`, {
        method: "put",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            phoneNumber,
        }),
    });

    if (!res.ok) {
        const data = await res.json();
        console.log(handleApiError(data));
        return handleApiError(data);
    }

    console.log(true);
    return true;
}

export async function deleteNumberAPI(accessToken) {
    const res = await fetch(`${BASEURL}/api/Profile/Phone/Delete`, {
        method: "delete",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        const data = await res.json();
        console.log(handleApiError(data));
        return handleApiError(data);
    }

    return true;
}

export async function updateProfilePictureAPI(accessToken, file) {
    const formData = new FormData();

    formData.append("Picture", file);

    const res = await fetch(`${BASEURL}/api/Profile/Picture`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
    });

    if (!res.ok) {
        const data = await res.json();
        console.log(handleApiError(data));
        return handleApiError(data);
    }

    return true;
}

export async function updateCoverPictureAPI(accessToken, file) {
    const formData = new FormData();

    formData.append("CoverPicture", file);

    const res = await fetch(`${BASEURL}/api/Profile/Cover`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
    });

    if (!res.ok) {
        const data = await res.json();
        console.log(handleApiError(data));
        return handleApiError(data);
    }

    return true;
}

export async function userProfileAPI(accessToken, userName) {
    const res = await fetch(`${BASEURL}/api/Profile/${userName}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        console.log(handleApiError(data));
        return handleApiError(data);
    }

    return data;
}
