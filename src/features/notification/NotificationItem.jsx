import { Link } from "react-router-dom";
import { getCleanImageUrl } from "../../services/http";
import { formatPostDate } from "../../utils/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markReadAPI } from "../../services/notifications";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

function NotificationItem({ notification }) {
    const { id, isRead, message, createAt, actorPicture, link, title } =
        notification;
    const { accessToken } = useAuth();

    const queryClient = useQueryClient();

    const { mutate: markRead } = useMutation({
        mutationFn: markReadAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["notifications"],
            });
        },
        onError: (err) => toast.error(err.message),
    });

    return (
        <Link
            to={link || "#"}
            className={`flex items-start gap-3 p-4 transition ${
                isRead ? "bg-white" : "bg-neutral-100"
            } hover:bg-neutral-100`}
            onClick={() => markRead({ accessToken, id })}
        >
            {/* Avatar */}
            <img
                src={getCleanImageUrl(actorPicture)}
                alt=""
                className="h-12 w-12 rounded-full object-cover"
            />

            {/* Content */}
            <div className="flex flex-col">
                <h1 className="font-semibold">{title}</h1>
                <p className="text-sm text-neutral-800">{message}</p>

                <span className="text-xs text-neutral-500">
                    {formatPostDate(createAt)}
                </span>
            </div>
        </Link>
    );
}

export default NotificationItem;
