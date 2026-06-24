import * as signalR from "@microsoft/signalr";
import { BASEURL } from "./http";

let connection = null;

let notificationConnection = null;

export function createNotificationConnection(accessToken) {
    if (notificationConnection) return notificationConnection;

    notificationConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${BASEURL}/hubs/notifications`, {
            accessTokenFactory: () => accessToken,
        })
        .withAutomaticReconnect()
        .build();

    return notificationConnection;
}

export function createGroupChatConnection(accessToken) {
    if (connection) return connection;

    connection = new signalR.HubConnectionBuilder()
        .withUrl(`${BASEURL}/hubs/group-chat`, {
            accessTokenFactory: () => accessToken,
        })
        .withAutomaticReconnect()
        .build();

    return connection;
}

export function createVirtualRoomConnection(accessToken) {
    return new signalR.HubConnectionBuilder()
        .withUrl(`${BASEURL}/hubs/virtual-room`, {
            accessTokenFactory: () => accessToken,
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Warning)
        .build();
}

export function getConnection() {
    return connection;
}
