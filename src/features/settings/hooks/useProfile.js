// hooks/useProfile.js
import { useQuery } from "@tanstack/react-query";
import { profileInfoAPI } from "../../../services/profile";
import { useAuth } from "../../../contexts/AuthContext";

export default function useProfile() {
    const { accessToken } = useAuth();

    return useQuery({
        queryKey: ["profile"],
        queryFn: () => profileInfoAPI(accessToken),
        enabled: !!accessToken,
    });
}
