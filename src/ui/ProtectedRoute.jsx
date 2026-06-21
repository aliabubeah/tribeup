import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SplashScreen from "./SplashScreen";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as signalR from "@microsoft/signalr";

import { createGroupChatConnection } from "../services/siganlR";
import { receiveGroupMessage } from "../features/messaging/chatSlice";

function ProtectedRoute({ children }) {
    const { isAuthenticated, user, isLoading, accessToken } = useAuth();

    const dispatch = useDispatch();
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => {
                setShowSplash(false);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    // Global SignalR connection
    useEffect(() => {
        if (!accessToken) return;

        const connection = createGroupChatConnection(accessToken);

        connection.off("ReceiveGroupMessage");

        connection.on("ReceiveGroupMessage", (message) => {
            dispatch(receiveGroupMessage(message));
        });

        if (
            connection.state === signalR.HubConnectionState.Connected ||
            connection.state === signalR.HubConnectionState.Connecting
        ) {
            return;
        }

        connection
            .start()
            .then(() => {
                console.log("SignalR connected");
            })
            .catch((err) => {
                console.error("SignalR error:", err);
            });

        connection.onclose((err) => {
            console.log("SignalR closed:", err);
        });

        connection.onreconnecting((err) => {
            console.log("SignalR reconnecting:", err);
        });

        connection.onreconnected((id) => {
            console.log("SignalR reconnected:", id);
        });

        return () => {
            connection.off("ReceiveGroupMessage");
            connection.stop();
        };
    }, [accessToken, dispatch]);

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
