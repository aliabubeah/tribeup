import { Dialog, Transition } from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { createInvitationAPI } from "../services/groups";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { getDateLabel } from "../utils/helper";

function CreateInviteModal({ isOpen, onClose, groupId, validInviations }) {
    const { accessToken } = useAuth();
    const queryClient = useQueryClient();

    const [date, setDate] = useState("");
    const [maxUse, setMaxUse] = useState("");

    const {
        data: createdInvite,
        isPending,
        mutate: createInvite,
    } = useMutation({
        mutationFn: createInvitationAPI,

        onSuccess: () => {
            queryClient.invalidateQueries(["tribeInvitations", groupId]);
        },

        onError: (err) => toast.error(err.message),
    });

    const invite = validInviations || createdInvite;

    function handleCreate() {
        createInvite({
            accessToken,
            groupId,
            maxUse: Number(maxUse),
            expireAt: new Date(date).toISOString(),
        });
    }

    function handleRevoke() {
        queryClient.invalidateQueries(["tribeInvitations", groupId]);
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Overlay */}
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity duration-150"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/40" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="transition-all duration-150 ease-out"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition-all duration-100 ease-in"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full rounded-xl bg-white p-6 shadow-xl md:w-[774px]">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    Invite members
                                </h2>
                                <button onClick={onClose}>✕</button>
                            </div>

                            {/* Inputs */}
                            <div className="mt-4 space-y-3">
                                <label className="text-sm">Expire at:</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full rounded-lg border p-2 text-sm"
                                    disabled={!!invite}
                                />

                                <label className="text-sm">Max uses:</label>
                                <input
                                    type="number"
                                    min={0}
                                    placeholder="maxuse"
                                    value={maxUse}
                                    onChange={(e) => setMaxUse(e.target.value)}
                                    className="w-full rounded-lg border p-2 text-sm"
                                    disabled={!!invite}
                                />
                            </div>

                            {/* Create */}
                            <button
                                onClick={handleCreate}
                                disabled={!!invite || isPending}
                                className={`mt-4 w-full rounded-lg py-2 text-sm text-white transition ${
                                    invite
                                        ? "cursor-not-allowed bg-gray-300"
                                        : "bg-tribe-600 hover:bg-tribe-700"
                                }`}
                            >
                                {isPending ? "Creating..." : "Create"}
                            </button>

                            {/* Active Invitation */}
                            <Transition
                                show={!!invite}
                                enter="transition-all duration-200"
                                enterFrom="opacity-0 max-h-0"
                                enterTo="opacity-100 max-h-96"
                                leave="transition-all duration-150"
                                leaveFrom="opacity-100 max-h-96"
                                leaveTo="opacity-0 max-h-0"
                            >
                                <div className="overflow-hidden">
                                    <div className="mt-6">
                                        <h3 className="mb-2 text-sm font-semibold">
                                            Active Invitation
                                        </h3>

                                        <div className="flex flex-col gap-3 rounded-lg border p-4 text-sm">
                                            <p className="truncate rounded-md bg-neutral-50 px-3 py-[6px] text-sm text-neutral-700">
                                                {invite?.invitationUrl}
                                            </p>

                                            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                                                <div className="flex gap-1">
                                                    <span className="icon-outlined text-2xl">
                                                        date_range
                                                    </span>

                                                    <div className="flex flex-col font-medium">
                                                        <p className="text-xs">
                                                            Created
                                                        </p>
                                                        <p className="text-sm font-semibold text-neutral-950">
                                                            {invite?.expiresAt
                                                                ? getDateLabel(
                                                                      invite.expiresAt,
                                                                  )
                                                                : "-"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-1">
                                                    <span className="icon-outlined text-2xl">
                                                        hourglass_bottom
                                                    </span>

                                                    <div className="flex flex-col font-medium">
                                                        <p className="text-xs">
                                                            Expires
                                                        </p>
                                                        <p className="text-sm font-semibold text-neutral-950">
                                                            {invite?.expiresAt
                                                                ? getDateLabel(
                                                                      invite.expiresAt,
                                                                  )
                                                                : "-"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                                                <div className="flex gap-1">
                                                    <span className="icon-outlined text-2xl">
                                                        group
                                                    </span>

                                                    <div className="flex flex-col font-medium">
                                                        <p className="text-xs">
                                                            Max Usage
                                                        </p>
                                                        <p className="text-sm font-semibold text-neutral-950">
                                                            {invite?.maxUses}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-1">
                                                    <span className="icon-outlined text-2xl">
                                                        date_range
                                                    </span>

                                                    <div className="flex flex-col font-medium">
                                                        <p className="text-xs">
                                                            Used Count
                                                        </p>
                                                        <p className="text-sm font-semibold text-neutral-950">
                                                            {invite?.usedCount}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex gap-2">
                                                <button
                                                    onClick={handleRevoke}
                                                    className="flex-1 rounded-lg border border-red-500 py-1 text-red-500"
                                                >
                                                    Revoke
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        navigator.clipboard.writeText(
                                                            invite?.invitationUrl ||
                                                                "",
                                                        )
                                                    }
                                                    className="flex-1 rounded-lg border py-1"
                                                >
                                                    Copy link
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Transition>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}

export default CreateInviteModal;
