import { useNavigate } from "react-router-dom";

function BackButton() {
    const navigate = useNavigate();

    return (
        <div className="flex items-center gap-1 justify-self-start px-4 text-sm md:text-lg">
            <button
                className="icon-outlined text-xl"
                onClick={() => navigate(-1)}
            >
                arrow_back
            </button>
            <span className="font-semibold">Back</span>
        </div>
    );
}

export default BackButton;
