import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/AuthContext";
import { deleteBioAPI } from "../../../services/profile";

export default function useDeleteBio() {
    const { accessToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => deleteBioAPI(accessToken),

        onSuccess: () => {
            queryClient.setQueryData(["profile"], (old) => ({
                ...old,
                bio: null,
            }));
        },
    });
}
