import { Dialog, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useState } from "react";
import MainButton from "../../ui/Buttons/MainButton";
import SecondaryButton from "../../ui/Buttons/SecondaryButton";
import { useDispatch, useSelector } from "react-redux";
import {
    udpateFullName,
    updateBio,
    updatePassword,
    updatePhoneNumber,
} from "./settingsSlice";
import { useAuth } from "../../contexts/AuthContext";

function AccountFieldModal({ field, isOpen, onClose }) {
    const { account } = useSelector((state) => state.settings);
    const { accessToken } = useAuth();
    const dispatch = useDispatch();
    const { firstName, lastName, bio, phoneNumber } = account;

    const [form, setForm] = useState({
        firstName: firstName || "",
        lastName: lastName || "",
        phoneNumber: phoneNumber || "",
        bio: bio || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    async function handleCall() {
        switch (field.type) {
            case "fullName":
                await dispatch(
                    udpateFullName({
                        accessToken,
                        firstName: form.firstName,
                        lastName: form.lastName,
                    }),
                ).unwrap();
                break;
            case "bio":
                await dispatch(
                    updateBio({
                        accessToken,
                        bio: form.bio,
                    }),
                ).unwrap();
                break;
            case "phone":
                await dispatch(
                    updatePhoneNumber({
                        accessToken,
                        phoneNumber: form.phoneNumber,
                    }),
                ).unwrap();
                break;

            case "password":
                await dispatch(
                    updatePassword({
                        accessToken,
                        currentPassword: form.currentPassword,
                        newPassword: form.newPassword,
                        confirmPassword: form.confirmPassword,
                    }),
                ).unwrap();
                break;
        }
        onClose();
    }

    if (!field) return null;
    function renderFields() {
        switch (field.type) {
            case "fullName":
                return (
                    <div className="flex flex-col gap-2">
                        <input
                            placeholder="First name"
                            className="input"
                            defaultValue={form.firstName}
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
                            defaultValue={form.lastName}
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
                        defaultValue={form.phoneNumber}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                phoneNumber: e.target.value,
                            }))
                        }
                    />
                );

            case "bio":
                return (
                    <textarea
                        placeholder="Bio"
                        className="input"
                        defaultValue={form.bio}
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
                    <div className="flex flex-col gap-2">
                        <input
                            type="password"
                            placeholder="Current password"
                            className="input"
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
            <Dialog
                as="div"
                className="duration- relative z-50"
                onClose={onClose}
            >
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
                                onClick={(e) => onClose()}
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
                                onClick={handleCall}
                            >
                                Update
                            </MainButton>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </Transition>
    );
}

export default AccountFieldModal;
