import Skeleton from "react-loading-skeleton";

function CommentSkeleton({ length = 5 }) {
    return Array.from({ length: length }).map((_, index) => (
        <div className="flex items-start gap-3 p-2" key={index}>
            <div className="flex grow gap-3">
                <Skeleton circle width={36} height={36} />

                <div className="space-y-2 text-start">
                    <Skeleton width={100} height={12} />
                    <Skeleton width={180} height={12} />
                    <Skeleton width={140} height={12} />
                </div>
            </div>

            <div className="flex flex-col items-center gap-2">
                <Skeleton width={16} height={16} />
                <Skeleton width={20} height={12} />
            </div>
        </div>
    ));
}

export default CommentSkeleton;
