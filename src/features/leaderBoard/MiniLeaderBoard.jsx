import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { leaderBoardAPI } from "../../services/leaderBoard";
import { getCleanImageUrl } from "../../services/http";
import LeaderBoardSkeleton from "../../ui/Skeleton/LeaderBoardSkeleton";

function MiniLeaderBoard() {
    const { accessToken } = useAuth();

    const { data, isPending, error } = useQuery({
        queryKey: ["leaderBoard", 5],
        queryFn: () => leaderBoardAPI(accessToken, 5),
        enabled: !!accessToken,
    });

    const leaders = Array.isArray(data) ? data : (data?.items ?? []);

    if (isPending) return <LeaderBoardSkeleton />;

    if (!isPending && error) {
        return (
            <p className="rounded-lg bg-neutral-50 px-3 py-4 text-center text-sm text-neutral-600">
                Could not load leaders
            </p>
        );
    }

    if (!isPending && !error && leaders.length === 0) {
        return (
            <p className="rounded-lg bg-neutral-50 px-3 py-4 text-center text-sm text-neutral-600">
                No leaders yet
            </p>
        );
    }

    return (
        <section className="w-[350px] rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-neutral-950">
                    Leader Board
                </h2>

                <span className="icon-outlined text-xl text-tribe-500">
                    leaderboard
                </span>
            </div>

            <div className="space-y-2">
                {leaders.map((leader) => (
                    <LeaderBoardRow key={leader.groupId} leader={leader} />
                ))}
            </div>

            <Link
                to="/leaderboard"
                className="mt-4 block rounded-lg border border-neutral-200 py-2 text-center text-sm font-medium transition-colors hover:bg-neutral-50"
            >
                See all
            </Link>
        </section>
    );
}

function LeaderBoardRow({ leader }) {
    return (
        <div className="grid grid-cols-[40px_40px_1fr_auto] items-center gap-2 rounded-lg bg-neutral-50 p-2 transition-colors hover:bg-neutral-100">
            <div className="flex h-8 w-9 items-center justify-center rounded-md bg-neutral-950 text-base font-bold text-white">
                #{leader.rank}
            </div>

            <img
                src={getCleanImageUrl(leader.groupProfilePicture)}
                alt={leader.groupName}
                className="h-8 w-9 rounded-md object-cover"
            />

            <div className="min-w-0">
                <p className="truncate text-sm font-bold text-neutral-950">
                    {leader.groupName}
                </p>
                <p className="truncate text-[11px] text-neutral-500">
                    {leader.badgeName}
                </p>
            </div>

            <div className="flex items-center gap-1 text-right">
                <div>
                    <p className="text-base font-bold leading-none text-indigo-950">
                        {leader.totalPoints}
                    </p>
                    <p className="text-[11px] leading-tight text-neutral-600">
                        Points
                    </p>
                </div>
                <span className="icon-outlined icon-filled text-lg text-yellow-400">
                    bolt
                </span>
            </div>
        </div>
    );
}

export default MiniLeaderBoard;
