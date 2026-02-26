import { Dialog, Transition } from "@headlessui/react";
import { Tab } from "@headlessui/react";
import { Fragment } from "react";
import CreateStoryForm from "./CreateStoryForm";
import CreatePostForm from "./CreatePostForm";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function CreatePostModal({ isOpen, onClose }) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <div className="fixed inset-0 bg-black/40" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="flex max-h-screen w-[800px] flex-col gap-4 rounded-xl bg-white shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center border-b px-6 py-4">
                            <span
                                className="icon-outlined cursor-pointer"
                                onClick={onClose}
                            >
                                close
                            </span>
                            <h2 className="grow text-center text-xl font-semibold">
                                Create
                            </h2>
                        </div>

                        {/* Tabs */}
                        <Tab.Group className="flex flex-col gap-4 px-4 pb-8">
                            <Tab.List className="flex rounded-[14px] border-b bg-neutral-50 p-1">
                                {["Post", "Story"].map((tab) => (
                                    <Tab
                                        key={tab}
                                        className={({ selected }) =>
                                            classNames(
                                                "flex-1 rounded-[14px] py-2 text-sm font-medium",
                                                selected
                                                    ? "bg-white"
                                                    : "hover:bg-neutral-100",
                                            )
                                        }
                                    >
                                        {tab}
                                    </Tab>
                                ))}
                            </Tab.List>

                            <Tab.Panels>
                                <Tab.Panel>
                                    <CreatePostForm onClose={onClose} />
                                </Tab.Panel>

                                <Tab.Panel>
                                    <CreateStoryForm onClose={onClose} />
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </Transition>
    );
}

export default CreatePostModal;
