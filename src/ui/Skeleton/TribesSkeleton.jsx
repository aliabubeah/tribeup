import Skeleton from "react-loading-skeleton";

function TribesSkeleton({ length = 5 }) {
    return (
        <>
            {Array.from({ length }).map((_, index) => (
                <div
                    key={index}
                    className="mb-4 flex items-center gap-6 rounded-2xl bg-white"
                >
                    <Skeleton
                        className="shrink-0"
                        width={220}
                        height={120}
                        borderRadius={12}
                    />

                    <div className="flex flex-1 flex-col">
                        <Skeleton width={140} height={20} />

                        <div className="mt-3">
                            <Skeleton width={220} height={18} />
                        </div>

                        <div className="mt-3">
                            <Skeleton width={25} height={14} />
                        </div>
                    </div>

                    <div className="mr-3 flex flex-col gap-3">
                        <Skeleton width={78} height={34} borderRadius={8} />
                        <Skeleton width={78} height={34} borderRadius={8} />
                    </div>
                </div>
            ))}
        </>
    );
}

export default TribesSkeleton;
