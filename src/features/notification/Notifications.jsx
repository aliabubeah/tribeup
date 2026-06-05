import {
    getNotificationsAPI,
    markAllAsReadAPI,
} from "../../services/notifications.js";
import { useAuth } from "../../contexts/AuthContext";
import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import NotificationItem from "./NotificationItem";
import NotificationSkeleton from "../../ui/Skeleton/NotificationSkeleton.jsx";

function Notifications() {
    const { accessToken } = useAuth();
    const queryClient = useQueryClient();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
        useInfiniteQuery({
            queryKey: ["notifications", accessToken],

            queryFn: ({ pageParam = 1 }) => {
                return getNotificationsAPI({
                    accessToken,
                    page: pageParam,
                });
            },

            initialPageParam: 1,

            getNextPageParam: (lastPage) => {
                if (lastPage.hasMore) {
                    return lastPage.page + 1;
                }
                return undefined;
            },

            enabled: !!accessToken,
        });

    const { ref, inView } = useInView({
        threshold: 0.5,
    });

    const { mutate: markAllAsRead, isPending: isMarkingAllRead } = useMutation({
        mutationFn: () =>
            markAllAsReadAPI({
                accessToken,
            }),

        onSuccess: () => {
            queryClient.setQueryData(
                ["notifications", accessToken],
                (oldData) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        pages: oldData.pages.map((page) => ({
                            ...page,
                            unreadCount: 0,
                            notifications: page.notifications.map((n) => ({
                                ...n,
                                isRead: true,
                            })),
                        })),
                    };
                },
            );
        },
    });

    const notifications =
        data?.pages?.flatMap((page) => page.notifications ?? []) ?? [];

    const allRead = data?.pages?.[0]?.unreadCount === 0;

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isFetching) {
        return (
            <div>
                <h1 className="px-4 text-2xl font-semibold">Notifications</h1>
                <NotificationSkeleton />;
            </div>
        );
    }

    if (!notifications.length) {
        return <div className="py-4 text-center">No notifications yet</div>;
    }
    return (
        <div>
            <div className="flex justify-between px-4 pb-2">
                <h1 className="text-2xl font-semibold">Notifications</h1>
                <button
                    className="icon-outlined text-2xl text-tribe-500 disabled:cursor-not-allowed disabled:text-neutral-700"
                    onClick={() => markAllAsRead()}
                    disabled={isMarkingAllRead || allRead}
                >
                    done_all
                </button>
            </div>
            <div className="flex flex-col">
                {notifications.map((n, i) => (
                    <NotificationItem
                        key={n.id}
                        notification={n}
                        className={i === 0 ? "rounded-t-[20px]" : ""}
                    />
                ))}
            </div>
        </div>
    );
}

export default Notifications;
