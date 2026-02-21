import Skeleton from "react-loading-skeleton";

function PostCardSkeleton({ length = 3 }) {
    return Array.from({ length: length }).map((_, i) => (
        <div className="mb-3 rounded-2xl bg-white p-4 shadow-sm" key={i}>
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Skeleton circle width={40} height={40} />
                    <div className="space-y-2">
                        <Skeleton width={120} height={12} />
                        <Skeleton width={80} height={10} />
                    </div>
                </div>
            </div>

            {/* Media */}
            <div className="mb-4">
                <div>
                    <Skeleton height={250} className="rounded-xl" />
                </div>
            </div>

            {/* Caption */}
            <div className="mb-4 space-y-2">
                <Skeleton width="60%" height={12} />
                <Skeleton width="40%" height={12} />
            </div>

            {/* Actions */}
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Skeleton width={24} height={24} />
                    <Skeleton width={24} height={24} />
                </div>
                <Skeleton width={20} height={20} />
            </div>

            {/* Date */}
            <Skeleton width={100} height={10} />
        </div>
    ));
}

export default PostCardSkeleton;
