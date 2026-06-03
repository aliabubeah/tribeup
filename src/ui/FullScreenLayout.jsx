import { Outlet } from "react-router-dom";
import MobileNav from "./MobileNav";
import Sidebar from "./Sidebar";

function FullScreenLayout() {
    return (
        <>
            <div className="flex h-screen flex-col bg-neutral-50">
                <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 overflow-hidden">
                    {/* SideBar */}
                    <aside className="relative hidden w-16 shrink-0 border-r-2 border-neutral-200 pt-8 md:block lg:w-64">
                        <Sidebar />
                    </aside>

                    {/* Main Content */}
                    <main className="w-full flex-1 overflow-y-auto pb-16 md:p-0">
                        <Outlet />
                    </main>
                </div>

                {/* MobileNav */}
                <MobileNav />
            </div>
        </>
    );
}

export default FullScreenLayout;
