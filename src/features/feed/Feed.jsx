import Post from "../../ui/posts/Post";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import PostModal from "../../ui/posts/PostModal.jsx";
import PostCardSkeleton from "../../ui/Skeleton/PostCardSkeleton.jsx";
import CreatePost from "../../ui/CreatePost/CreatePost.jsx";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { feedAPI } from "../../services/posts.js";

function Feed() {
    const { accessToken } = useAuth();
    const [activePost, setActivePost] = useState(null);

    const handleOpenComments = useCallback((post) => {
        setActivePost(post);
    }, []);

    const handleCloseModal = () => {
        setActivePost(null);
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending,
        error,
    } = useInfiniteQuery({
        queryKey: ["feed", accessToken],
        queryFn: ({ pageParam = 1 }) => feedAPI(accessToken, pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.hasMore) {
                return lastPage.page + 1;
            }
            return undefined;
        },
        enabled: !!accessToken,
    });

    const posts = data?.pages?.flatMap((page) => page.items ?? []) ?? [];

    const { ref, inView } = useInView({
        threshold: 0.5,
    });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isPending) {
        return <PostCardSkeleton />;
    }

    if (error) return <p>{error.message}</p>;

    return (
        <>
            <CreatePost />
            <div className="flex flex-col gap-3">
                {posts.map((post, index) => {
                    if (index === posts.length - 1) {
                        return (
                            <div ref={ref} key={post.postId}>
                                <Post
                                    post={post}
                                    onOpenComments={handleOpenComments}
                                />
                            </div>
                        );
                    }

                    return (
                        <Post
                            key={post.postId}
                            post={post}
                            onOpenComments={handleOpenComments}
                        />
                    );
                })}
            </div>

            {isFetchingNextPage && (
                <PostCardSkeleton length={1} className={"mt-2"} />
            )}

            {activePost && (
                <PostModal
                    post={activePost}
                    isOpen={true}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
}

export default Feed;
