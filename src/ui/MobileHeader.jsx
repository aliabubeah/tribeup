import { useAuth } from "../contexts/AuthContext";
import { getCleanImageUrl } from "../services/http";

function MobileHeader({ hidden, onProfileClick }) {
    const { user } = useAuth();

    return (
        <header
            className={`fixed top-0 z-40 w-full border-b bg-white transition-transform duration-300 md:hidden ${hidden ? "-translate-y-full" : "translate-y-0"}`}
        >
            <div className="flex items-center justify-between px-4 py-3">
                <button onClick={onProfileClick}>
                    <img
                        src={getCleanImageUrl(user.profilePicture)}
                        alt="profile pic"
                        className="h-10 w-10 rounded-full"
                    />
                </button>
                <span className="text-lg font-semibold text-tribe-500">
                    TribeUp
                </span>
            </div>
        </header>
    );
}

export default MobileHeader;
