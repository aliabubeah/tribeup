import { useState } from "react";
import Cropper from "react-easy-crop";

function ImageCropModal({ image, onCropComplete, onClose, aspect = 1 }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    function handleCropComplete(_, croppedPixels) {
        setCroppedAreaPixels(croppedPixels);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="w-[90vw] max-w-xl rounded-xl bg-white p-4">
                <div className="relative h-[400px]">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={handleCropComplete}
                    />
                </div>

                <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="mt-4 w-full"
                />

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="rounded border px-4 py-2"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => onCropComplete(croppedAreaPixels)}
                        className="rounded bg-blue-500 px-4 py-2 text-white"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ImageCropModal;
