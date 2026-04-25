import { handleApiError } from "../utils/helper";
import { BASEURL } from "./http";

export async function MyGroupsAPI(accessToken) {
    const res = await fetch(`${BASEURL}/api/Groups/MyGroups`, {
        headers: {
            "Content-Type": "application/json",
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

export async function GetAllGroupsAPI(accessToken) {
    const res = await fetch(`${BASEURL}/api/Groups/GetAllGroups`, {
        headers: {
            "Content-Type": "application/json",
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

export async function GetGroupAPI(accessToken, id) {
    const res = await fetch(`${BASEURL}/api/Groups/GetGroup/${id}`, {
        headers: {
            "Content-Type": "application/json",
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

export async function CreateGroupAPI({
    accessToken,
    groupName,
    description,
    accessibility,
    groupProfilePicture,
}) {
    const queryParams = new URLSearchParams({
        GroupName: groupName,
        Description: description,
        Accessibility: accessibility,
    }).toString();

    const formData = new FormData();
    if (groupProfilePicture) {
        formData.append("GroupProfilePicture", groupProfilePicture);
    }

    const res = await fetch(
        `${BASEURL}/api/Groups/CreateGroup?${queryParams}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        },
    );

    const data = await res.json();

    if (!res.ok) {
        console.log(handleApiError(data));
        return handleApiError(data);
    }

    return data;
}

