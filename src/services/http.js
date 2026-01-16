export const BASEURL = "http://tribeup.runasp.net/api";

export function getDeviceId() {
    let deviceId = localStorage.getItem("deviceId");

    if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem("deviceId", deviceId);
    }

    return deviceId;
}
