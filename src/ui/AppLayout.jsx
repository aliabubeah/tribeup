import { NavLink, Outlet } from "react-router-dom";
// import Header from "./Header";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

function AppLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-neutral-100">
            <div className="mx-auto flex w-full max-w-7xl flex-1">
                {/* SideBar */}
                <aside className="relative hidden w-16 shrink-0 border-r-2 border-neutral-200 md:block lg:w-64">
                    <Sidebar />
                </aside>
                {/* Main Content */}
                <main className="w-full flex-1 px-4 py-8 md:max-w-[600px]">
                    <Outlet />
                </main>
                {/* Right Column */}
                <aside className="hidden w-80 shrink-0 border border-green-100 xl:block"></aside>
            </div>

            {/* Mobile Bottom Navigation only on small screens*/}
            <MobileNav />
        </div>
    );
}

export default AppLayout;
