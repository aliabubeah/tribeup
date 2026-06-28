import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getCleanImageUrl } from "../../services/http";
import { deletePostAPI } from "../../services/posts";
import PostActionsMenu from "./PostActionMenu";
import { Link } from "react-router-dom";
import EditPost from "../CreatePost/EditPost";
import { useQueryClient } from "@tanstack/react-query";

function PostHeader({
    post,
    userName,
    groupName,
    postId,
    groupPicture,
    postPermissions,
    isAuthor,
    groupId,
}) {
    const { accessToken } = useAuth();
    const queryClient = useQueryClient();
    const [isEditOpen, setIsEditOpen] = useState(false);

    const canEdit = isAuthor || postPermissions?.canEdit;
    const canDelete = isAuthor || postPermissions?.canDelete;

    const removePostFromCache = (queryKey) => {
        queryClient.setQueryData(queryKey, (old) => {
            if (!old) return old;

            return {
                ...old,
                pages: old.pages.map((page) => ({
                    ...page,
                    items: page.items.filter((item) => item.postId !== postId),
                })),
            };
        });
    };

    async function handleDelete() {
        const feedKey = ["feed", accessToken];

        const tribeKey = ["tribePosts", String(groupId)];

        const previousFeed = queryClient.getQueryData(feedKey);

        const previousTribe = queryClient.getQueryData(tribeKey);

        // Optimistically remove from UI
        removePostFromCache(feedKey);
        removePostFromCache(tribeKey);

        try {
            await deletePostAPI(postId, accessToken);
        } catch (err) {
            // Rollback if API fails
            queryClient.setQueryData(feedKey, previousFeed);

            queryClient.setQueryData(tribeKey, previousTribe);

            console.error(err);
        }
    }

    return (
        <div className="flex items-center justify-between">
            <div className="flex gap-2">
                <Link to={`/tribes/${groupId}`}>
                    <img
                        src={getCleanImageUrl(groupPicture)}
                        className="h-12 w-12 rounded-full object-cover"
                    />
                </Link>

                <div className="flex flex-col text-start">
                    <Link
                        to={`/tribes/${groupId}`}
                        className="font-semibold hover:underline"
                    >
                        {groupName}
                    </Link>

                    <Link
                        to={`/${userName}`}
                        className="text-sm text-neutral-700 "
                    >
                        from{" "}
                        <span className="font-semibold text-neutral-950 hover:underline">
                            {userName}
                        </span>
                    </Link>
                </div>
            </div>

            {(canEdit || canDelete) && (
                <PostActionsMenu
                    onDelete={canDelete ? handleDelete : undefined}
                    onEdit={canEdit ? () => setIsEditOpen(true) : undefined}
                />
            )}

            {isEditOpen && post && (
                <EditPost
                    post={post}
                    isOpen={true}
                    onClose={() => setIsEditOpen(false)}
                />
            )}
        </div>
    );
}

export default PostHeader;
