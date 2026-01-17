import { useAuth } from "../../contexts/AuthContext";

function Feed() {
    const { user } = useAuth();
    return (
        <div>
            <p>welcome {user?.fullName}</p>
        </div>
    );
}

export default Feed;
