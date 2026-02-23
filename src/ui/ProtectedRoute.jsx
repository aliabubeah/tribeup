import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SplashScreen from "./SplashScreen";

function ProtectedRoute({ children }) {
    const { isAuthenticated, user, isLoading } = useAuth();
    if (isLoading) {
        return <SplashScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }
    if (!user) {
        return <SplashScreen />;
    }
    return children;
}

export default ProtectedRoute;
