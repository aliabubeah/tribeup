import { NavLink } from "react-router-dom";
import { Button } from "@headlessui/react";
import { MyGroupsAPI } from "../../services/groups";
import MainButton from "../../ui/Buttons/MainButton";

import { Outlet } from "react-router-dom";
import TribesTabs from "./TribesTabs";

function Tribes() {
    return (
        <div className="flex flex-col gap-3 p-5 pr-20">
            {/* Header */}
            <div className="rounded-xl bg-white p-4 shadow-sm">
                <h1 className="mb-3 text-lg font-semibold">My tribes</h1>

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search tribes..."
                    className="mb-3 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500"
                />

                {/* Create button */}
                <MainButton className="mb-4 w-full !p-3 ">
                    + Create your own
                </MainButton>

                {/* Tabs */}
                <TribesTabs />
            </div>

            {/* Content */}
            <Outlet />
        </div>
    );
}

export default Tribes;
