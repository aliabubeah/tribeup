import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import useUpdateName from "./hooks/useUpdateName";
import useUpdateBio from "./hooks/useUpdateBio";
import useUpdatePhone from "./hooks/useUpdatePhone";
import useUpdatePassword from "./hooks/useUpdatePassword";

import MainButton from "../../ui/Buttons/MainButton";

function AccountFieldModal({ field, isOpen, onClose, account }) {
    const updateNameMutation = useUpdateName();
    const updateBioMutation = useUpdateBio();
    const updatePhoneMutation = useUpdatePhone();
    const updatePasswordMutation = useUpdatePassword();

    const [form, setForm] = useState({
        firstName: account?.firstName || "",
        lastName: account?.lastName || "",
        phoneNumber: account?.phoneNumber || "",
        bio: account?.bio || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    async function handleCall() {
        try {
            switch (field.type) {
                case "fullName":
                    await updateNameMutation.mutateAsync({
                        firstName: form.firstName,
                        lastName: form.lastName,
                    });
                    break;

                case "bio":
                    await updateBioMutation.mutateAsync(form.bio);
                    break;

                case "phone":
                    await updatePhoneMutation.mutateAsync(form.phoneNumber);
                    break;

                case "password":
                    await updatePasswordMutation.mutateAsync({
                        currentPassword: form.currentPassword,

                        newPassword: form.newPassword,

                        confirmPassword: form.confirmPassword,
                    });

                    setForm((prev) => ({
                        ...prev,
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                    }));
                    break;

                default:
                    return;
            }

            onClose();
        } catch (error) {
            console.error(error);
        }
    }

    if (!field) return null;

    function renderFields() {
        switch (field.type) {
            case "fullName":
                return (
                    <div className="flex flex-col gap-3">
                        <input
                            placeholder="First name"
                            className="input"
                            value={form.firstName}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    firstName: e.target.value,
                                }))
                            }
                        />

                        <input
                            placeholder="Last name"
                            className="input"
                            value={form.lastName}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    lastName: e.target.value,
                                }))
                            }
                        />
                    </div>
                );

            case "phone":
                return (
                    <input
                        placeholder="Phone number"
                        className="input"
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={form.phoneNumber}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                phoneNumber: e.target.value.replace(/\D/g, ""),
                            }))
                        }
                    />
                );

            case "bio":
                return (
                    <textarea
                        placeholder="Bio"
                        className="input"
                        value={form.bio}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                bio: e.target.value,
                            }))
                        }
                    />
                );

            case "password":
                return (
                    <div className="flex flex-col gap-3">
                        <input
                            type="password"
                            placeholder="Current password"
                            className="input"
                            value={form.currentPassword}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    currentPassword: e.target.value,
                                }))
                            }
                        />

                        <input
                            type="password"
                            placeholder="New password"
                            className="input"
                            value={form.newPassword}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    newPassword: e.target.value,
                                }))
                            }
                        />

                        <input
                            type="password"
                            placeholder="Confirm password"
                            className="input"
                            value={form.confirmPassword}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    confirmPassword: e.target.value,
                                }))
                            }
                        />
                    </div>
                );

            default:
                return null;
        }
    }

    const isChanged = (() => {
        switch (field?.type) {
            case "bio":
                return form.bio !== (account?.bio || "");

            case "phone":
                return form.phoneNumber !== (account?.phoneNumber || "");

            default:
                return true;
        }
    })();

    const isSubmitting =
        updateNameMutation.isPending ||
        updateBioMutation.isPending ||
        updatePhoneMutation.isPending ||
        updatePasswordMutation.isPending;

    return (
        <Transition
            appear
            show={isOpen}
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <div className="fixed inset-0 bg-black/25" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="flex w-full max-w-md flex-col gap-6 rounded-lg bg-white p-6 shadow-2xl">
                        <Dialog.Title className="flex items-center justify-between text-lg font-semibold">
                            <div>
                                <h1 className="text-2xl">{field.modalTitle}</h1>

                                <p className="text-sm font-medium text-neutral-700">
                                    {field.modalDesc}
                                </p>
                            </div>

                            <span
                                className="icon-outlined cursor-pointer"
                                onClick={onClose}
                            >
                                close
                            </span>
                        </Dialog.Title>

                        <div className="flex flex-col gap-6">
                            {renderFields()}
                        </div>

                        <div className="flex justify-end gap-2">
                            <MainButton
                                className="grow !py-3"
                                disabled={isSubmitting || !isChanged}
                                onClick={handleCall}
                            >
                                {isSubmitting ? "Updating..." : "Update"}
                            </MainButton>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </Transition>
    );
}

export default AccountFieldModal;
