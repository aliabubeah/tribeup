import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getCleanImageUrl } from "../../services/http";
import { deletePostAPI } from "../../services/posts";
import PostActionsMenu from "./PostActionMenu";
import { Link } from "react-router-dom";
import EditPost from "../CreatePost/EditPost";

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
    const [isEditOpen, setIsEditOpen] = useState(false);
    const canEdit = isAuthor || postPermissions?.canEdit;
    const canDelete = isAuthor || postPermissions?.canDelete;
    function handleDelete() {
        deletePostAPI(postId, accessToken);
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
                    <Link to={`/tribes/${groupId}`} className="font-semibold">
                        {groupName}
                    </Link>
                    <Link
                        to={`/${userName}`}
                        className="text-sm text-neutral-700"
                    >
                        from {userName}
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
