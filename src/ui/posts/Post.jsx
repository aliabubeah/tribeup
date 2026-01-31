import PostActions from "./PostActions";
import PostContent from "./PostContent";
import PostHeader from "./PostHeader";
import PostMedia from "./PostMedia";
import PostModal from "./PostModal";

function Post({ post }) {
    return (
        <div className="flex flex-col gap-3 rounded-xl bg-white p-4">
            <PostHeader
                postId={post.postId}
                userName={post.username}
                groupName={post.groupName}
                groupPicture={post.groupName}
            />
            <PostModal post={post}>
                {({ openModal }) => (
                    <>
                        {post.media.length > 0 && (
                            <PostMedia media={post.media} />
                        )}
                        <PostContent caption={post.caption} />
                        <PostActions
                            isLikedByCurrentUser={post.isLikedByCurrentUser}
                            postId={post.postId}
                            likesCount={post.likesCount}
                            commentCount={post.commentCount}
                            createdAt={post.createdAt}
                            onCommentClick={openModal}
                        />
                    </>
                )}
            </PostModal>
        </div>
    );
}

export default Post;
