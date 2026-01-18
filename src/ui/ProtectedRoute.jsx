import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({ children }) {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading || !user?.fullName) {
        return <h1>Loading...</h1>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
