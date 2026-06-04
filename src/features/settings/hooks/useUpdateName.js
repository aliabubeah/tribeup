// hooks/useUpdateName.js

import { useMutation } from "@tanstack/react-query";
import { updateNameAPI } from "../../../services/profile";
import { useAuth } from "../../../contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

export default function useUpdateName() {
    const { accessToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ firstName, lastName }) =>
            updateNameAPI(accessToken, firstName, lastName),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["profile"],
            });
        },
    });
}
