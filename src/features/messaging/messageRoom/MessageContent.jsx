import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../../contexts/AuthContext";
import avatar from "../../../assets/avatar.jpeg";
import { formatTimeOnly } from "../../../utils/helper";

function MessageContent({
    content,
    senderName,
    senderUserId,
    sentAt,
    senderProfilePic,
}) {
    const { accessToken } = useAuth();

    const decoded = jwtDecode(accessToken);
    const userId =
        decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

    return (
        <div className="flex flex-col">
            {userId === senderUserId ? (
                <div className="mb-3 flex flex-col items-end">
                    <div className="rounded-xl bg-tribe-500 px-2 py-1">
                        <p className="min-h-7 w-fit max-w-56 break-words text-sm font-light">
                            {content}
                        </p>
                        <p className="text-end text-[9px] text-neutral-100">
                            {formatTimeOnly(sentAt)}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="mb-3 flex gap-2">
                    <img
                        src={senderProfilePic}
                        alt=""
                        className="h-9 w-9 rounded-full"
                    />
                    <div className="flex flex-col">
                        <p className="text-[10px] font-medium text-neutral-700">
                            {senderName}
                        </p>
                        <div className="rounded-xl bg-neutral-500 px-2 py-1">
                            <p className="min-h-7 w-fit max-w-56 break-words text-sm font-light">
                                {content}
                            </p>
                            <p className="text-right text-[9px] text-neutral-100">
                                {formatTimeOnly(sentAt)}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    // return userId === senderUserId ? (
    //     <div className="flex flex-col justify-self-end">
    //         <p className="min-h-7 w-fit max-w-56 break-words rounded-xl bg-tribe-500 px-2 py-1 text-sm font-light">
    //             {content}
    //         </p>
    //         <p className="text-end text-[9px] text-neutral-400">
    //             {formatPostDate(sentAt)}
    //         </p>
    //     </div>
    // ) : (
    //     <div className="flex gap-2">
    //         <img src={avatar} alt="" className="h-9 w-9 rounded-full" />
    //         <div className="flex flex-col">
    //             <p className="text-[10px] font-medium text-neutral-700">
    //                 {senderName}
    //             </p>
    //             <div className="rounded-xl bg-neutral-500 px-2 py-1">
    //                 <p className="min-h-7 w-fit max-w-56 break-words text-sm font-light">
    //                     {content}
    //                 </p>
    //                 <p className="text-right text-[9px] text-neutral-100">
    //                     {formatPostDate(sentAt)}
    //                 </p>
    //             </div>
    //         </div>
    //     </div>
    // );
}

export default MessageContent;
