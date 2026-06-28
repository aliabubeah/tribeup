import toast from "react-hot-toast";

import { Link } from "react-router-dom";
import { getCleanImageUrl } from "../../services/http";
import { formatPostDate } from "../../utils/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markReadAPI } from "../../services/notifications";
import { useAuth } from "../../contexts/AuthContext";

function NotificationItem({ notification, className }) {
    const { id, isRead, message, createAt, actorPicture, link, title } =
        notification;
    const { accessToken } = useAuth();

    const queryClient = useQueryClient();

    const { mutate: markRead } = useMutation({
        mutationFn: markReadAPI,

        onSuccess: (_, { id }) => {
            queryClient.setQueryData(
                ["notifications", accessToken],
                (oldData) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        pages: oldData.pages.map((page) => ({
                            ...page,
                            notifications: page.notifications.map(
                                (notification) =>
                                    notification.id === id
                                        ? {
                                              ...notification,
                                              isRead: true,
                                          }
                                        : notification,
                            ),
                        })),
                    };
                },
            );
        },

        onError: (err) => toast.error(err.message),
    });

    return (
        <Link
            to={link || "#"}
            className={`flex items-start gap-3 p-4 transition duration-300 ease-in-out ${
                isRead ? "bg-white" : "bg-neutral-200"
            } hover:bg-neutral-100 ${className}`}
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
