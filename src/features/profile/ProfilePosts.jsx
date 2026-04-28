import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Post from "../../ui/posts/Post";
import PostCardSkeleton from "../../ui/Skeleton/PostCardSkeleton";
import PostModal from "../../ui/posts/PostModal";
function ProfilePosts({
    posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
}) {
    const [activePost, setActivePost] = useState(null);

    const handleOpenComments = useCallback((post) => {
        setActivePost(post);
    }, []);

    const handleCloseModal = () => {
        setActivePost(null);
    };

    const { ref, inView } = useInView({
        threshold: 0.5,
    });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (status === "pending") {
        return <PostCardSkeleton />;
    }

    if (!posts.length) {
        return <div className="py-4 text-center">No posts yet</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            {posts.map((post, index) => {
                if (index === posts.length - 1) {
                    return (
                        <div ref={ref} key={post.postId}>
                            <Post post={post} onOpenComments={handleOpenComments}/>
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

export default ProfilePosts;
