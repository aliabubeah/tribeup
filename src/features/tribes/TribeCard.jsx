import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCleanImageUrl } from "../../services/http";
import SecondaryButton from "../../ui/Buttons/SecondaryButton";
import { leaveAPI, toggleFollowAPI } from "../../services/groups";
import toast from "react-hot-toast";
import { useConfirm } from "../../contexts/ConfirmContext";
import { useAuth } from "../../contexts/AuthContext";
import MainButton from "../../ui/Buttons/MainButton";
import { useNavigate } from "react-router-dom";

function TribeCard({ tribe, debouncedSearch }) {
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const queryClient = useQueryClient();

    const { isPending: isLeaving, mutate: leave } = useMutation({
        mutationFn: leaveAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tribes"],
            });
        },
        onError: (err) => toast.error(err.message),
    });

    const { isPending: isFollowing, mutate: follow } = useMutation({
        mutationFn: toggleFollowAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["discoverTribes", accessToken, debouncedSearch],
            });
        },
        onError: (err) => toast.error(err.message),
    });

    const { id } = tribe;
    const confirm = useConfirm();

    const handleKick = async () => {
        const ok = await confirm({ type: "leave" });
        if (!ok) return;

        leave({
            accessToken,
            tribeId: id,
        });
    };

    return (
        <div
            className="flex rounded-xl bg-white shadow-sm transition-all duration-300 ease-in-out hover:bg-neutral-50 md:h-[100px] md:gap-4"
            role="button"
            onClick={() => navigate(`/tribes/${tribe.id}`)}
        >
            {/* Image */}
            <img
                src={getCleanImageUrl(tribe.groupProfilePicture)}
                className="h-40 w-56 rounded-lg object-cover md:h-full"
            />

            {/* Content */}
            <div className="flex flex-1 flex-col gap-3 p-4 md:flex-row md:justify-between md:gap-0">
                <div className="flex flex-col">
                    <h1 className="text-xl font-semibold">{tribe.groupName}</h1>
                    <p className="mt-1 flex gap-1 text-sm md:order-3">
                        <span className="icon-outlined">group</span>
                        {tribe.membersCount}
                    </p>
                    <p className="text-base">{tribe.description}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 md:flex-col">
                    <SecondaryButton className="w-full md:grow-0">
                        view
                    </SecondaryButton>
                    {tribe.userRelation === 0 ? (
                        <MainButton
                            disabled={isFollowing}
                            className="w-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                follow({ accessToken, groupId: id });
                            }}
                        >
                            follow
                        </MainButton>
                    ) : tribe.userRelation === 1 ? (
                        <MainButton
                            disabled={isFollowing}
                            className="w-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                follow({ accessToken, groupId: id });
                            }}
                        >
                            Unfollow
                        </MainButton>
                    ) : (
                        <SecondaryButton
                            disabled={isLeaving}
                            className="w-full !border-red-500 !text-red-500 md:grow-0"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleKick();
                            }}
                        >
                            Leave
                        </SecondaryButton>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TribeCard;
