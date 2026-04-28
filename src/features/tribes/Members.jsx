import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import {
    groupMembersAPI,
    promoteAdminAPI,
    demoteAdminAPI,
    kickAPI,
    GetGroupAPI,
} from "../../services/groups";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useConfirm } from "../../contexts/ConfirmContext";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { getCleanImageUrl } from "../../services/http";
import SecondaryButton from "../../ui/Buttons/SecondaryButton";
import toast from "react-hot-toast";

function Members() {
    const { tribeId } = useParams();
    const { accessToken, user } = useAuth();

    const { data: tribeData } = useQuery({
        queryKey: ["tribe", tribeId],
        queryFn: () => GetGroupAPI(accessToken, tribeId),
        // enabled: !!tribeId,
    });

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
        useInfiniteQuery({
            queryKey: ["members", tribeId],

            queryFn: ({ pageParam = 1 }) => {
                return groupMembersAPI({
                    accessToken,
                    tribeId,
                    page: pageParam,
                });
            },

            initialPageParam: 1,

            getNextPageParam: (lastPage) => {
                if (lastPage.hasMore) {
                    return lastPage.page + 1;
                }
                return undefined;
            },

            enabled: !!accessToken,
        });

    const { inView } = useInView({
        threshold: 0.5,
    });

    const members = data?.pages?.flatMap((page) => page.items ?? []) ?? [];

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isPending) {
        return <div>Loading members...</div>;
    }

    if (!members?.length) {
        return <div className="py-4 text-center">No members yet</div>;
    }
    return (
        <div className="flex flex-col gap-[10px] bg-white px-3 py-4">
            {members.map((member) => (
                <Member
                    member={member}
                    key={member.id}
                    tribeId={tribeId}
                    userRole={tribeData.groupRelationType}
                    currentUserId={user.id}
                />
            ))}
        </div>
    );
}

export default Members;

function Member({ member, tribeId, userRole, currentUserId }) {
    const queryClient = useQueryClient();
    const { accessToken } = useAuth();

    const { isPending, mutate: changeRole } = useMutation({
        mutationFn: async ({ action, ...payload }) => {
            return action === "promote"
                ? promoteAdminAPI(payload)
                : demoteAdminAPI(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["members", tribeId],
            });
        },
        onError: (err) => toast.error(err.message),
    });

    const { isPending: isKicking, mutate: kick } = useMutation({
        mutationFn: kickAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["members", tribeId],
            });
        },
        onError: (err) => toast.error(err.message),
    });

    const role = member.role;

    const color =
        role === "Owner"
            ? "text-white bg-black"
            : role === "Member"
              ? "bg-neutral-200 text-neutral-800"
              : "bg-neutral-500 text-neutral-100";

    const isOwner = userRole === "Owner";
    const isAdmin = userRole === "Admin";

    const isSelf = member.userId === currentUserId;

    const isMember = role === "Member";
    const isAdminMember = role === "Admin";
    const isOwnerMember = role === "Owner";

    // ✅ permissions
    const canManage =
        // Owner → everyone except himself
        (isOwner && !isSelf) ||
        // Admin → only members
        (isAdmin && isMember);

    const tribeMemberId = member.id;

    const confirm = useConfirm();

    const handleKick = async () => {
        const ok = await confirm({ type: "kick" });
        if (!ok) return;

        kick({
            accessToken,
            tribeId,
            tribeMemberId,
        });
    };

    if (!userRole) return <p>loading....</p>;

    return (
        <div className="flex justify-between">
            {/* Left */}
            <div className="flex gap-2">
                <img
                    src={getCleanImageUrl(member.userProfilePicture)}
                    className="h-9 w-9 rounded-full"
                />

                <div className="flex flex-col text-start">
                    <div className="flex gap-2">
                        <h1 className="font-semibold">{member.userName}</h1>

                        <span
                            className={`${color} rounded-lg px-2 py-1 text-xs`}
                        >
                            {role}
                        </span>
                    </div>

                    <p className="text-sm text-neutral-700">
                        @{member.userName}
                    </p>
                </div>
            </div>

            {/* Right */}
            {canManage && (
                <div>
                    <SecondaryButton
                        disabled={isPending}
                        onClick={() =>
                            changeRole({
                                action:
                                    role === "Member" ? "promote" : "demote",
                                accessToken,
                                tribeId,
                                tribeMemberId,
                            })
                        }
                    >
                        {role === "Member" ? "Promote" : "Demote"}
                    </SecondaryButton>

                    <SecondaryButton
                        disabled={isKicking}
                        className="ml-2 !border-red-500 !text-red-500"
                        onClick={() => handleKick()}
                    >
                        Kick
                    </SecondaryButton>
                </div>
            )}
        </div>
    );
}
