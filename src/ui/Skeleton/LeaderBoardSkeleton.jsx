import { Link } from "react-router-dom";

export default function LeaderBoardSkeleton() {
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
                {Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={index}
                        className="grid animate-pulse grid-cols-[40px_40px_1fr_auto] items-center gap-2 rounded-lg bg-neutral-50 p-2"
                    >
                        <div className="h-8 w-9 rounded-md bg-neutral-200" />
                        <div className="h-8 w-8 rounded-md bg-neutral-200" />
                        <div className="space-y-2">
                            <div className="h-3 w-20 rounded bg-neutral-200" />
                            <div className="h-2 w-14 rounded bg-neutral-200" />
                        </div>
                        <div className="h-6 w-10 rounded bg-neutral-200" />
                    </div>
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
