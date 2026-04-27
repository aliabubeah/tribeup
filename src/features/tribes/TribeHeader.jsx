import { Description } from "@headlessui/react";
import { getCleanImageUrl } from "../../services/http";
import SecondaryButton from "../../ui/Buttons/SecondaryButton";
import HeaderSkeleton from "../../ui/Skeleton/HeaderSkeleton";
import CreatePost from "../../ui/CreatePost/CreatePost";

function TribeHeader({ tribe }) {
    const {
        groupProfilePicture,
        groupName,
        description,
        membersCount,
        groupRelationType,
    } = tribe;

    const canManage =
        groupRelationType === "Owner" || groupRelationType === "Admin";

    const isFollower = groupRelationType === "Follower";

    const MemberOrAbove =
        groupRelationType !== "Follower" && groupRelationType !== "None";

    return (
        <div className="flex flex-col gap-[5px]">
            <div className="flex flex-col rounded-lg rounded-b-none bg-white">
                <div className="relative rounded-t-lg bg-neutral-200">
                    <div>
                        <img
                            src={getCleanImageUrl(groupProfilePicture)}
                            className="h-44 w-full rounded-t-lg object-cover"
                        />
                    </div>
                </div>

                <div className="relative flex flex-col gap-4 p-4">
                    <div>
                        <h1 className="font-semibold">{groupName}</h1>
                        <p className="mt-2 text-sm font-normal">
                            {description}
                        </p>
                    </div>

                    <div className="flex items-center justify-between border-t pt-2">
                        <div className="flex gap-6">
                            <p className="text-neutral-700">
                                <span className="mr-1 font-bold text-neutral-950">
                                    {membersCount}
                                </span>{" "}
                                Members
                            </p>
                        </div>

                        <div className="flex gap-1">
                            {canManage && (
                                <SecondaryButton
                                    to={"settings"}
                                    className="px-6 py-4"
                                >
                                    Settings
                                </SecondaryButton>
                            )}
                            {!MemberOrAbove && (
                                <SecondaryButton className="px-6 py-4">
                                    {isFollower ? "Following" : "Follow"}
                                </SecondaryButton>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <CreatePost className="!m-0 !rounded-t-none" id={tribe.id} />
        </div>
    );
}

export default TribeHeader;
