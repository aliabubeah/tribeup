import { useAuth } from "../../contexts/AuthContext";
import { deletePostAPI } from "../../services/posts";
import PostActionsMenu from "./PostActionMenu";

function PostHeader({ userName, groupName, groupPicture, postId }) {
    const { user, accessToken } = useAuth();

    function handleDelete() {
        deletePostAPI(postId, accessToken);
    }

    return (
        <div className="flex items-center justify-between">
            <div className="flex gap-2">
                <img
                    src={user.profilePicture}
                    className="h-12 min-w-12 rounded-full"
                />
                <div>
                    <h1 className="font-semibold">{groupName}</h1>
                    <p className="text-sm text-neutral-700">from {userName}</p>
                </div>
            </div>

            <PostActionsMenu
                onDelete={(e) => handleDelete()}
                onEdit={(e) => console.log("edit")}
            />
        </div>
    );
}

export default PostHeader;
