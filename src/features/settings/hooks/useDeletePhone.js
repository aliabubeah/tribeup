import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/AuthContext";
import { deleteNumberAPI } from "../../../services/profile";

export default function useDeletePhone() {
    const { accessToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => deleteNumberAPI(accessToken),

        onSuccess: () => {
            queryClient.setQueryData(["profile"], (old) => ({
                ...old,
                phoneNumber: null,
            }));
        },
    });
}
