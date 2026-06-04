import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/AuthContext";
import { updateBioAPI } from "../../../services/profile";

export default function useUpdateBio() {
    const { accessToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (bio) => updateBioAPI(accessToken, bio),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["profile"],
            });
        },
    });
}
