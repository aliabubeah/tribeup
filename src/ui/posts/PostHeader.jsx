import { useAuth } from "../../contexts/AuthContext";

function PostHeader() {
    const { user } = useAuth();
    return (
        <div className="flex gap-2">
            <img
                src={user.profilePicture}
                className="h-12 min-w-12 rounded-full"
            />
            <div>
                <h1 className="font-semibold">groupName</h1>
                <p className="text-sm text-neutral-700">form @username</p>
            </div>
        </div>
    );
}

export default PostHeader;
