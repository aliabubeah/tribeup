import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import PostCardSkeleton from "../../ui/Skeleton/PostCardSkeleton";
import Post from "../../ui/posts/Post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { GroupFeedAPI } from "../../services/posts";
import PostModal from "../../ui/posts/PostModal";

function TribePosts({ tribeId }) {
    const { accessToken } = useAuth();
    const [activePost, setActivePost] = useState(null);

    const handleOpenComments = useCallback((post) => {
        setActivePost(post);
    }, []);

    const handleCloseModal = () => {
        setActivePost(null);
    };

    const {
        data: tribePosts,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ["tribePosts", tribeId],
        queryFn: ({ pageParam = 1 }) =>
            GroupFeedAPI({
                accessToken,
                groupId: tribeId,
                page: pageParam,
            }),

        initialPageParam: 1,

        getNextPageParam: (lastPage) => {
            if (lastPage.hasMore) {
                return lastPage.page + 1;
            }
            return undefined;
        },

        enabled: !!tribeId && !!accessToken,
    });

    const posts = tribePosts?.pages?.flatMap((page) => page.items ?? []) ?? [];

    const { ref, inView } = useInView({
        threshold: 0.5,
    });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    isFetchingNextPage && <PostCardSkeleton />;

    if (isLoading) return <PostCardSkeleton />;

    if (posts.totalCount === 0) {
        return <div className="py-4 text-center">No posts yet</div>;
    }

    return (
        <div className="flex flex-col gap-4">
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

            {isFetchingNextPage && <PostCardSkeleton />}
            {activePost && (
                <PostModal
                    post={activePost}
                    isOpen={true}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}

export default TribePosts;
