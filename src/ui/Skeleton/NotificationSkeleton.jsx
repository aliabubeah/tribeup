import Skeleton from "react-loading-skeleton";

function NotificationSkeleton({ length = 6 }) {
    return (
        <div>
            {Array.from({ length }).map((_, index) => (
                <div
                    key={index}
                    className={`flex items-start gap-4 bg-white px-5 py-4 ${index == 0 ? "rounded-t-[20px]" : ""}`}
                >
                    <Skeleton circle width={48} height={48} />

                    <div className="flex-1">
                        <Skeleton width={240} height={24} />

                        <div className="mt-2">
                            <Skeleton width="90%" height={16} />
                        </div>

                        <div className="mt-2">
                            <Skeleton width={120} height={14} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default NotificationSkeleton;
