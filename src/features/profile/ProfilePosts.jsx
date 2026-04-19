import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Post from "../../ui/posts/Post";

function ProfilePosts({
    posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
}) {
    const { ref, inView } = useInView({
        threshold: 0.5,
    });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (status === "pending") {
        return <div>Loading posts...</div>;
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
                            <Post post={post} />
                        </div>
                    );
                }

                return <Post key={post.postId} post={post} />;
            })}

            {isFetchingNextPage && (
                <div className="py-4 text-center">Loading more...</div>
            )}
        </div>
    );
}

export default ProfilePosts;
