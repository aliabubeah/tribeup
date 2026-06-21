/* eslint-disable react/no-unknown-property */
import * as THREE from "three";
import { useGLTF, useAnimations, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { cameraState } from "./VirtualRoom";

// ── Input state ───────────────────────────────────────────────────────────────
const keys = { current: { w: false, a: false, s: false, d: false } };

// ── Movement constants ────────────────────────────────────────────────────────
const MAX_SPEED = 0.06;
const ACCELERATION = 0.01;
const FRICTION = 0.85;

// ── Room wall boundaries ──────────────────────────────────────────────────────
const WALL_X = 11.2;
const WALL_Z_MIN = -18.8;
const WALL_Z_MAX = 7.2;

// ── Tier elevation map ────────────────────────────────────────────────────────
const TIERS = [
    { zMin: -3.4, zMax: 0.0,  y: 0.0  },
    { zMin: -4.8, zMax: -3.4, y: 0.35 },
    { zMin: -6.2, zMax: -4.8, y: 0.7  },
    { zMin: -7.6, zMax: -6.2, y: 1.05 },
    { zMin: -9.0, zMax: -7.6, y: 1.4  },
];
const STAGE_Y     = 0.4;
const STAGE_Z_MIN = 1.0;

// ── Seat-zone blocking ────────────────────────────────────────────────────────
const SEAT_ZONE_X_MIN = 1.5;
const SEAT_ZONE_X_MAX = 5.5;
const SEAT_ZONE_Z_MIN = -9.0;
const SEAT_ZONE_Z_MAX = -1.8;

function isInSeatZone(x, z) {
    if (z < SEAT_ZONE_Z_MIN || z > SEAT_ZONE_Z_MAX) return false;
    const ax = Math.abs(x);
    return ax >= SEAT_ZONE_X_MIN && ax <= SEAT_ZONE_X_MAX;
}

function getFloorY(x, z) {
    if (z > STAGE_Z_MIN) return STAGE_Y;
    for (const tier of TIERS) {
        if (z >= tier.zMin && z < tier.zMax) return tier.y;
    }
    return 0;
}

export default function PlayerAvatar({
    position = [0, 0, 0],
    avatarRef,          // only passed for the local player
    player,
    connection,         // SignalR HubConnection (may be null on first render)
    remoteTargetsRef,   // { [userId]: { position, rotationY } }
    groupId,
}) {
    // Every avatar (local AND remote) needs its own group ref for Three.js
    const internalRef = useRef();
    const ref = avatarRef || internalRef;

    const velocity = useRef({ x: 0, z: 0 });
    const currentY = useRef(0);

    // Keep a stable ref to the connection so useFrame never captures a stale value
    const connectionRef = useRef(connection);
    useEffect(() => {
        connectionRef.current = connection;
    }, [connection]);

    // ── Keyboard (only wired once; all instances share the module-level `keys`) ─
    useEffect(() => {
        if (!player.isLocal) return;          // only the local player reads keys
        const down = (e) => {
            const k = e.key.toLowerCase();
            if (k in keys.current) keys.current[k] = true;
        };
        const up = (e) => {
            const k = e.key.toLowerCase();
            if (k in keys.current) keys.current[k] = false;
        };
        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);
        return () => {
            window.removeEventListener("keydown", down);
            window.removeEventListener("keyup", up);
        };
    }, [player.isLocal]);

    // ── Load assets ───────────────────────────────────────────────────────────
    const avatarGLB = useGLTF(player.avatarUrl);
    const idleGLB   = useGLTF("/idle.glb");
    const walkGLB   = useGLTF("/walk.glb");
    const scene     = avatarGLB.scene;

    const { actions } = useAnimations(
        [...idleGLB.animations, ...walkGLB.animations],
        ref,
    );

    // Start idle on mount
    useEffect(() => {
        if (!actions) return;
        const idle = actions["IdleV4.2(maya_head)"];
        if (idle) idle.reset().play();
    }, [actions]);

    // Last broadcast position — avoids flooding the hub when standing still
    const lastBroadcastRef = useRef({ x: 0, z: 0 });

    // ── Per-frame logic ───────────────────────────────────────────────────────
    useFrame((_, delta) => {
        if (!ref.current) return;

        // Walk clip name from Mixamo FBX→GLB conversion is "mixamo.com"
        const idle = actions?.["IdleV4.2(maya_head)"];
        const walk = actions?.["mixamo.com"];

        if (player.isLocal) {
            // ── Input → direction ──────────────────────────────────────────
            let inputX = 0, inputZ = 0;
            if (keys.current.w) { inputX -= Math.sin(cameraState.yaw); inputZ -= Math.cos(cameraState.yaw); }
            if (keys.current.s) { inputX += Math.sin(cameraState.yaw); inputZ += Math.cos(cameraState.yaw); }
            if (keys.current.a) { inputX -= Math.sin(cameraState.yaw + Math.PI / 2); inputZ -= Math.cos(cameraState.yaw + Math.PI / 2); }
            if (keys.current.d) { inputX += Math.sin(cameraState.yaw + Math.PI / 2); inputZ += Math.cos(cameraState.yaw + Math.PI / 2); }

            const hasInput = inputX !== 0 || inputZ !== 0;
            if (hasInput) {
                const len = Math.sqrt(inputX * inputX + inputZ * inputZ);
                inputX /= len;
                inputZ /= len;
                velocity.current.x += inputX * ACCELERATION;
                velocity.current.z += inputZ * ACCELERATION;
                const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.z ** 2);
                if (speed > MAX_SPEED) {
                    velocity.current.x *= MAX_SPEED / speed;
                    velocity.current.z *= MAX_SPEED / speed;
                }
            } else {
                velocity.current.x *= FRICTION;
                velocity.current.z *= FRICTION;
            }

            const vx = velocity.current.x;
            const vz = velocity.current.z;
            const moving = Math.abs(vx) > 0.001 || Math.abs(vz) > 0.001;

            // ── Animations ────────────────────────────────────────────────
            if (idle && walk) {
                if (moving && !walk.isRunning()) {
                    idle.fadeOut(0.2);
                    walk.reset().fadeIn(0.2).play();
                }
                if (!moving && !idle.isRunning()) {
                    walk.fadeOut(0.2);
                    idle.reset().fadeIn(0.2).play();
                }
            }

            // ── Position update ───────────────────────────────────────────
            if (moving) {
                const cur = ref.current.position;
                let newX = cur.x + vx;
                let newZ = cur.z + vz;

                newX = Math.max(-WALL_X, Math.min(WALL_X, newX));
                newZ = Math.max(WALL_Z_MIN, Math.min(WALL_Z_MAX, newZ));

                const blockedX = isInSeatZone(newX, cur.z);
                const blockedZ = isInSeatZone(cur.x, newZ);

                if (!blockedX) { ref.current.position.x = newX; } else { velocity.current.x = 0; }
                if (!blockedZ) { ref.current.position.z = newZ; } else { velocity.current.z = 0; }

                const targetY = getFloorY(ref.current.position.x, ref.current.position.z);
                currentY.current += (targetY - currentY.current) * Math.min(1, delta * 12);
                ref.current.position.y = currentY.current;

                ref.current.rotation.y = Math.atan2(vx, vz) + Math.PI;
            } else {
                const targetY = getFloorY(ref.current.position.x, ref.current.position.z);
                currentY.current += (targetY - currentY.current) * Math.min(1, delta * 12);
                ref.current.position.y = currentY.current;
            }

            // ── Broadcast to hub ──────────────────────────────────────────
            const conn = connectionRef.current;
            const pos  = ref.current.position;
            const rot  = ref.current.rotation.y;

            const distMoved =
                Math.abs(pos.x - lastBroadcastRef.current.x) +
                Math.abs(pos.z - lastBroadcastRef.current.z);

            if (distMoved > 0.05 && conn && conn.state === "Connected") {
                conn
                    .invoke("Move", groupId, player.id, [pos.x, pos.y, pos.z], rot)
                    .catch((err) => console.error("Move Error:", err));

                lastBroadcastRef.current = { x: pos.x, z: pos.z };
            }
        } else {
            // ── Lerp remote players toward their latest server position ────
            const targetData = remoteTargetsRef?.current?.[player.id];
            if (!targetData?.position) return;

            const [targetX, targetY, targetZ] = targetData.position;
            const targetRot = targetData.rotationY;

            ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, targetX, delta * 10);
            ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetY, delta * 10);
            ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, targetZ, delta * 10);

            // Shortest-path rotation lerp
            let rotDiff = targetRot - ref.current.rotation.y;
            if (rotDiff >  Math.PI) ref.current.rotation.y += Math.PI * 2;
            if (rotDiff < -Math.PI) ref.current.rotation.y -= Math.PI * 2;
            ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetRot, delta * 12);

            // ── Walk / idle for remote players based on movement delta ─────
            if (idle && walk) {
                const dx = Math.abs(ref.current.position.x - targetX);
                const dz = Math.abs(ref.current.position.z - targetZ);
                const remoteMoving = dx + dz > 0.01;

                if (remoteMoving && !walk.isRunning()) {
                    idle.fadeOut(0.2);
                    walk.reset().fadeIn(0.2).play();
                }
                if (!remoteMoving && !idle.isRunning()) {
                    walk.fadeOut(0.2);
                    idle.reset().fadeIn(0.2).play();
                }
            }
        }
    });

    return (
        <group ref={ref} position={player.position}>
            <Html
                position={[0, 2, 0]}
                center
                distanceFactor={8}
                zIndexRange={[100, 0]}
            >
                <div className="pointer-events-none select-none whitespace-nowrap rounded bg-black/60 px-2 py-1 text-[8px] font-semibold tracking-tight text-white">
                    {player.username}
                </div>
            </Html>

            <primitive
                object={scene}
                position={position}
                rotation={[0, Math.PI, 0]}
                scale={1}
                castShadow
            />
        </group>
    );
}

useGLTF.preload("/default_avatar.glb");
