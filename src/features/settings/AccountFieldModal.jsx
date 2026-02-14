import { Dialog, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import MainButton from "../../ui/Buttons/MainButton";
import SecondaryButton from "../../ui/Buttons/SecondaryButton";

function AccountFieldModal({ field, isOpen, onClose }) {
    if (!field) return null;

    function renderFields() {
        switch (field.type) {
            case "fullName":
                return (
                    <>
                        <input placeholder="First name" className="input" />
                        <input placeholder="Last name" className="input" />
                    </>
                );

            case "phone":
                return <input placeholder="Phone number" className="input" />;

            case "bio":
                return <textarea placeholder="Bio" className="input" />;

            case "password":
                return (
                    <>
                        <input
                            type="password"
                            placeholder="Current password"
                            className="input"
                        />
                        <input
                            type="password"
                            placeholder="New password"
                            className="input"
                        />
                        <input
                            type="password"
                            placeholder="Confirm password"
                            className="input"
                        />
                    </>
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
                            <MainButton className="grow !py-3">
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
