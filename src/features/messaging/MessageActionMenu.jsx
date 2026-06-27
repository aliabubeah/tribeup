import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

function MessageActionMenu({ onEdit, onDelete }) {
    return (
        <Menu as="div" className="relative">
            <MenuButton className="rounded-full p-1 text-neutral-500 transition hover:bg-neutral-200">
                <span className="icon-outlined text-lg">more_vert</span>
            </MenuButton>

            <MenuItems
                anchor="bottom end"
                className="z-50 w-40 rounded-xl border border-neutral-200 bg-white p-1 shadow-lg focus:outline-none"
            >
                <MenuItem>
                    {({ focus }) => (
                        <button
                            onClick={onEdit}
                            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                                focus ? "bg-neutral-100" : ""
                            }`}
                        >
                            <span className="icon-outlined text-lg">edit</span>
                            Edit
                        </button>
                    )}
                </MenuItem>

                <MenuItem>
                    {({ focus }) => (
                        <button
                            onClick={onDelete}
                            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 ${
                                focus ? "bg-red-50" : ""
                            }`}
                        >
                            <span className="icon-outlined text-lg">
                                delete
                            </span>
                            Delete
                        </button>
                    )}
                </MenuItem>
            </MenuItems>
        </Menu>
    );
}

export default MessageActionMenu;
