import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
} from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { leaveAPI, MyGroupsAPI } from "../../services/groups";
import TribeCard from "./TribeCard";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

function JoinedTribes() {
    const { accessToken } = useAuth();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending,
        error,
    } = useInfiniteQuery({
        queryKey: ["tribes", accessToken],

        queryFn: ({ pageParam = 1 }) => {
            return MyGroupsAPI({
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

    const tribes = data?.pages?.flatMap((page) => page.items ?? []) ?? [];

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isPending) return <p>loading...</p>;
    if (isFetchingNextPage) return <p>loading...</p>;

    if (error) return <p>{error.message}</p>;

    return (
        <div className="space-y-3">
            {tribes.map((tribe) => (
                <TribeCard key={tribe.id} tribe={tribe} />
            ))}

            {isFetchingNextPage && <p>Loading more...</p>}

            <div ref={ref} />
        </div>
    );
}

export default JoinedTribes;
