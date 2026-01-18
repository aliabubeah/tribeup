import { useAuth } from "../../contexts/AuthContext";

function Feed() {
    const { user } = useAuth();
    return (
        <div>
            <p className="text-xl">welcome {user?.fullName}</p>
        </div>
    );
}

export default Feed;
