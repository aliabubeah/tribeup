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
    // function getRanktext(rank) {
    //     switch (rank) {
    //         case 1:
    //             return "text-yellow-300";
    //         case 2:
    //             return "text-neutral-200";
    //         case 3:
    //             return "text-orange-300";
    //         default:
    //             return "text-white";
    //     }
    // }

    // function getRankBg(rank) {
    //     switch (rank) {
    //         case 1:
    //             return "bg-yellow-300 rounded-t-lg";
    //         case 2:
    //             return "bg-neutral-200";
    //         case 3:
    //             return "bg-orange-300";
    //         default:
    //             return "bg-white";
    //     }
    // }

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
        <div className="px-4 py-8">
            <BackButton
                className="mb-4 px-2 text-2xl font-semibold"
                name="LeaderBoard"
            />
            {/* black section  */}
            <div className="mb-4 flex items-center justify-between rounded-lg bg-neutral-900 p-6 text-neutral-50">
                <div>
                    <h1 className="text-5xl font-bold">{leaders.length}</h1>
                    <p>competing Tribes</p>
                </div>
                <span className="icon-outlined rounded-full bg-neutral-500 px-2 py-1 text-3xl">
                    moving
                </span>
            </div>

            <div className="rounded-xl bg-white p-6">
                {leaders.map((leader) => (
                    <div
                        key={leader.groupId}
                        className={`grid grid-cols-[48px_52px_1fr_auto] items-center gap-3 p-3 shadow-sm transition-all duration-300 ease-in-out`}
                    >
                        <div
                            key={leader.groupId}
                            className={`grid grid-cols-[48px_52px_1fr_auto] items-center gap-3 rounded-xl bg-neutral-900 p-3 text-xl font-bold transition-colors text-neutral-50`}
                        >
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
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LeaderBoard;
