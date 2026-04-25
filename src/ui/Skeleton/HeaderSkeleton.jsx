import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function HeaderSkeleton({ isProfile = false }) {
    return (
        <div className="mb-3 overflow-hidden rounded-2xl bg-white shadow-sm">
            {/* Cover */}
            <Skeleton height={160} />

            <div className="relative p-4">
                {/* Avatar */}
                {isProfile && (
                    <div className="absolute -top-8 left-4">
                        <Skeleton circle width={64} height={64} />
                    </div>
                )}

                {/* Title */}
                <div className={`mb-2 ${isProfile ? "mt-5" : ""}`}>
                    <Skeleton width={160} height={16} />
                </div>

                {/* Description */}
                <div className="mb-3">
                    <Skeleton width={260} height={12} />
                </div>

                {/* Members */}
                <div className="mb-3 flex items-center gap-3">
                    <Skeleton width={80} height={12} />
                </div>

                {/* Button */}
                <div className="absolute bottom-4 right-4">
                    <Skeleton width={80} height={32} borderRadius={8} />
                </div>
            </div>
        </div>
    );
}

export default HeaderSkeleton;
