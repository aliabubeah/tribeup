import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../../contexts/AuthContext";
import avatar from "../../../assets/avatar.jpeg";
import { formatPostDate } from "../../../utils/helper";
import { useRef } from "react";

function MessageContent({ content, senderName, senderUserId, sentAt }) {
    const { accessToken } = useAuth();

    const decoded = jwtDecode(accessToken);
    const userId =
        decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

    return userId === senderUserId ? (
        <div className="flex flex-col justify-self-end">
            <p className="min-h-7 w-fit max-w-56 break-words rounded-xl bg-tribe-500 px-2 py-1 text-sm font-light">
                {content}
            </p>
            <p className="text-end text-[9px] text-neutral-400">
                {formatPostDate(sentAt)}
            </p>
        </div>
    ) : (
        <div className="flex gap-2">
            <img src={avatar} alt="" className="h-9 w-9" />
            <div className="flex flex-col">
                <p className="text-[9px] text-neutral-400">{senderName}</p>
                <p className="min-h-7 w-fit max-w-56 break-words rounded-xl bg-neutral-500 px-2 py-1 text-sm font-light">
                    {content}
                </p>
                <p className="text-[9px] text-neutral-400">
                    {formatPostDate(sentAt)}
                </p>
            </div>
        </div>
    );
}

export default MessageContent;
