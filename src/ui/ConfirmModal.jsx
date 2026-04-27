import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    onAfterLeave,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "default",
}) {
    const variantStyles = {
        danger: "bg-red-500 hover:bg-red-600 text-white",
        default: "bg-black hover:bg-gray-800 text-white",
    };

    return (
        <Transition
            appear
            show={isOpen}
            as={Fragment}
            afterLeave={onAfterLeave}
        >
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* ✅ Lightweight overlay (no blur) */}
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
                    {/* ✅ Lightweight modal animation */}
                    <Transition.Child
                        as={Fragment}
                        enter="transition-all duration-150 ease-out"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition-all duration-100 ease-in"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                            <h2 className="text-lg font-semibold">{title}</h2>

                            <p className="mt-2 text-sm text-gray-600">
                                {description}
                            </p>

                            <div className="mt-6 flex justify-end gap-2">
                                <button
                                    onClick={onClose}
                                    className="rounded-lg border px-4 py-2 text-sm"
                                >
                                    {cancelText}
                                </button>

                                <button
                                    onClick={onConfirm}
                                    className={`rounded-lg px-4 py-2 text-sm ${
                                        variantStyles[variant] ||
                                        variantStyles.default
                                    }`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}

export default ConfirmModal;
