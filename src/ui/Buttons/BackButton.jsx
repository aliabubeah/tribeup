import { useNavigate } from "react-router-dom";

function BackButton() {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center gap-1 justify-self-start px-4 py-3">
            <button
                className="icon-outlined text-2xl"
                onClick={() => navigate(-1)}
            >
                arrow_back
            </button>
            <span className="text-xl font-semibold">Back</span>
        </div>
    );
}

export default BackButton;
