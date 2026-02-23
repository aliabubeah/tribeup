import { useNavigate } from "react-router-dom";

import { useState } from "react";
import CreatePostModal from "./CreatePostModal";
import { useAuth } from "../../contexts/AuthContext";
import { getCleanImageUrl } from "../../services/http";

function CreatePost() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="mb-6 flex h-[72px] items-center gap-2 rounded-xl bg-white px-3 py-4">
                <img
                    src={getCleanImageUrl(user.profilePicture)}
                    alt=""
                    className="h-9 w-9 cursor-pointer rounded-full"
                    onClick={() => navigate("/profile")}
                />
                <p
                    className="flex-1 cursor-pointer rounded-2xl bg-neutral-50 px-4 py-[10px] text-sm font-semibold text-neutral-500 hover:bg-neutral-100"
                    onClick={() => setIsOpen(true)}
                >
                    Whats on your mind?
                </p>
                <button className="icon-outlined rounded-full bg-neutral-50 px-3 py-2 hover:bg-neutral-100">
                    add_photo_alternate
                </button>
            </div>
            <CreatePostModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}

export default CreatePost;
