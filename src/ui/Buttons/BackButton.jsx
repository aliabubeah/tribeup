import { useNavigate } from "react-router-dom";

function BackButton({ to, className }) {
    const navigate = useNavigate();

    const go = to ? to : -1;

    return (
        <div
            className={`flex items-center gap-1 justify-self-start px-4 text-sm md:text-lg ${className}`}
        >
            <button
                className="icon-outlined text-xl"
                onClick={() => navigate(go)}
            >
                arrow_back
            </button>
            <span className="font-semibold">Back</span>
        </div>
    );
}

export default BackButton;
