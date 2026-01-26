import { useState } from "react";
import { formatPostDate } from "../../utils/helper";
import toast from "react-hot-toast";

function PostActions({ likesCount, commentCount, createdAt, postId }) {
    const [favoriteToggle, setFavoriteToggle] = useState(false);
    const [copy, setCopy] = useState(false);

    function handleToggle() {
        setFavoriteToggle((e) => !e);
    }

    async function handleSharePost() {
        const postLink = `${window.location.origin}/posts?$id=${postId}`;
        try {
            await navigator.clipboard.writeText(postLink);
            setTimeout(() => setCopy(false), 2000);
            setCopy(true);
            toast.success("Link copied to clipboard");
        } catch (err) {
            toast.error("Failed to copy link");
            console.log("Failed to copy link", err);
        }
    }

    return (
        <footer className="flex flex-col gap-3">
            <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1">
                        <span
                            className={`icon-outlined text-xl transition-all duration-[.05s] ${favoriteToggle ? "icon-filled text-red-500 " : ""}`}
                            onClick={handleToggle}
                        >
                            favorite
                        </span>
                        {likesCount}
                    </button>
                    <button className="flex items-center gap-1">
                        <span className="icon-outlined text-xl">
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

            <p className="mt-2 text-xs text-neutral-600">
                {formatPostDate(createdAt)}
            </p>
        </footer>
    );
}

export default PostActions;
