import { useState } from "react";
import { formatPostDate } from "../../utils/helper";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { toggleLikeAPI } from "../../services/posts";

function PostActions({
    likesCount,
    commentCount,
    createdAt,
    postId,
    isLikedByCurrentUser,
    onCommentClick,
}) {
    const [optimisticLike, setOptimisticLike] = useState(null);
    const [optimisticLikesCount, setOptimisticLikesCount] = useState(null);
    const [copy, setCopy] = useState(false);
    const { accessToken } = useAuth();

    const favoriteToggle = optimisticLike ?? isLikedByCurrentUser;
    const currentLikesCount = optimisticLikesCount ?? likesCount;

    const { mutate: toggleLike, isPending } = useMutation({
        mutationFn: () => toggleLikeAPI(accessToken, postId),
        onError: () => {
            setOptimisticLike(null);
            setOptimisticLikesCount(null);
            toast.error("Failed to update like");
        },
    });

    function handleToggle() {
        if (isPending) return;

        const nextFavoriteToggle = !favoriteToggle;
        setOptimisticLike(nextFavoriteToggle);
        setOptimisticLikesCount(
            nextFavoriteToggle
                ? currentLikesCount + 1
                : Math.max(currentLikesCount - 1, 0),
        );
        toggleLike();
    }

    async function handleSharePost() {
        const postLink = `${window.location.origin}/posts/${postId}`;
        try {
            await navigator.clipboard.writeText(postLink);
            setTimeout(() => setCopy(false), 2000);
            setCopy(true);
            toast.success("Link copied to clipboard");
        } catch {
            toast.error("Failed to copy link");
        }
    }

    return (
        <footer className="flex flex-col gap-3">
            <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1">
                        <span
                            className={`icon-outlined text-xl transition-all duration-150 hover:text-red-400 ${favoriteToggle ? "icon-filled text-red-500 " : ""}`}
                            onClick={handleToggle}
                        >
                            favorite
                        </span>
                        {currentLikesCount}
                    </button>
                    <button
                        className="flex items-center gap-1 outline-none"
                        onClick={onCommentClick}
                    >
                        <span className="icon-outlined text-xl ">
                            add_comment
                        </span>
                        {commentCount}
                    </button>
                </div>
                <button
                    className="icon-outlined text-xl"
                    onClick={handleSharePost}
                    title={copy ? "copied" : "copy"}
                >
                    link
                </button>
            </div>

            <p className="mt-2 text-start text-xs text-neutral-600">
                {formatPostDate(createdAt)}
            </p>
        </footer>
    );
}

export default PostActions;
