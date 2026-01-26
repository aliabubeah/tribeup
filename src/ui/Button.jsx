import { Link } from "react-router-dom";

function Button({ type, to, children, disabled, onClick, className }) {
    if (to) {
        return (
            <Link
                to={to}
                className="rounded-md border-2 border-neutral-800 py-3 text-center text-sm font-semibold text-neutral-800 transition-all duration-300 hover:bg-neutral-400 active:bg-neutral-950 active:text-white"
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
            className={`rounded-md bg-tribe-500 py-3 text-sm text-white transition-all duration-300 hover:bg-tribe-400 active:bg-tribe-600 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
        >
            {children}
        </button>
    );
}

export default Button;
