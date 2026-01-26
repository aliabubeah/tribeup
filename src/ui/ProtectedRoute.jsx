import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({ children }) {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }
    if (!user) {
        return <h1>Fetching Profile</h1>;
    }
    return children;
}

export default ProtectedRoute;
