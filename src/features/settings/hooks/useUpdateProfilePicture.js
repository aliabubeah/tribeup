import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/AuthContext";
import { updateProfilePictureAPI } from "../../../services/profile";

export default function useUpdateProfilePicture() {
    const { accessToken, updateUser } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (file) => {
            await updateProfilePictureAPI(accessToken, file);

            return URL.createObjectURL(file);
        },

        onSuccess: (previewUrl) => {
            queryClient.setQueryData(["profile"], (old) => ({
                ...old,
                profilePicture: previewUrl,
            }));

            updateUser({
                profilePicture: previewUrl,
            });
        },
    });
}
