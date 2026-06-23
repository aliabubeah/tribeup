import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { leaderBoardAPI } from "../../services/leaderBoard";
import { getCleanImageUrl } from "../../services/http";
import BackButton from "../../ui/Buttons/BackButton";

function LeaderBoard() {
    const { accessToken } = useAuth();

    const { data, isPending, error } = useQuery({
        queryKey: ["leaderBoard", 100],
        queryFn: () => leaderBoardAPI(accessToken, 100),
        enabled: !!accessToken,
    });

    const leaders = Array.isArray(data) ? data : (data?.items ?? []);

    if (isPending) {
        return (
            <div>
                <h1 className="mb-4 px-2 text-2xl font-semibold">
                    Leader Board
                </h1>
                <div className="space-y-2">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-20 animate-pulse rounded-xl bg-white"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl bg-white p-6 text-center text-neutral-600">
                Could not load leaderboard
            </div>
        );
    }

    return (
        <div className="p-4">
            <BackButton
                className="mb-4 px-2 text-2xl font-semibold"
                name="LeaderBoard"
            />

            <div className="space-y-2 rounded-xl bg-white">
                {leaders.map((leader) => (
                    <Link
                        key={leader.groupId}
                        to={`/tribes/${leader.groupId}`}
                        className="grid grid-cols-[48px_52px_1fr_auto] items-center gap-3 rounded-xl p-3 shadow-sm transition-colors hover:bg-neutral-50"
                    >
                        <div className="flex h-10 w-11 items-center justify-center rounded-lg bg-neutral-950 font-bold text-white">
                            #{leader.rank}
                        </div>

                        <img
                            src={getCleanImageUrl(leader.groupProfilePicture)}
                            alt={leader.groupName}
                            className="h-12 w-12 rounded-lg object-cover"
                        />

                        <div className="min-w-0">
                            <p className="truncate text-lg font-bold">
                                {leader.groupName}
                            </p>
                            <p className="truncate text-sm text-neutral-500">
                                {leader.badgeName}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-right">
                            <div>
                                <p className="text-lg font-bold leading-none text-indigo-950">
                                    {leader.totalPoints}
                                </p>
                                <p className="text-xs text-neutral-600">
                                    Points
                                </p>
                            </div>
                            <span className="icon-outlined icon-filled text-2xl text-yellow-400">
                                bolt
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default LeaderBoard;
