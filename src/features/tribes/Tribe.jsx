import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { GetGroupAPI } from "../../services/groups";
import { GroupFeedAPI } from "../../services/posts";

import BackButton from "../../ui/Buttons/BackButton";
import TribeHeader from "./TribeHeader";
import TribePosts from "./TribePosts";
import HeaderSkeleton from "../../ui/Skeleton/HeaderSkeleton";
import PostCardSkeleton from "../../ui/Skeleton/PostCardSkeleton";

function Tribe() {
    const { tribeId } = useParams();
    const { accessToken } = useAuth();

    const {
        data: tribe,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["tribe", tribeId],
        queryFn: () => GetGroupAPI(accessToken, tribeId),
        // enabled: !!tribeId,
    });

    if (isLoading)
        return (
            <div className="flex flex-col gap-6">
                <HeaderSkeleton />
                <PostCardSkeleton />
            </div>
        );
    if (error) return <div>Error</div>;

    return (
        <div className="flex flex-col gap-1">
            <BackButton className="!p-0">Back</BackButton>
            <div className="flex flex-col gap-4">
                <TribeHeader tribe={tribe} />
                <TribePosts tribeId={tribeId} />
            </div>
        </div>
    );
}

export default Tribe;
