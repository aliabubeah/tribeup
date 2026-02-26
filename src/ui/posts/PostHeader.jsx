import { useAuth } from "../../contexts/AuthContext";
import { getCleanImageUrl } from "../../services/http";
import { deletePostAPI } from "../../services/posts";
import PostActionsMenu from "./PostActionMenu";
import groupPfp from "../../assets/GroupPfp.png";
import { Link } from "react-router-dom";

function PostHeader({
    userName,
    groupName,
    postId,
    groupPicture,
    postPermissions,
    isAuthor,
}) {
    const { accessToken } = useAuth();
    const canModerate = isAuthor || postPermissions?.canDelete;
    // console.log(postPermissions);
    function handleDelete() {
        deletePostAPI(postId, accessToken);
    }

    return (
        <div className="flex items-center justify-between">
            <div className="flex gap-2">
                <img
                    src={getCleanImageUrl(groupPicture)}
                    className="h-12 w-12 rounded-full"
                />
                <div className="flex flex-col">
                    <h1 className="font-semibold">{groupName}</h1>
                    <Link to={userName} className="text-sm text-neutral-700">
                        from {userName}
                    </Link>
                </div>
            </div>
            {/* <PostActionsMenu
                onDelete={(e) => handleDelete()}
                onEdit={(e) => console.log("edit")}
            /> */}
            {canModerate && (
                <PostActionsMenu
                    onDelete={(e) => handleDelete()}
                    onEdit={(e) => console.log("edit")}
                />
            )}
        </div>
    );
}

export default PostHeader;
