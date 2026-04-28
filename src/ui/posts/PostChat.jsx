import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useAuth } from "../../contexts/AuthContext";
import {
    addCommentAPI,
    deletePostCommentAPI,
    editCommentAPI,
    getPostCommentsAPI,
    likeCommentAPI,
} from "../../services/posts";
import { getCleanImageUrl } from "../../services/http";
import { formatPostDate } from "../../utils/helper";
import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import CommentSkeleton from "../Skeleton/CommentSkeleton";
import PostActionsMenu from "./PostActionMenu";

function PostChat({ postId }) {
    const { accessToken } = useAuth();
    const { ref, inView } = useInView();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
        useInfiniteQuery({
            queryKey: ["comments", postId, accessToken],
            queryFn: ({ pageParam = 1 }) =>
                getPostCommentsAPI({
                    accessToken,
                    postId,
                    page: pageParam,
                }),
            getNextPageParam: (lastPage) =>
                lastPage.hasMore ? lastPage.page + 1 : undefined,
            enabled: !!postId,
        });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (status === "pending") return <CommentSkeleton />;

    const comments = data?.pages?.flatMap((page) => page.items ?? []) ?? [];

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 p-2 lg:overflow-y-auto">
                {comments.map((comment) => (
                    <PostComment key={comment.id} comment={comment} />
                ))}

                {/* trigger */}
                <div ref={ref} className="h-10">
                    {isFetchingNextPage && <CommentSkeleton length={1} />}
                </div>
            </div>

            <AddComment postId={postId} />
        </div>
    );
}

export default PostChat;

function PostComment({ comment }) {
    const { accessToken } = useAuth();
    const queryClient = useQueryClient();

    const [favoriteToggle, setFavoriteToggle] = useState(
        comment.isLikedByCurrentUser,
    );
    const [likesCount, setLikesCount] = useState(comment.likesCount);
    const [isEdit, setIsEdit] = useState(false);

    const likeMutation = useMutation({
        mutationFn: () =>
            likeCommentAPI({
                accessToken,
                commentId: comment.id,
            }),

        onMutate: () => {
            const newValue = !favoriteToggle;

            setFavoriteToggle(newValue);
            setLikesCount((count) => (newValue ? count + 1 : count - 1));
        },

        onError: () => {
            const rollback = !favoriteToggle;

            setFavoriteToggle(rollback);
            setLikesCount((count) => (rollback ? count + 1 : count - 1));
        },
    });

    function handleToggle() {
        likeMutation.mutate();
    }

    const deleteMutation = useMutation({
        mutationFn: () =>
            deletePostCommentAPI({
                accessToken,
                commentId: comment.id,
            }),

        onSuccess: () => {
            queryClient.invalidateQueries(["comments", comment.postId]);
        },
    });

    function handleDelete() {
        deleteMutation.mutate();
    }

    function handleEdit() {
        setIsEdit(true);
    }

    return isEdit ? (
        <EditComment
            onEdit={setIsEdit}
            content={comment.content}
            accessToken={accessToken}
            postId={comment.postId}
            commentId={comment.id}
        />
    ) : (
        <div className="flex p-2">
            <div className="flex grow items-start gap-2">
                <Link to={`/${comment.username}`}>
                    <img
                        src={getCleanImageUrl(comment.profilePicture)}
                        alt=""
                        className="h-9 w-9 rounded-full"
                    />
                </Link>

                <div className="text-left">
                    <h1 className="text-sm font-semibold">
                        {comment.username}
                    </h1>
                    <p className="text-sm">{comment.content}</p>
                    <p className="text-xs text-neutral-700">
                        {formatPostDate(comment.createdAt)}
                    </p>
                </div>
            </div>

            <div className="flex items-center">
                <div className="flex flex-col items-center justify-center">
                    <button
                        className={`icon-outlined ${
                            favoriteToggle ? "icon-filled text-red-500 " : ""
                        } transition-all duration-150 ease-in-out`}
                        onClick={handleToggle}
                    >
                        favorite
                    </button>
                    <p className="text-xs font-medium">{likesCount}</p>
                </div>

                {comment.permissions?.canDelete && (
                    <PostActionsMenu
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        remove="comment"
                        icon="more_vert"
                        size="text-lg"
                    />
                )}
            </div>
        </div>
    );
}

function AddComment({ postId, className }) {
    const [content, setContent] = useState("");
    const { accessToken, user } = useAuth();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () =>
            addCommentAPI({
                accessToken,
                postId,
                content,
            }),

        onSuccess: () => {
            queryClient.invalidateQueries(["comments", postId]);
            setContent("");
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (!content.trim()) return;
                mutation.mutate();
            }}
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

function EditComment({ content, accessToken, postId, commentId, onEdit }) {
    const [comment, setComment] = useState(content);
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () =>
            editCommentAPI({
                accessToken,
                postId,
                commentId,
                content: comment,
            }),

        onSuccess: () => {
            queryClient.invalidateQueries(["comments", postId]);
            onEdit(false);
        },
    });

    function handleSubmit(e) {
        e.preventDefault();

        if (!comment.trim()) return;

        mutation.mutate();
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={`flex h-14 w-full gap-2 bg-white p-2`}
        >
            <img
                src={getCleanImageUrl(user.profilePicture)}
                className="h-9 w-9 rounded-full"
            />
            <input
                defaultValue={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Type msg..."
                className="min-w-0 grow rounded-3xl bg-neutral-100 p-2 outline-none placeholder:text-sm placeholder:font-normal placeholder:text-neutral-500"
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
