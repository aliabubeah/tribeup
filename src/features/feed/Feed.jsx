import { Navigate, redirect } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Feed() {
    const { user } = useAuth();
    return <div>welcome {user.fullName}</div>;
}

export default Feed;
