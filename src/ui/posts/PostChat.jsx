import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import avatar from "../../assets/avatar.jpeg";
import { getCleanImageUrl } from "../../services/http";
import { useAuth } from "../../contexts/AuthContext";
import {
    addComment,
    fetchComments,
    likeComment,
    likeCommentOptimistic,
} from "../../features/comments/commentsSlice";
import { formatPostDate } from "../../utils/helper";
import CommentSkeleton from "../Skeleton/CommentSkeleton";

function PostChat({ postId }) {
    const observerRef = useRef(null);
    const loadMoreRef = useRef(null);
    const { user, accessToken } = useAuth();

    const dispatch = useDispatch();
    const commentsState = useSelector(
        (state) => state.comments.byPostId[postId],
    );

    const entities = commentsState?.entities || {};
    const ids = commentsState?.ids || [];
    const page = commentsState?.page || 1;
    const hasMore = commentsState?.hasMore;
    const isInitialLoading = commentsState?.isInitialLoading;

    useEffect(() => {
        console.log("called");
        console.log(page);
        if (!hasMore || commentsState?.isFetchingMore) return;
        if (!loadMoreRef.current) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                dispatch(
                    fetchComments({
                        accessToken,
                        postId,
                        page,
                    }),
                );
            }
        });
        observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, [hasMore, isInitialLoading, accessToken, postId, page, dispatch]);

    if (!commentsState || commentsState?.isInitialLoading) {
        return <CommentSkeleton />;
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 p-2 lg:overflow-y-auto">
                {ids.map((id) => {
                    const comment = entities[id];

                    return (
                        <PostComment
                            postId={comment.postId}
                            id={comment.id}
                            dispatch={dispatch}
                            key={id}
                            likesCount={comment.likesCount}
                            content={comment.content}
                            createdAt={comment.createdAt}
                            profilePicture={comment.profilePicture}
                            userName={comment.username}
                            accessToken={accessToken}
                            isLikedByCurrentUser={comment.isLikedByCurrentUser}
                        />
                    );
                })}
                <div ref={loadMoreRef} className="h-10">
                    {commentsState.isFetchingMore && (
                        <CommentSkeleton length={1} />
                    )}
                </div>
            </div>
            <AddComment
                token={accessToken}
                userPic={user.profilePicture}
                postId={postId}
                className="sticky bottom-0 left-0 right-0 lg:static"
            />
        </div>
    );
}

export default PostChat;

function PostComment({
    dispatch,
    postId,
    id,
    content,
    createdAt,
    profilePicture,
    userName,
    likesCount,
    accessToken,
    isLikedByCurrentUser,
}) {
    const [favoriteToggle, setFavoriteToggle] = useState(isLikedByCurrentUser);

    function handleToggle() {
        console.log(id);
        dispatch(likeCommentOptimistic({ postId, commentId: id }));
        setFavoriteToggle((e) => !e);

        dispatch(
            likeComment({
                accessToken,
                commentId: id,
            }),
        );
    }

    return (
        <div className="flex p-2">
            <div className="flex grow items-start gap-2">
                <img
                    src={getCleanImageUrl(profilePicture)}
                    alt=""
                    className="h-9 w-9 rounded-full"
                />

                <div className="text-left">
                    <h1 className="text-sm font-semibold">{userName}</h1>
                    <p className="text-sm">{content}</p>
                    <p className="text-xs text-neutral-700">
                        {formatPostDate(createdAt)}
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center">
                <button
                    className={`icon-outlined ${favoriteToggle ? "icon-filled text-red-500 " : ""}`}
                    onClick={handleToggle}
                >
                    favorite
                </button>
                <p className="text-xs font-medium">{likesCount}</p>
            </div>
        </div>
    );
}

function AddComment({ className, token, postId, userPic, userName }) {
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
                userPic,
            }),
        );

        setContent("");
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={`flex h-14 gap-2 border-t bg-white p-2 ${className}`}
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
