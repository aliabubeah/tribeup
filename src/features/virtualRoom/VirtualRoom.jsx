/* eslint-disable react/no-unknown-property */
import {
    HubConnectionBuilder,
    LogLevel,
    HubConnectionState,
} from "@microsoft/signalr";
import { BASEURL } from "../../services/http";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getUserAvatarAPI } from "../../services/profile";
import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import PlayerAvatar from "./PlayerAvatar";
import LectureHall from "./LectureHall";

function Loader() {
    return (
        <Html center>
            <div className="rounded-lg bg-black bg-opacity-60 px-6 py-3 text-xl font-bold text-white">
                Loading...
            </div>
        </Html>
    );
}

export const cameraState = { yaw: 0, pitch: 0 };

// ── Camera boundaries — keep cam inside the room walls ───────────────────────
const CAM_CLAMP = {
    xMin: -11.5,
    xMax: 11.5,
    yMin: 0.5,
    yMax: 5.8,
    zMin: -19.5,
    zMax: 7.5,
};

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

// ── Camera Follow ─────────────────────────────────────────────────────────────
function CameraFollow({ target, isPointerLocked }) {
    const yaw = useRef(cameraState.yaw);
    const pitch = useRef(cameraState.pitch);
    const camPos = useRef({ x: 0, y: 3, z: 5 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isPointerLocked.current) return;
            yaw.current -= e.movementX * 0.002;
            pitch.current -= e.movementY * 0.002;
            pitch.current = Math.max(
                -Math.PI / 3,
                Math.min(Math.PI / 6, pitch.current),
            );
            cameraState.yaw = yaw.current;
            cameraState.pitch = pitch.current;
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [isPointerLocked]);

    useFrame(({ camera }, delta) => {
        if (!target.current) return;

        const distance = 3;
        const height = 2.2;

        const tx =
            target.current.position.x +
            Math.sin(yaw.current) * Math.cos(pitch.current) * distance;
        const ty =
            target.current.position.y +
            height +
            Math.sin(pitch.current) * distance;
        const tz =
            target.current.position.z +
            Math.cos(yaw.current) * Math.cos(pitch.current) * distance;

        const lf = 1 - Math.pow(0.01, delta);
        camPos.current.x += (tx - camPos.current.x) * lf;
        camPos.current.y += (ty - camPos.current.y) * lf;
        camPos.current.z += (tz - camPos.current.z) * lf;

        const cx = clamp(camPos.current.x, CAM_CLAMP.xMin, CAM_CLAMP.xMax);
        const cy = clamp(camPos.current.y, CAM_CLAMP.yMin, CAM_CLAMP.yMax);
        const cz = clamp(camPos.current.z, CAM_CLAMP.zMin, CAM_CLAMP.zMax);

        camera.position.set(cx, cy, cz);
        camera.lookAt(
            target.current.position.x,
            target.current.position.y + 1,
            target.current.position.z,
        );
    });

    return null;
}

// ── HUD ───────────────────────────────────────────────────────────────────────
function HUD({ message, onRequestPointerLock, isLocked }) {
    return (
        <>
            {!isLocked && (
                <div
                    onClick={onRequestPointerLock}
                    className="absolute inset-0 flex cursor-pointer items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.55)" }}
                >
                    <div className="select-none text-center text-white">
                        <div className="mb-3 text-4xl">🖱️</div>
                        <div className="mb-1 text-2xl font-bold">
                            Click to Enter
                        </div>
                        <div className="text-sm opacity-70">
                            WASD to move · Mouse to look · Esc to unlock
                        </div>
                    </div>
                </div>
            )}

            {isLocked && (
                <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 select-none rounded-full bg-black bg-opacity-40 px-3 py-1 text-xs text-white">
                    WASD · Mouse · Esc unlock
                </div>
            )}

            {message && (
                <div className="absolute left-1/2 top-5 -translate-x-1/2 rounded-lg bg-black bg-opacity-70 px-5 py-2 text-sm font-semibold text-white shadow-lg">
                    {message}
                </div>
            )}

            {isLocked && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div
                        style={{ width: 16, height: 16, position: "relative" }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                top: 7,
                                left: 0,
                                width: 16,
                                height: 2,
                                background: "rgba(255,255,255,0.8)",
                                borderRadius: 1,
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                left: 7,
                                top: 0,
                                width: 2,
                                height: 16,
                                background: "rgba(255,255,255,0.8)",
                                borderRadius: 1,
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function VirtualRoom() {
    // Read groupId from the URL: /groups/:groupId/virtualRoom
    const { groupId: groupIdParam } = useParams();
    const groupId = Number(groupIdParam);

    const { accessToken, user } = useAuth();
    const navigate = useNavigate();

    const [players, setPlayers] = useState([]);
    const [isFetchingAvatar, setIsFetchingAvatar] = useState(true);

    // Hub connection ref — shared with PlayerAvatar for Move calls
    const connectionRef = useRef(null);

    // High-frequency movement dictionary: { [userId]: { position, rotationY } }
    // Written by SignalR listener, read every frame by remote PlayerAvatars
    const remoteTargetsRef = useRef({});

    const localAvatarRef = useRef();
    const isLockedRef = useRef(false);
    const [message, setMessage] = useState("");
    const [isLocked, setIsLocked] = useState(false);

    // ── Step 1: fetch local player's avatar, then connect SignalR ────────────
    useEffect(() => {
        if (!accessToken || !user) return;

        async function bootstrap() {
            // 1a. Fetch avatar
            let avatarUrl;
            try {
                const data = await getUserAvatarAPI(accessToken);
                if (!data?.avatar) {
                    navigate("/settings/avatar", { replace: true });
                    return;
                }
                avatarUrl = data.avatar;
            } catch {
                navigate("/settings/avatar", { replace: true });
                return;
            } finally {
                setIsFetchingAvatar(false);
            }

            // 1b. Seed local player immediately so the scene renders
            const localPlayer = {
                id: user.id,
                username: user.userName,
                avatarUrl,
                isLocal: true,
                position: [0, 0, 1],
            };
            setPlayers([localPlayer]);

            // 1c. Build SignalR connection
            const connection = new HubConnectionBuilder()
                .withUrl(`${BASEURL}/hubs/virtual-room`, {
                    accessTokenFactory: () => accessToken,
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Warning)
                .build();

            // ── Incoming: another player joined ──────────────────────────────
            // participant shape: { id, username, avatarUrl }
            connection.on("PlayerJoined", (participant) => {
                setPlayers((prev) => {
                    if (prev.find((p) => p.id === participant.id)) return prev;
                    return [
                        ...prev,
                        {
                            id: participant.id,
                            username: participant.username,
                            avatarUrl: participant.avatarUrl,
                            isLocal: false,
                            position: [0, 0, 1],
                        },
                    ];
                });
                setMessage(`${participant.username} joined`);
                setTimeout(() => setMessage(""), 3000);
            });

            // ── Incoming: another player left ─────────────────────────────────
            connection.on("PlayerLeft", (userId) => {
                setPlayers((prev) => {
                    const leaving = prev.find((p) => p.id === userId);
                    if (leaving) {
                        setMessage(`${leaving.username} left`);
                        setTimeout(() => setMessage(""), 3000);
                    }
                    return prev.filter((p) => p.id !== userId);
                });
                delete remoteTargetsRef.current[userId];
            });

            // ── Incoming: high-frequency position update ──────────────────────
            // Written into a ref so PlayerAvatar lerps toward it every frame
            connection.on("PlayerMoved", (userId, position, rotationY) => {
                remoteTargetsRef.current[userId] = { position, rotationY };
            });

            // 1d. Start the connection, then announce ourselves
            try {
                await connection.start();
                connectionRef.current = connection;

                const selfParticipant = {
                    id: user.id,
                    username: user.userName,
                    avatarUrl,
                };
                await connection.invoke(
                    "JoinVirtualRoom",
                    groupId,
                    selfParticipant,
                );

                // 1e. Load existing participants from REST and add as remote players
                try {
                    const res = await fetch(
                        `${BASEURL}/api/groups/${groupId}/virtual-room/participants`,
                        { headers: { Authorization: `Bearer ${accessToken}` } },
                    );
                    if (res.ok) {
                        const existing = await res.json();
                        setPlayers((prev) => {
                            const ids = new Set(prev.map((p) => p.id));
                            const newcomers = existing
                                .filter((p) => !ids.has(p.id))
                                .map((p) => ({
                                    id: p.id,
                                    username: p.username,
                                    avatarUrl: p.avatarUrl,
                                    isLocal: false,
                                    position: [0, 0, 1],
                                }));
                            return [...prev, ...newcomers];
                        });
                    }
                } catch (err) {
                    console.warn("Could not fetch existing participants:", err);
                }
            } catch (err) {
                console.error("SignalR connection failed:", err);
            }
        }

        bootstrap();

        // ── Cleanup: leave the room on unmount ───────────────────────────────
        return () => {
            const conn = connectionRef.current;
            if (!conn) return;
            if (conn.state === HubConnectionState.Connected) {
                conn.invoke("LeaveVirtualRoom", groupId, user.id).catch(
                    () => {},
                );
            }
            conn.stop();
            connectionRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken, user]);

    // ── Pointer lock ──────────────────────────────────────────────────────────
    useEffect(() => {
        isLockedRef.current = isLocked;
    }, [isLocked]);

    useEffect(() => {
        const onChange = () => {
            const locked = !!document.pointerLockElement;
            setIsLocked(locked);
            isLockedRef.current = locked;
        };
        document.addEventListener("pointerlockchange", onChange);
        return () =>
            document.removeEventListener("pointerlockchange", onChange);
    }, []);

    const requestPointerLock = useCallback(() => {
        document.body.requestPointerLock();
    }, []);

    // ── Guards ────────────────────────────────────────────────────────────────
    if (isFetchingAvatar) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-xl font-bold text-white">
                Loading Room Profile...
            </div>
        );
    }

    if (players.length === 0) return null;

    return (
        <div className="relative h-screen w-full overflow-hidden bg-gray-900">
            <Canvas
                shadows
                camera={{ position: [0, 3, 5], fov: 70 }}
                onClick={!isLocked ? requestPointerLock : undefined}
            >
                <ambientLight intensity={0.4} />
                <directionalLight
                    position={[8, 10, -18]}
                    intensity={1.5}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                    shadow-camera-near={0.5}
                    shadow-camera-far={60}
                    shadow-camera-left={-20}
                    shadow-camera-right={20}
                    shadow-camera-top={15}
                    shadow-camera-bottom={-5}
                />
                <Environment preset="apartment" />

                <LectureHall />

                <Suspense fallback={<Loader />}>
                    <CameraFollow
                        target={localAvatarRef}
                        isPointerLocked={isLockedRef}
                    />

                    {players.map((p) => (
                        <PlayerAvatar
                            key={p.id}
                            player={p}
                            avatarRef={p.isLocal ? localAvatarRef : undefined}
                            connection={connectionRef.current}
                            remoteTargetsRef={remoteTargetsRef}
                            groupId={groupId}
                        />
                    ))}
                </Suspense>
            </Canvas>

            <HUD
                message={message}
                onRequestPointerLock={requestPointerLock}
                isLocked={isLocked}
            />
        </div>
    );
}
