import toast from "react-hot-toast";
import { handleApiError } from "../utils/helper";
import { BASEURL } from "./http";

export async function feedAPI(accessToken, page = 1) {
    const res = await fetch(
        `${BASEURL}/api/Posts/Feed?page=${page}&pageSize=20`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );

    let data;
    try {
        data = await res.json();
    } catch {
        data = null;
    }

    if (!res.ok) {
        console.error("Feed API error:", {
            status: res.status,
            statusText: res.statusText,
            body: data,
        });

        throw new Error(
            data?.message ||
                data?.Message ||
                `Request failed with status ${res.status}`,
        );
    }

    return data;
}

export async function toggleLikeAPI(accessToken, postId) {
    const res = await fetch(`${BASEURL}/api/posts/${postId}/ToggleLike`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to toggle like");
    }

    return true;
}

export async function deletePostAPI(postId, accessToken) {
    const res = await fetch(`${BASEURL}/api/Posts/${postId}/DeletePost`, {
        method: "delete",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await res.json();
    console.log(data);
    console.log(res);
    if (!res.ok) {
        console.log(handleApiError(data));
        toast.error("couldn't delete post ");

        return handleApiError(data);
    }
    toast.success("successfully deleted post ");
    return data;
}
