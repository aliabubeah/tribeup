import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCleanImageUrl } from "../../../services/http";
// import avatar from "../../../assets/avatar.jpeg";

function MessageHeader({ onClose, onChatRoom, groupName, groupPic, groupId }) {
    const location = useLocation();
    const navigate = useNavigate();
    const inMessages = location.pathname !== "/messages";

    return (
        <div className="flex h-[60px] items-center justify-between bg-tribe-500 p-3 text-white">
            <div className="flex items-center gap-2">
                <button
                    className="icon-outlined text-2xl"
                    onClick={() => {
                        onChatRoom?.(false);
                        if (location.pathname.startsWith("/messages/")) {
                            navigate("/messages");
                        }
                    }}
                >
                    arrow_back
                </button>

                <div className="flex items-center gap-2">
                    <Link to={`/tribes/${groupId}`}>
                        <img
                            src={getCleanImageUrl(groupPic)}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover"
                        />
                    </Link>
                    <div className="flex flex-col">
                        <h1 className="font-semibold">{groupName}</h1>
                        <p className="text-sm text-tribe-100">Active now</p>
                    </div>
                </div>
            </div>
            <div>
                {inMessages && onClose && (
                    <button className="icon-outlined" onClick={onClose}>
                        close
                    </button>
                )}
            </div>
        </div>
    );
}

export default MessageHeader;
