import { data } from "autoprefixer";
import { handleApiError } from "../utils/helper";
import { BASEURL } from "./http";

export async function MyGroupsAPI({ accessToken, page = 1 }) {
    const res = await fetch(
        `${BASEURL}/api/Groups/MyGroups?page=${page}&pageSize=10`,
        {
            headers: {
                "Content-Type": "application/json",
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

export async function discoverGroupsAPI({
    accessToken,
    page,
    pageSize = 20,
    search,
}) {
    const params = {
        page,
        pageSize,
    };

    if (search) params.search = search;

    const queryParams = new URLSearchParams(params).toString();

    const res = await fetch(
        `${BASEURL}/api/Groups/ExploreGroups?${queryParams}`,
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

export async function leaveAPI({ accessToken, tribeId }) {
    const res = await fetch(
        `${BASEURL}/api/GroupMembers/LeaveGroup/${tribeId}`,
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

export async function getFollowersAPI({
    accessToken,
    groupId,
    page,
    pageSize = 10,
    searchTerm,
}) {
    const params = {
        groupId,
        page,
        pageSize,
    };

    if (searchTerm) params.searchTerm = searchTerm;

    const queryParams = new URLSearchParams(params).toString();
    const res = await fetch(
        `${BASEURL}/api/groups/${groupId}/GetFollowers?${queryParams}`,
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

export async function toggleFollowAPI({ accessToken, groupId }) {
    const res = await fetch(
        `${BASEURL}/api/groups/${groupId}/GetFollowers/ToggleFollow`,
        {
            method: "post",
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
    console.log(data);
    return data;
}

export async function createInvitationAPI({
    accessToken,
    groupId,
    maxUse,
    expireAt,
}) {
    const res = await fetch(
        `${BASEURL}/api/GroupInvitations/CreateInvitations/${groupId}`,
        {
            method: "post",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                expiresAt: expireAt,
                maxUses: maxUse,
            }),
        },
    );

    const data = await res.json();

    if (!res.ok) {
        console.log(handleApiError(data));
        return handleApiError(data);
    }
    return data;
}

export async function tribeInvitationsAPI({ accessToken, groupId }) {
    const res = await fetch(
        `${BASEURL}/api/GroupInvitations/GroupInvitations/${groupId}?page=1&pageSize=10`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
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
