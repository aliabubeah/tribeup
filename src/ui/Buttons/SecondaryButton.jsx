import { Link } from "react-router-dom";

function SecondaryButton({ children, onClick, to, className, disabled }) {
    if (to) {
        return (
            <Link
                to={to}
                className={`rounded-md border-2 border-neutral-800 px-3 py-[6px] text-center text-sm font-semibold leading-none text-neutral-800 transition-all duration-300 hover:bg-neutral-400 active:bg-neutral-950 active:text-white ${className}`}
            >
                {children}
            </Link>
        );
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`rounded-md border-2 border-neutral-800 px-3 py-[6px] text-center text-xs font-bold leading-none text-neutral-800 transition-all duration-300 hover:bg-neutral-100 active:bg-neutral-950 active:text-white ${className}`}
        >
            {children}
        </button>
    );
}

export default SecondaryButton;
