import { getNotificationsAPI } from "../../services/notifications.js";
import { useAuth } from "../../contexts/AuthContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import NotificationItem from "./NotificationItem";
import NotificationSkeleton from "../../ui/Skeleton/NotificationSkeleton.jsx";

function Notifications() {
    const { accessToken } = useAuth();

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

    const notifications =
        data?.pages?.flatMap((page) => page.notifications ?? []) ?? [];

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
                <button className="icon-outlined text-2xl text-tribe-500">
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
