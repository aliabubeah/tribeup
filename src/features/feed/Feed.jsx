import Post from "../../ui/posts/Post";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeed } from "./feedSlice.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { ClipLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";
import PostModal from "../../ui/posts/PostModal.jsx";
import { fetchChatInbox } from "../messaging/chatSlice.js";
import PostCardSkeleton from "../../ui/Skeleton/PostCardSkeleton.jsx";
import CreatePost from "../../ui/CreatePost/CreatePost.jsx";

function Feed() {
    const dispatch = useDispatch();
    const { accessToken } = useAuth();
    const { postId } = useParams();
    const navigate = useNavigate();
    const { ids, entities, hasMore, isLoading, page } = useSelector(
        (state) => state.feed,
    );
    const [activePost, setActivePost] = useState(null);

    const handleOpenComments = useCallback((post) => {
        setActivePost(post);
    }, []);

    const handleCloseModal = () => {
        setActivePost(null);
    };

    const selectedPost = postId ? entities[postId] : null;
    const observerRef = useRef(null);
    const loadMoreRef = useRef(null);

    /* Initial load */
    useEffect(() => {
        if (!isLoading) {
            dispatch(fetchFeed({ accessToken }));
            dispatch(fetchChatInbox({ accessToken }));
        }
    }, [dispatch, accessToken]);

    /* Infinite scroll */
    useEffect(() => {
        if (!hasMore || isLoading) return;

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                dispatch(fetchFeed({ accessToken, page }));
            }
        });

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => observerRef.current?.disconnect();
    }, [hasMore, isLoading, dispatch, accessToken]);

    if (isLoading || !ids) {
        return <PostCardSkeleton />;
    }

    return (
        <>
            <CreatePost />
            <div className="flex flex-col gap-3">
                {ids.map((id) => (
                    <Post
                        key={id}
                        post={entities[id]}
                        onOpenComments={handleOpenComments}
                    />
                ))}
            </div>

            {/* Trigger element */}
            <div ref={loadMoreRef} style={{ height: 40 }} />

            {isLoading && (
                <div className="flex justify-center py-2">
                    <ClipLoader size={28} />
                </div>
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
