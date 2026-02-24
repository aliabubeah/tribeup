import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function PostActionsMenu({
    onEdit,
    onDelete,
    icon = "more_horiz",
    remove = "post",
    size = "text-2xl",
}) {
    return (
        <Menu as="div" className="relative">
            {/* 3 dots button */}
            <Menu.Button className="rounded-full pr-2 outline-none transition-all duration-200 hover:scale-110">
                <span className={`icon-outlined ${size}`}>{icon}</span>
            </Menu.Button>

            {/* Dropdown */}
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-40 overflow-hidden rounded-lg bg-white shadow-lg focus:outline-none">
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                onClick={onEdit}
                                className={`${
                                    active ? "bg-neutral-100" : ""
                                } w-full px-4 py-2 text-left text-sm`}
                            >
                                Edit
                            </button>
                        )}
                    </Menu.Item>

                    <Menu.Item>
                        {({ active }) => (
                            <button
                                onClick={onDelete}
                                className={`${
                                    active ? "bg-red-50" : ""
                                } w-full px-4 py-2 text-left text-sm text-red-600`}
                            >
                                Delete {remove}
                            </button>
                        )}
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
