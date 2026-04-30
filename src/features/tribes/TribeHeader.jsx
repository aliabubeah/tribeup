import { Description } from "@headlessui/react";
import { getCleanImageUrl } from "../../services/http";
import SecondaryButton from "../../ui/Buttons/SecondaryButton";
import HeaderSkeleton from "../../ui/Skeleton/HeaderSkeleton";
import CreatePost from "../../ui/CreatePost/CreatePost";
import { toggleFollowAPI, tribeInvitationsAPI } from "../../services/groups";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import MainButton from "../../ui/Buttons/MainButton";
import CreateInviteModal from "../../ui/CreateInviteModal";
import { useState } from "react";

function TribeHeader({ tribe }) {
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const { accessToken } = useAuth();
    const navigate = useNavigate();

    const {
        id,
        groupProfilePicture,
        groupName,
        description,
        membersCount,
        groupRelationType,
    } = tribe;
    const tribeId = id;

    const { data, error, isPending, refetch } = useQuery({
        queryKey: ["tribeInvitations", id],
        queryFn: () => tribeInvitationsAPI({ accessToken, groupId: id }),
        enabled: false,
    });

    let validInviations;

    if (data?.id) {
        validInviations = data ?? null;
    }
    // const validInviations = data ?? null;

    const queryClient = useQueryClient();

    const { isPending: isFollowing, mutate: follow } = useMutation({
        mutationFn: toggleFollowAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tribe", tribeId],
            });
        },
        onError: (err) => toast.error(err.message),
    });

    const canManage =
        groupRelationType === "Owner" || groupRelationType === "Admin";

    const isFollower = groupRelationType === "Follower";

    const isMember = groupRelationType === "Member";

    const MemberOrAbove =
        groupRelationType !== "Follower" && groupRelationType !== "None";

    return (
        <>
            <div className="flex flex-col gap-[5px]">
                <div className="flex flex-col rounded-lg rounded-b-none bg-white">
                    <div className="relative rounded-t-lg bg-neutral-200">
                        <div className="relative">
                            <img
                                src={getCleanImageUrl(groupProfilePicture)}
                                className="h-44 w-full rounded-t-lg object-cover"
                            />
                            {canManage && (
                                <button
                                    className="icon-outlined absolute right-4 top-2 rounded-lg bg-black bg-opacity-50 px-3 py-2 text-lg text-neutral-50 transition-all duration-100 ease-in-out hover:bg-opacity-30"
                                    onClick={() => navigate("settings")}
                                >
                                    settings
                                </button>
                            )}
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
                                    <MainButton
                                        className="text-base font-medium"
                                        onClick={async () => {
                                            await refetch();
                                            setIsInviteOpen(true);
                                        }}
                                    >
                                        +Invite
                                    </MainButton>
                                )}

                                {isMember && (
                                    <SecondaryButton className="px-6 py-4">
                                        Joined
                                    </SecondaryButton>
                                )}
                                {!MemberOrAbove && (
                                    <SecondaryButton
                                        disabled={isFollowing}
                                        className="px-6 py-4"
                                        onClick={() =>
                                            follow({
                                                accessToken,
                                                groupId: tribeId,
                                            })
                                        }
                                    >
                                        {isFollower ? "Following" : "Follow"}
                                    </SecondaryButton>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <CreatePost className="!m-0 !rounded-t-none" id={tribe.id} />
            </div>
            <CreateInviteModal
                isOpen={isInviteOpen}
                onClose={() => setIsInviteOpen(false)}
                groupId={tribe.id}
                validInviations={validInviations}
            />
        </>
    );
}

export default TribeHeader;
