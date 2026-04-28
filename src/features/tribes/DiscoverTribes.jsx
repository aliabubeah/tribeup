import { useInfiniteQuery } from "@tanstack/react-query";
import TribeCard from "./TribeCard";
import { useAuth } from "../../contexts/AuthContext";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { discoverGroupsAPI } from "../../services/groups";
import { useOutletContext } from "react-router-dom";

function useDebounce(value, delay = 400) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);

    return debounced;
}

function DiscoverTribes() {
    const { search } = useOutletContext();
    const { accessToken } = useAuth();

    const debouncedSearch = useDebounce(search);

    const isTyping = search !== debouncedSearch;

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending,
        error,
        isFetching,
    } = useInfiniteQuery({
        queryKey: ["discoverTribes", accessToken, debouncedSearch],

        queryFn: ({ pageParam = 1 }) => {
            return discoverGroupsAPI({
                accessToken,
                page: pageParam,
                search: debouncedSearch,
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
        placeholderData: (prev) => prev,
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

    const isLoadingSearch =
        isPending || isTyping || (isFetching && !isFetchingNextPage);

    if (isLoadingSearch && tribes.length === 0) return <p>loading tribes...</p>;
    if (error) return <p>{error.message}</p>;

    if (!isLoadingSearch && tribes.length === 0) {
        return <p>No tribes found </p>;
    }

    if (isPending) return <p>loading...</p>;

    return (
        <div className="">
            <div className="flex flex-col gap-3">
                {tribes.map((tribe) => (
                    <TribeCard
                        key={tribe.id}
                        tribe={tribe}
                        debouncedSearch={debouncedSearch}
                    />
                ))}
            </div>

            {isFetchingNextPage && <p>Loading more...</p>}

            <div ref={ref} />
        </div>
    );
}

export default DiscoverTribes;
