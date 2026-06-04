// hooks/useInvalidateProfile.js
import { useQueryClient } from "@tanstack/react-query";

export default function useInvalidateProfile() {
    const queryClient = useQueryClient();

    return () =>
        queryClient.invalidateQueries({
            queryKey: ["profile"],
        });
}
