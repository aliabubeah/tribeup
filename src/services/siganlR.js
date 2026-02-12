import * as signalR from "@microsoft/signalr";
import { BASEURL } from "./http";

let connection = null;

export function createGroupChatConnection(accessToken) {
    connection = new signalR.HubConnectionBuilder()
        .withUrl(`${BASEURL}/hubs/group-chat`, {
            accessTokenFactory: () => accessToken,
        })
        .withAutomaticReconnect()
        .build();

    return connection;
}

export function getConnection() {
    return connection;
}
