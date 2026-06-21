import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SplashScreen from "./SplashScreen";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as signalR from "@microsoft/signalr";
import {
    createGroupChatConnection,
    createNotificationConnection,
} from "../services/siganlR";
import {
    receiveGroupMessage,
    updateInboxLastMessage,
} from "../features/messaging/chatSlice";

function ProtectedRoute({ children }) {
    const { isAuthenticated, user, isLoading, accessToken } = useAuth();
    const dispatch = useDispatch();

    const { inbox } = useSelector((state) => state.chat);

    const inboxRef = useRef(inbox);

    useEffect(() => {
        inboxRef.current = inbox;
    }, [inbox]);

    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => {
                setShowSplash(false);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    // ================= EFFECT 1: SETUP CONNECTION =================

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
            console.log("🔥 notification-received", notification);
        });

        // ================= START CHAT HUB =================
        if (chatConnection.state === signalR.HubConnectionState.Disconnected) {
            chatConnection
                .start()
                .then(() => {
                    console.log("Group Chat SignalR connected");

                    const currentInbox = inboxRef.current;
                    if (currentInbox && currentInbox.length > 0) {
                        currentInbox.forEach((chatItem) => {
                            chatConnection
                                .invoke("JoinGroupChat", chatItem.groupId)
                                .catch((err) =>
                                    console.error(
                                        `Error joining ${chatItem.groupId}:`,
                                        err,
                                    ),
                                );
                        });
                    }
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
        };
    }, [accessToken, dispatch]);

    // ================= EFFECT 2: DYNAMIC ROOM JOINING =================

    useEffect(() => {
        if (!accessToken || !inbox || inbox.length === 0) return;

        const chatConnection = createGroupChatConnection(accessToken);

        if (chatConnection.state === signalR.HubConnectionState.Connected) {
            inbox.forEach((chatItem) => {
                chatConnection
                    .invoke("JoinGroupChat", chatItem.groupId)
                    .catch((err) =>
                        console.error(
                            `Error joining group ${chatItem.groupId}:`,
                            err,
                        ),
                    );
            });
        }
    }, [inbox, accessToken]);

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
