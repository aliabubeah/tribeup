import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SplashScreen from "./SplashScreen";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as signalR from "@microsoft/signalr";

import {
    createGroupChatConnection,
    createNotificationConnection,
} from "../services/siganlR";

import {
    receiveGroupMessage,
    updateInboxLastMessage,
} from "../features/messaging/chatSlice";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function ProtectedRoute({ children }) {
    const { isAuthenticated, user, isLoading, accessToken } = useAuth();
    const [showSplash, setShowSplash] = useState(true);
    const dispatch = useDispatch();

    const queryClient = useQueryClient();

    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => {
                setShowSplash(false);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    useEffect(() => {
        if (!accessToken) return;

        const chatConnection = createGroupChatConnection(accessToken);

        const notificationConnection =
            createNotificationConnection(accessToken);

        // ================= CHAT HUB =================

        chatConnection.off("ReceiveGroupMessage");
        chatConnection.off("UpdateInbox");

        chatConnection.on("ReceiveGroupMessage", (message) => {
            dispatch(receiveGroupMessage(message));
        });

        chatConnection.on("UpdateInbox", (message) => {
            console.log("UpdateInbox", message);

            dispatch(updateInboxLastMessage(message));
        });

        // ================= NOTIFICATION HUB =================

        notificationConnection.off("notification-received");

        notificationConnection.on("notification-received", (notification) => {
            queryClient.setQueryData(
                ["notifications", accessToken],
                (oldData) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        pages: [
                            {
                                ...oldData.pages[0],
                                unreadCount:
                                    (oldData.pages[0].unreadCount ?? 0) + 1,
                                notifications: [
                                    notification,
                                    ...oldData.pages[0].notifications,
                                ],
                            },
                            ...oldData.pages.slice(1),
                        ],
                    };
                },
            );

            toast.success(notification.title);
        });

        // ================= START CHAT HUB =================

        if (chatConnection.state === signalR.HubConnectionState.Disconnected) {
            chatConnection
                .start()
                .then(() => {
                    console.log("Group Chat SignalR connected");
                })
                .catch((err) => {
                    console.error("Group Chat SignalR error:", err);
                });
        }

        // ================= START NOTIFICATION HUB =================

        if (
            notificationConnection.state ===
            signalR.HubConnectionState.Disconnected
        ) {
            notificationConnection
                .start()
                .then(() => {
                    console.log("Notification SignalR connected");
                })
                .catch((err) => {
                    console.error("Notification SignalR error:", err);
                });
        }

        return () => {
            chatConnection.off("ReceiveGroupMessage");
            chatConnection.off("UpdateInbox");

            notificationConnection.off("notification-received");

            chatConnection.stop();
            notificationConnection.stop();
        };
    }, [accessToken, dispatch]);

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
