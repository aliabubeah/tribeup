import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "./profileSlice";
import { useParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { personalFeedAPI } from "../../services/posts";
import ProfileHeader from "./ProfileHeader";
import ProfilePosts from "./ProfilePosts";

function Profile() {
    const dispatch = useDispatch();
    const { accessToken } = useAuth();
    const { username } = useParams();
    console.log(username);
    const { account, isLoading, error } = useSelector((state) => state.profile);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ["personalPosts", username, accessToken],
            queryFn: ({ pageParam = 1 }) =>
                personalFeedAPI({
                    userName: username,
                    page: pageParam,
                    accessToken,
                }),

            initialPageParam: 1,

            getNextPageParam: (lastPage) => {
                if (lastPage.hasMore) {
                    return lastPage.page + 1;
                }
                return undefined;
            },

            enabled: !!username && !!accessToken,
        });

    const posts = data?.pages?.flatMap((page) => page.items ?? []) ?? [];

    useEffect(() => {
        if (!accessToken || !username) return;

        dispatch(fetchUserProfile({ accessToken, userName: username }));
    }, [accessToken, dispatch, username]);

    if (isLoading) return <div>loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!account) return null;

    return (
        <div className="flex flex-col gap-4 px-3 py-4">
            <ProfileHeader />
            <ProfilePosts
                posts={posts}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
            />
        </div>
    );
}

export default Profile;
