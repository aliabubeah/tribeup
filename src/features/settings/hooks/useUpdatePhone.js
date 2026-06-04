import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/AuthContext";
import { updateNumberAPI } from "../../../services/profile";

export default function useUpdatePhone() {
    const queryClient = useQueryClient();
    const { accessToken } = useAuth();

    return useMutation({
        mutationFn: (phoneNumber) => updateNumberAPI(accessToken, phoneNumber),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["profile"],
            });
        },
    });
}
