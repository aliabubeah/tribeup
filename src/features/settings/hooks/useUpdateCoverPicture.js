import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/AuthContext";
import { updateCoverPictureAPI } from "../../../services/profile";

export default function useUpdateProfilePicture() {
    const { accessToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (file) => {
            await updateCoverPictureAPI(accessToken, file);

            return URL.createObjectURL(file);
        },

        onSuccess: (previewUrl) => {
            queryClient.setQueryData(["profile"], (old) => ({
                ...old,
                coverPicture: previewUrl,
            }));
        },
    });
}
