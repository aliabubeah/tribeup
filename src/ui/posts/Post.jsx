import PostActions from "./PostActions";
import PostContent from "./PostContent";
import PostHeader from "./PostHeader";
import PostMedia from "./PostMedia";

function Post({ img = [] }) {
    return (
        <div className="flex flex-col gap-3 rounded-xl bg-white p-4">
            <PostHeader />
            {img.length > 0 && <PostMedia img={img} />}
            <PostContent>
                By setting the text to a fixed width, it can only grow
                vertically from auto height resizing.
            </PostContent>
            <PostActions />
        </div>
    );
}

export default Post;
