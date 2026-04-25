import { getNotificationsAPI } from "../../services/notifications.js";
import { useAuth } from "../../contexts/AuthContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

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
        <div>
            {notifications.map((notification) => (
                <p key={notification.id}>{notification.message}</p>
            ))}
        </div>
    );
}

export default Notifications;
