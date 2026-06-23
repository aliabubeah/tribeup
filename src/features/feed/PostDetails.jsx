import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getPostById } from "../../services/posts";
import PostCardSkeleton from "../../ui/Skeleton/PostCardSkeleton";
import PostModal from "../../ui/posts/PostModal";

function PostDetails() {
    const { postId } = useParams();
    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        data,
        isPending,
        error,
    } = useQuery({
        queryKey: ["post", postId],
        queryFn: () => getPostById({ accessToken, id: postId }),
        enabled: !!accessToken && !!postId,
    });

    const post = data?.item ?? data?.post ?? data;

    function handleClose() {
        if (location.key !== "default" && window.history.length > 1) {
            navigate(-1);
            return;
        }

        navigate("/", { replace: true });
    }

    if (isPending) {
        return <PostCardSkeleton length={1} />;
    }

    if (error || !post?.postId) {
        return (
            <div className="rounded-xl bg-white p-6 text-center">
                <p className="font-medium">Post not found</p>
                <button
                    className="mt-4 rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                    onClick={() => navigate("/", { replace: true })}
                >
                    Go to feed
                </button>
            </div>
        );
    }

    return <PostModal post={post} isOpen={true} onClose={handleClose} />;
}

export default PostDetails;
