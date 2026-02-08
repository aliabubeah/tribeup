import Sidebar from "./Sidebar";

function MobileSidebarDrawer({ open, onClose }) {
    return (
        <div
            className={`fixed inset-0 z-50 transition-opacity md:hidden ${
                open ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            {/* Drawer */}
            <div
                className={`absolute inset-y-0 left-0 w-full max-w-[85%] bg-white transition-transform duration-300 ease-out ${open ? "translate-x-0" : "-translate-x-full"} px-4 py-8`}
            >
                <Sidebar labelhidden={true} />
            </div>
        </div>
    );
}

export default MobileSidebarDrawer;
