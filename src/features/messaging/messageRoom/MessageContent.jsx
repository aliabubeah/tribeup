import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../../contexts/AuthContext";
import { formatTimeOnly } from "../../../utils/helper";
import { getCleanImageUrl } from "../../../services/http";
import { Link } from "react-router-dom";

function MessageContent({
    content,
    senderName,
    senderUserId,
    sentAt,
    senderProfilePic,
    showAvatar,
    isSameSenderAsPrev,
}) {
    const { accessToken } = useAuth();
    const spacingClass = isSameSenderAsPrev ? "mt-1" : "mt-3";

    const decoded = jwtDecode(accessToken);
    const userId =
        decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

    // ✅ SAFE DATE HANDLING
    let formattedTime = "";
    if (sentAt) {
        const d = new Date(sentAt);
        if (!isNaN(d)) {
            formattedTime = formatTimeOnly(d);
        }
    }

    return (
        <div className="flex flex-col">
            {userId === senderUserId ? (
                <div className={`${spacingClass} flex flex-col items-end`}>
                    <div className="rounded-xl bg-tribe-500 px-2 py-1">
                        <p className="w-fit max-w-56 break-words text-sm font-light">
                            {content}
                        </p>
                        {formattedTime && (
                            <p className="text-end text-[9px] text-neutral-100">
                                {formattedTime}
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <div className={`${spacingClass} flex gap-2`}>
                    {showAvatar && (
                        <Link to={`/${senderName}`}>
                            <img
                                src={getCleanImageUrl(senderProfilePic)}
                                alt=""
                                className="h-9 w-9 rounded-full"
                            />
                        </Link>
                    )}

                    <div className="flex flex-col">
                        {showAvatar && (
                            <p className="text-[10px] font-medium text-neutral-700">
                                {senderName}
                            </p>
                        )}

                        <div
                            className={`${
                                !showAvatar ? "ml-11" : ""
                            } rounded-xl bg-neutral-500 px-2 py-1`}
                        >
                            <p className="w-fit max-w-56 break-words text-sm font-light">
                                {content}
                            </p>

                            {formattedTime && (
                                <p className="text-right text-[9px] text-neutral-100">
                                    {formattedTime}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MessageContent;
