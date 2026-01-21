import { useAuth } from "../../contexts/AuthContext";
import Post from "../../ui/posts/Post";
import img1 from "../../assets/PostImg.jpeg";
import portrait from "../../assets/portrait.jpeg";

function Feed() {
    const { user } = useAuth();
    return (
        <div className="flex flex-col gap-3">
            <Post img={[img1, img1]} />
            <Post img={[portrait]} />
            <Post img={[img1]} />
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
        </div>
    );
}

export default Feed;
