import { useState } from "react";
import { getCleanImageUrl } from "../../services/http";
import SecondaryButton from "../../ui/Buttons/SecondaryButton";
import PrivacySelector from "./PrivacySelector";
import MainButton from "../../ui/Buttons/MainButton";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { GetGroupAPI } from "../../services/groups";
import { useAuth } from "../../contexts/AuthContext";

function General() {
    const { tribeId } = useParams();
    const { accessToken } = useAuth();

    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState(null);

    const {
        data: tribe,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["tribe", tribeId],
        queryFn: () => GetGroupAPI(accessToken, tribeId),
        // enabled: !!tribeId,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error</div>;

    const base = {
        name: tribe.groupName || "",
        description: tribe.description || "",
        privacy: tribe.isPrivate ? "private" : "public",
    };

    const current = isEdit && form ? form : base;

    const hasChanges =
        isEdit &&
        form &&
        (form.name !== base.name ||
            form.description !== base.description ||
            form.privacy !== base.privacy);

    return (
        <div className="flex flex-col rounded-lg rounded-b-none bg-white">
            {/* Cover */}
            <div className="relative rounded-t-lg bg-neutral-200">
                <img
                    src={getCleanImageUrl(tribe.groupProfilePicture)}
                    className="h-44 w-full rounded-t-lg object-cover"
                />
            </div>

            <div className="flex flex-col gap-8 p-4">
                {/* Inputs */}
                <div className="flex flex-col gap-4">
                    <input
                        className="input"
                        type="text"
                        disabled={!isEdit}
                        value={current.name}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                    />

                    <input
                        className="input"
                        type="text"
                        disabled={!isEdit}
                        value={current.description}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                description: e.target.value,
                            }))
                        }
                    />
                </div>

                {/* Privacy */}
                <div className="flex flex-col">
                    <h1 className="mb-3 font-bold">Privacy</h1>

                    <PrivacySelector
                        value={current.privacy}
                        onChange={
                            isEdit
                                ? (val) =>
                                      setForm((prev) => ({
                                          ...prev,
                                          privacy: val,
                                      }))
                                : () => {}
                        }
                    />
                </div>

                {/* Buttons */}
                {isEdit ? (
                    <div className="flex items-center justify-center gap-2">
                        <SecondaryButton
                            className="!px-5 !py-3"
                            onClick={() => {
                                setIsEdit(false);
                                setForm(null);
                            }}
                        >
                            Cancel
                        </SecondaryButton>

                        <MainButton
                            className="!px-5 !py-3"
                            disabled={!hasChanges}
                        >
                            Save Changes
                        </MainButton>
                    </div>
                ) : (
                    <SecondaryButton
                        className="!px-5 !py-3"
                        onClick={() => {
                            setForm(base);
                            setIsEdit(true);
                        }}
                    >
                        Edit
                    </SecondaryButton>
                )}
            </div>
        </div>
    );
}

export default General;
