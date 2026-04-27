import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getFollowersAPI } from "../../services/groups";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { useConfirm } from "../../contexts/ConfirmContext";
import { getCleanImageUrl } from "../../services/http";

function Followers() {
    const { accessToken } = useAuth();
    const { tribeId } = useParams();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
        useInfiniteQuery({
            queryKey: ["followers", tribeId],

            queryFn: ({ pageParam = 1 }) => {
                return getFollowersAPI({
                    accessToken,
                    groupId: tribeId,
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
    console.log(data);
    const followers = data?.pages?.flatMap((page) => page.items ?? []) ?? [];

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isPending) {
        return <div>Loading followers...</div>;
    }

    if (!followers?.length) {
        return <div className="py-4 text-center">No followers yet</div>;
    }
    return (
        <div>
            {followers.map((follower) => (
                <Follower key={follower.userId} follower={follower} />
            ))}
            <div ref={ref} />
        </div>
    );
}

export default Followers;

function Follower({ follower }) {
    return (
        <div className="flex justify-between">
            {/* Left */}
            <div className="flex gap-2">
                <img
                    src={getCleanImageUrl(follower.profilePictureUrl)}
                    className="h-9 w-9 rounded-full"
                />

                <div className="flex flex-col text-start">
                    <div className="flex gap-2">
                        <h1 className="font-semibold">{follower.userName}</h1>
                    </div>

                    <p className="text-sm text-neutral-700">
                        @{follower.userName}
                    </p>
                </div>
            </div>
        </div>
    );
}
