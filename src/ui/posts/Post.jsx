import PostActions from "./PostActions";
import PostContent from "./PostContent";
import PostHeader from "./PostHeader";
import PostMedia from "./PostMedia";

function Post({ post }) {
    return (
        <div className="flex flex-col gap-3 rounded-xl bg-white p-4">
            <PostHeader
                userName={post.username}
                groupName={post.groupName}
                groupPicture={post.groupName}
            />
            {post.media.length > 0 && <PostMedia media={post.media} />}
            <PostContent caption={post.caption} />
            <PostActions
                postId={post.postId}
                likesCount={post.likesCount}
                commentCount={post.commentCount}
                createdAt={post.createdAt}
            />
        </div>
    );
}

export default Post;
