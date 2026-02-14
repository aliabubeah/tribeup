import { Link } from "react-router-dom";

function MainButton({ children, type, disabled, onClick, to, className }) {
    if (to) {
        return (
            <Link
                disabled={disabled}
                to={to}
                className={`rounded-md bg-tribe-500 py-3 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:bg-tribe-400 active:bg-tribe-600 disabled:cursor-not-allowed disabled:bg-neutral-500 disabled:opacity-60 ${className}`}
            >
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`rounded-md bg-tribe-500 px-3 py-[6px] text-xs font-bold tracking-wide text-white transition-all duration-300 hover:bg-tribe-400 active:bg-tribe-600 disabled:cursor-not-allowed disabled:bg-neutral-500 disabled:opacity-60 ${className}`}
        >
            {children}
        </button>
    );
}

export default MainButton;
