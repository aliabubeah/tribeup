import { useState } from "react";
import MainButton from "../Buttons/MainButton";
function CreateStoryForm({ onClose }) {
    const [file, setFile] = useState(null);

    function handleSubmit() {
        console.log("Create Story:", file);
        onClose();
    }

    return (
        <div className="flex flex-col gap-4">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border p-6 text-sm font-medium hover:bg-neutral-100">
                Upload Story
                <input
                    type="file"
                    hidden
                    onChange={(e) => setFile(e.target.files[0])}
                />
            </label>

            <MainButton onClick={handleSubmit}>Share Story</MainButton>
        </div>
    );
}

export default CreateStoryForm;
