import { data } from "autoprefixer";
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

export async function groupMembersAPI({
    accessToken,
    tribeId,
    page,
    pageSize = 10,
    search,
}) {
    const params = {
        page,
        pageSize,
    };

    if (search) params.search = search;

    const queryParams = new URLSearchParams(params).toString();

    const res = await fetch(
        `${BASEURL}/api/GroupMembers/GroupMembers/${tribeId}?${queryParams}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );

    const data = await res.json();

    if (!res.ok) {
        console.log(handleApiError(data));
        return handleApiError(data);
    }
    return data;
}

export async function promoteAdminAPI({ accessToken, tribeId, tribeMemberId }) {
    const res = await fetch(
        `${BASEURL}/api/GroupMembers/Promote/${tribeId}/User/${tribeMemberId}`,
        {
            method: "post",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );

    if (!res.ok) {
        console.log(handleApiError(data));
    }

    return true;
}

export async function demoteAdminAPI({ accessToken, tribeId, tribeMemberId }) {
    const res = await fetch(
        `${BASEURL}/api/GroupMembers/Demote/${tribeId}/User/${tribeMemberId}`,
        {
            method: "post",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );

    if (!res.ok) {
        console.log(handleApiError(data));
    }

    return true;
}

export async function kickAPI({ accessToken, tribeId, tribeMemberId }) {
    const res = await fetch(
        `${BASEURL}/api/GroupMembers/Kick/${tribeId}/User/${tribeMemberId}`,
        {
            method: "post",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );

    if (!res.ok) {
        console.log(handleApiError(data));
    }

    return true;
}
