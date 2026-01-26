import Post from "../../ui/posts/Post";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeed } from "./feedSlice.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { ClipLoader } from "react-spinners";

function Feed() {
    const dispatch = useDispatch();
    const { accessToken } = useAuth();
    const { ids, entities, hasMore, isLoading } = useSelector(
        (state) => state.feed,
    );
    const observerRef = useRef(null);
    const loadMoreRef = useRef(null);

    /* Initial load */
    useEffect(() => {
        if (!isLoading) {
            dispatch(fetchFeed());
        }
    }, [dispatch]);

    /* Infinite scroll */
    useEffect(() => {
        if (!hasMore || isLoading) return;

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                dispatch(fetchFeed(accessToken));
            }
        });

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => observerRef.current?.disconnect();
    }, [hasMore, isLoading, dispatch, accessToken]);

    return (
        <>
            <div className="flex flex-col gap-3">
                {ids.map((id) => (
                    <Post key={id} post={entities[id]} />
                ))}
            </div>

            {/* Trigger element */}
            <div ref={loadMoreRef} style={{ height: 40 }} />

            {isLoading && (
                <div className="flex justify-center py-2">
                    <ClipLoader size={28} />
                </div>
            )}
        </>
    );
}

export default Feed;
