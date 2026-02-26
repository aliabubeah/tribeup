import { useNavigate } from "react-router-dom";
import PostActions from "./PostActions";
import PostContent from "./PostContent";
import PostHeader from "./PostHeader";
import PostMedia from "./PostMedia";
import React from "react";

function Post({ post }) {
    const navigate = useNavigate();
    function handleOpenComments(e) {
        e.stopPropagation();
        navigate(`/posts/${post.postId}?focus=comments`);
    }
    // console.log(post);
    return (
        <div className="flex flex-col gap-3 rounded-xl bg-white p-4">
            <PostHeader
                postId={post.postId}
                userName={post.username}
                groupName={post.groupName}
                groupPicture={post.groupProfilePicture}
                postPermissions={post.postPermissions}
            />

            {post.media.length > 0 && <PostMedia media={post.media} />}
            <PostContent caption={post.caption} />
            <PostActions
                isLikedByCurrentUser={post.isLikedByCurrentUser}
                postId={post.postId}
                likesCount={post.likesCount}
                commentCount={post.commentCount}
                createdAt={post.createdAt}
                onCommentClick={handleOpenComments}
            />
        </div>
    );
}

export default React.memo(Post);
