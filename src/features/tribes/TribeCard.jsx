import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCleanImageUrl } from "../../services/http";
import SecondaryButton from "../../ui/Buttons/SecondaryButton";
import { leaveAPI } from "../../services/groups";
import toast from "react-hot-toast";
import { useConfirm } from "../../contexts/ConfirmContext";
import { useAuth } from "../../contexts/AuthContext";

function TribeCard({ tribe }) {
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
        <div className="flex h-[100px] gap-4 rounded-xl bg-white shadow-sm">
            {/* Image */}
            <img
                src={getCleanImageUrl(tribe.groupProfilePicture)}
                className="h-full w-56 rounded-lg object-cover"
            />

            {/* Content */}
            <div className="flex flex-1 justify-between p-4">
                <div>
                    <h1 className="text-xl font-semibold">{tribe.groupName}</h1>
                    <p className="text-base">{tribe.description}</p>

                    <p className="mt-1 flex gap-1 text-sm">
                        <span className="icon-outlined">group</span>
                        {tribe.membersCount}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                    <SecondaryButton to={`/tribes/${tribe.id}`}>
                        View
                    </SecondaryButton>
                    <SecondaryButton
                        disabled={isLeaving}
                        className="!border-red-500 !text-red-500"
                        onClick={() => handleKick()}
                    >
                        Leave
                    </SecondaryButton>
                </div>
            </div>
        </div>
    );
}

export default TribeCard;
