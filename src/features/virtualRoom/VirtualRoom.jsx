/* eslint-disable react/no-unknown-property */
import { HubConnectionState } from "@microsoft/signalr";
import { createVirtualRoomConnection } from "../../services/siganlR";
import { useNavigate, useParams, useBlocker } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getUserAvatarAPI } from "../../services/profile";
import {
    joinVirtualRoomAPI,
    leaveVirtualRoomAPI,
    getVoiceTokenAPI,
    getParticipantsAPI,
} from "../../services/virtualRoom";
import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Html, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import PlayerAvatar from "./PlayerAvatar";
import LectureHall from "./LectureHall";
import AvatarErrorBoundary from "./AvatarErrorBoundary";
import { usePushToTalk } from "./hooks/usePushToTalk";

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

function EscMenu({ onResume, onLeave }) {
    return (
        <div
            className="absolute inset-0 z-50 flex items-center justify-center"
            style={{
                background: "rgba(0,0,0,0.65)",
                backdropFilter: "blur(4px)",
            }}
        >
            <div className="flex w-64 flex-col gap-3 rounded-2xl border border-white/10 bg-gray-900 p-8 shadow-2xl">
                <h2 className="mb-2 text-center text-xl font-bold tracking-wide text-white">
                    Paused
                </h2>

                <button
                    onClick={onResume}
                    className="rounded-lg bg-purple-700 px-4 py-2 font-semibold text-white transition-colors hover:bg-purple-600"
                >
                    ▶ Resume
                </button>

                <button
                    onClick={onLeave}
                    className="rounded-lg bg-red-700 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-600"
                >
                    🚪 Leave Room
                </button>
            </div>
        </div>
    );
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
function HUD({
    message,
    onRequestPointerLock,
    isLocked,
    isMenuOpen,
    activeSpeakers = [],
}) {
    return (
        <>
            {/* NEW: Active Speakers Overlay Panel */}
            <div className="pointer-events-none absolute left-4 top-4 z-40 flex flex-col gap-2 transition-all">
                {activeSpeakers.map((speaker, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-md"
                    >
                        <span className="animate-pulse text-green-400">🎙️</span>
                        <span>{speaker}</span>
                    </div>
                ))}
            </div>

            {!isLocked && !isMenuOpen && (
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
                            WASD to move · Mouse to look · V to talk · Esc Menu
                        </div>
                    </div>
                </div>
            )}

            {isLocked && !isMenuOpen && (
                <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 select-none rounded-full bg-black bg-opacity-40 px-3 py-1 text-xs text-white">
                    WASD · Mouse · V to talk · Esc Menu
                </div>
            )}

            {message && (
                <div className="absolute left-1/2 top-5 -translate-x-1/2 rounded-lg bg-black bg-opacity-70 px-5 py-2 text-sm font-semibold text-white shadow-lg">
                    {message}
                </div>
            )}

            {isLocked && !isMenuOpen && (
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

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const hasJoinedRef = useRef(false); // guards against double-leave

    const [voiceToken, setVoiceToken] = useState(null);
    const [voiceUrl, setVoiceUrl] = useState(null);

    const leaveRoom = useCallback(async () => {
        if (!hasJoinedRef.current) return;
        hasJoinedRef.current = false;

        // REST leave
        leaveVirtualRoomAPI(groupId, accessToken);

        // SignalR leave
        const conn = connectionRef.current;
        if (conn?.state === HubConnectionState.Connected) {
            conn.invoke("LeaveVirtualRoom", groupId, user.id).catch(() => {});
        }
        conn?.stop();
        connectionRef.current = null;
    }, [accessToken, groupId, user]);

    const leaveRoomRef = useRef(leaveRoom);
    useEffect(() => {
        leaveRoomRef.current = leaveRoom;
    }, [leaveRoom]);

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
            const connection = createVirtualRoomConnection(accessToken);

            // ── Incoming: another player joined ──────────────────────────────
            // participant shape: { id, username, avatarUrl }
            connection.on("PlayerJoined", (participant) => {
                // Start downloading the GLB immediately — before the component mounts.
                if (participant.avatarUrl) {
                    useGLTF.preload(participant.avatarUrl);
                }

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
                // Preserve isSitting so the sit state machine isn't reset by position ticks
                const prev = remoteTargetsRef.current[userId];
                remoteTargetsRef.current[userId] = {
                    position,
                    rotationY,
                    isSitting: prev?.isSitting ?? false,
                };
            });

            // ── Incoming: sit / stand event ───────────────────────────────────
            connection.on("PlayerSat", (userId, isSitting) => {
                const prev = remoteTargetsRef.current[userId];
                remoteTargetsRef.current[userId] = {
                    ...prev,
                    isSitting,
                };
            });

            // 1d. Call REST join first — this adds us to DB and checks membership
            try {
                const joinRes = await joinVirtualRoomAPI(groupId, accessToken);

                if (joinRes.status === 403) {
                    navigate("/", { replace: true });
                    return;
                }
                if (joinRes.status === 400) {
                    // Avatar is missing or deleted from Avaturn — send them to fix it
                    navigate("/settings/avatar", { replace: true });
                    return;
                }
                if (!joinRes.ok) throw new Error("Failed to join room");

                hasJoinedRef.current = true;

                // Fetch LiveKit voice token
                try {
                    const voiceData = await getVoiceTokenAPI(
                        groupId,
                        accessToken,
                    );
                    if (voiceData) {
                        setVoiceToken(voiceData.token);
                        setVoiceUrl(voiceData.url);
                    }
                } catch (err) {
                    console.warn("Voice chat token fetch failed:", err);
                }
            } catch (err) {
                console.error("REST JoinRoom failed:", err);
                navigate("/", { replace: true });
                return;
            }

            // 1e. Start SignalR and announce ourselves
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
                    const existing = await getParticipantsAPI(
                        groupId,
                        accessToken,
                    );
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
            leaveRoom();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken, user]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key !== "Escape") return;

            // If the menu is already open, pressing ESC should close it (resume).
            // Opening the menu is now safely handled by the pointerlockchange event above.
            if (isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isMenuOpen]);

    // ── Pointer lock ──────────────────────────────────────────────────────────
    useEffect(() => {
        isLockedRef.current = isLocked;
    }, [isLocked]);

    useEffect(() => {
        const onChange = () => {
            const locked = !!document.pointerLockElement;

            // FIX: If we were previously locked, and now we are not,
            // the user pressed ESC (or tabbed out). Open the pause menu!
            if (isLockedRef.current && !locked) {
                setIsMenuOpen(true);
            }

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

    // Tab / window close to ensure player leaves the room
    useEffect(() => {
        const handleBeforeUnload = () => {
            leaveRoom();
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [leaveRoom]);

    // Browser back button and direct URL navigation away from the room should also trigger leave
    useEffect(() => {
        const handlePopState = () => {
            leaveRoom();
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [leaveRoom]);

    // React Router navigation blocker to catch in-app route changes away from the room
    useBlocker(({ currentLocation, nextLocation }) => {
        if (currentLocation.pathname !== nextLocation.pathname) {
            leaveRoom();
        }
        return false; // always allow navigation
    });

    const { activeSpeakers } = usePushToTalk({
        token: voiceToken,
        url: voiceUrl,
        enabled: !!voiceToken && !!voiceUrl,
    }) || { activeSpeakers: [] };

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

                <CameraFollow
                    target={localAvatarRef}
                    isPointerLocked={isLockedRef}
                />

                {players.map((p) => (
                    <AvatarErrorBoundary
                        key={p.id}
                        fallback={
                            <Suspense fallback={<Loader />}>
                                <PlayerAvatar
                                    player={{
                                        ...p,
                                        avatarUrl: "/default_avatar.glb",
                                    }}
                                    avatarRef={
                                        p.isLocal ? localAvatarRef : undefined
                                    }
                                    connection={connectionRef.current}
                                    remoteTargetsRef={remoteTargetsRef}
                                    groupId={groupId}
                                />
                            </Suspense>
                        }
                    >
                        <Suspense fallback={<Loader />}>
                            <PlayerAvatar
                                player={p}
                                avatarRef={
                                    p.isLocal ? localAvatarRef : undefined
                                }
                                connection={connectionRef.current}
                                remoteTargetsRef={remoteTargetsRef}
                                groupId={groupId}
                            />
                        </Suspense>
                    </AvatarErrorBoundary>
                ))}
            </Canvas>

            <HUD
                message={message}
                onRequestPointerLock={requestPointerLock}
                isLocked={isLocked}
                isMenuOpen={isMenuOpen}
                activeSpeakers={activeSpeakers}
            />

            {isMenuOpen && (
                <EscMenu
                    onResume={() => {
                        setIsMenuOpen(false);
                        requestPointerLock();
                    }}
                    onLeave={() => {
                        leaveRoom();
                        navigate(`/tribes/${groupId}`, { replace: true });
                    }}
                />
            )}
        </div>
    );
}
