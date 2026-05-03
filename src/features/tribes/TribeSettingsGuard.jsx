import { Navigate, useParams } from "react-router-dom";
import SplashScreen from "../../ui/SplashScreen";
import { GetGroupAPI } from "../../services/groups";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

function TribeSettingsGuard({ children }) {
    const { tribeId } = useParams();
    const { accessToken } = useAuth();
    const id = tribeId;

    const { data, isLoading } = useQuery({
        queryKey: ["tribe", tribeId],
        queryFn: () => GetGroupAPI(accessToken, id),
        enabled: !!tribeId,
    });

    if (isLoading) return <SplashScreen />;

    const canManage =
        data?.groupRelationType === "Owner" ||
        data?.groupRelationType === "Admin";

    if (!canManage) {
        return <Navigate to={`/tribes/${tribeId}`} replace />;
    }

    return children;
}

export default TribeSettingsGuard;
