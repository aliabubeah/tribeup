import { getNotificationsAPI } from "../../services/notifications.js";
import { useAuth } from "../../contexts/AuthContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import NotificationItem from "./NotificationItem";

function Notifications() {
    const { accessToken } = useAuth();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
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

    const notifications =
        data?.pages?.flatMap((page) => page.notifications ?? []) ?? [];

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (status === "pending") {
        return <div>Loading notifications...</div>;
    }

    if (!notifications.length) {
        return <div className="py-4 text-center">No notifications yet</div>;
    }
    return (
        <div className="divide-y">
            <div className="flex justify-between px-4 pb-2">
                <h1 className="text-2xl font-semibold">Notifications</h1>
                <button className="icon-outlined text-2xl text-tribe-500">
                    done_all
                </button>
            </div>
            <div className="flex flex-col">
                {notifications.map((n) => (
                    <NotificationItem key={n.id} notification={n} />
                ))}
            </div>
        </div>
    );
}

export default Notifications;
