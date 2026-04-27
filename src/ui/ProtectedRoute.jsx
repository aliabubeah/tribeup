import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SplashScreen from "./SplashScreen";
import { useEffect, useState } from "react";

function ProtectedRoute({ children }) {
    const { isAuthenticated, user, isLoading } = useAuth();

    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => {
                setShowSplash(false);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    // still loading OR waiting for minimum splash duration
    if (isLoading || showSplash) {
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
