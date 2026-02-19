import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import avatar from "../../assets/avatar.jpeg";
import { getCleanImageUrl } from "../../services/http";
import { useAuth } from "../../contexts/AuthContext";
import { addComment } from "../../features/comments/commentsSlice";
import { formatPostDate } from "../../utils/helper";

function PostChat({ postId }) {
    const { accessToken } = useAuth();

    const dispatch = useDispatch();
    const commentsState = useSelector(
        (state) => state.comments.byPostId[postId],
    );
    const entities = commentsState?.entities || {};
    const ids = commentsState?.ids || [];

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto p-2">
                {ids.map((id) => {
                    const comment = entities[id];

                    return (
                        <PostComment
                            key={id}
                            content={comment.content}
                            createdAt={comment.createdAt}
                            profilePicture={comment.profilePicture}
                            userName={comment.username}
                        />
                    );
                })}
            </div>
            <AddComment token={accessToken} postId={postId} />
        </div>
    );
}

export default PostChat;

function PostComment({ content, createdAt, profilePicture, userName }) {
    return (
        <div className="flex p-2">
            <div className="flex grow items-start gap-2">
                <img src={avatar} alt="" className="h-9 w-9 rounded-full" />

                <div className="text-left">
                    <h1 className="text-sm font-semibold">{userName}</h1>
                    <p className="text-sm">{content}</p>
                    <p className="text-xs text-neutral-700">
                        {formatPostDate(createdAt)}
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center">
                <span className="icon-outlined">favorite</span>
                <p>count</p>
            </div>
        </div>
    );
}

function AddComment({ className, token, postId }) {
    const [content, setContent] = useState("");
    const dispatch = useDispatch();

    function handleSubmit(e) {
        e.preventDefault();

        if (!content.trim()) return;

        dispatch(
            addComment({
                accessToken: token,
                postId,
                content,
            }),
        );

        setContent("");
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={`flex h-14 gap-2 border-t p-2 ${className}`}
        >
            <input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type msg..."
                className="grow rounded-3xl bg-neutral-100 p-2 outline-none placeholder:text-sm placeholder:font-normal placeholder:text-neutral-500"
            />
            <button
                type="submit"
                className="icon-outlined self-center rounded-full bg-neutral-100 px-2 py-1 text-2xl hover:bg-neutral-200 active:bg-neutral-400"
            >
                send
            </button>
        </form>
    );
}
