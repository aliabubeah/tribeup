/* eslint-disable react/no-unknown-property */
import * as THREE from "three";
import { useGLTF, useAnimations, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useMemo, useCallback } from "react";
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
    { zMin: -3.4, zMax: 0.0, y: 0.0 },
    { zMin: -4.8, zMax: -3.4, y: 0.35 },
    { zMin: -6.2, zMax: -4.8, y: 0.7 },
    { zMin: -7.6, zMax: -6.2, y: 1.05 },
    { zMin: -9.0, zMax: -7.6, y: 1.4 },
];
const STAGE_Y = 0.4;
const STAGE_Z_MIN = 1.0;

// ── Seat-zone blocking ────────────────────────────────────────────────────────
// All 8 seat columns span |x| = 0.70 to 4.90 (spacing 1.4, start -4.9).
// The previous code had SEAT_ZONE_X_MIN=1.5 which skipped the two centre
// columns at |x|=0.70, letting the player walk through them.
// Fix: block the full-width band — no inner minimum, outer edge at 5.2.
const SEAT_ZONE_X_MAX = 5.2;
const SEAT_ZONE_Z_MIN = -9.0;
const SEAT_ZONE_Z_MAX = -1.8;

function isInSeatZone(x, z) {
    if (z < SEAT_ZONE_Z_MIN || z > SEAT_ZONE_Z_MAX) return false;
    return Math.abs(x) <= SEAT_ZONE_X_MAX;
}

function getFloorY(x, z) {
    if (z > STAGE_Z_MIN) return STAGE_Y;
    for (const tier of TIERS) {
        if (z >= tier.zMin && z < tier.zMax) return tier.y;
    }
    return 0;
}

// ── Seat world positions (mirrors LectureHall TieredSeating constants) ───────
// 5 rows × 8 seats; must stay in sync with LectureHall.jsx layout values.
const SEAT_ROWS = 5;
const SEATS_PER_ROW = 8;
const ROW_STEP_Z_S = -1.4;
const SEAT_SPACING_S = 1.4;
const TIER_START_Z = -2.0;
const TIER_START_X = -((SEATS_PER_ROW - 1) * SEAT_SPACING_S) / 2;

const SEAT_POSITIONS = [];
for (let row = 0; row < SEAT_ROWS; row++) {
    const z = TIER_START_Z + row * ROW_STEP_Z_S;
    for (let col = 0; col < SEATS_PER_ROW; col++) {
        const x = TIER_START_X + col * SEAT_SPACING_S;
        SEAT_POSITIONS.push({ x, z });
    }
}

const SIT_PROXIMITY = 1.2; // metres — must be within this distance to sit

function isNearAnySeat(px, pz) {
    for (const seat of SEAT_POSITIONS) {
        const dx = px - seat.x;
        const dz = pz - seat.z;
        if (Math.sqrt(dx * dx + dz * dz) < SIT_PROXIMITY) return true;
    }
    return false;
}

// ── Sit state machine ─────────────────────────────────────────────────────────
//   "idle"  → (press F near seat) → "sitting_down"  → (clip ends) → "sitting"
//   "sitting" → (press F) → "standing_up" → (clip ends) → "idle"
//
// Transition timings are driven by clip.duration (not mixer "finished" events).
// sit-down / stand-up MUST have clampWhenFinished=true + LoopOnce so Three.js
// holds the final frame instead of snapping back to the bind pose.

export default function PlayerAvatar({
    position = [0, 0, 0],
    avatarRef,
    player,
    connection,
    remoteTargetsRef,
    groupId,
}) {
    const internalRef = useRef();
    const ref = avatarRef || internalRef;

    const velocity = useRef({ x: 0, z: 0 });
    const currentY = useRef(0);
    const sitState = useRef("idle"); // "idle" | "sitting_down" | "sitting" | "standing_up"
    const sitTimer = useRef(null); // setTimeout handle for transition

    const connectionRef = useRef(connection);
    useEffect(() => {
        connectionRef.current = connection;
    }, [connection]);

    // ── Keyboard ──────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!player.isLocal) return;
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
    const idleGLB = useGLTF("/idle.glb");
    const walkGLB = useGLTF("/walk.glb");
    const sitDownGLB = useGLTF("/sit-down.glb");
    const standUpGLB = useGLTF("/stand-up.glb");
    const scene = avatarGLB.scene;

    // Clone each clip and give it a unique name.
    // We must NOT mutate the arrays returned by useGLTF (linter rule: react-hooks/immutability).
    // clone() is cheap — it shares the underlying typed-array buffer.
    const clips = useMemo(() => {
        const rename = (clip, name) => {
            const c = clip.clone();
            c.name = name;
            return c;
        };
        return [
            ...(idleGLB.animations[0]
                ? [rename(idleGLB.animations[0], "idle")]
                : []),
            ...(walkGLB.animations[0]
                ? [rename(walkGLB.animations[0], "walk")]
                : []),
            ...(sitDownGLB.animations[0]
                ? [rename(sitDownGLB.animations[0], "sit-down")]
                : []),
            ...(standUpGLB.animations[0]
                ? [rename(standUpGLB.animations[0], "stand-up")]
                : []),
        ];
    }, [
        idleGLB.animations,
        walkGLB.animations,
        sitDownGLB.animations,
        standUpGLB.animations,
    ]);

    const { actions, mixer } = useAnimations(clips, ref);

    // ── Configure sit/stand actions via mixer ────────────────────────────────
    // `actions` is immutable per react-hooks/immutability — we must never write
    // to actions[x].prop directly.  mixer.clipAction(clip) returns the same
    // cached AnimationAction instance without going through the hook return value,
    // so writing to the local `action` variable is linter-safe.
    useEffect(() => {
        if (!mixer || !clips.length) return;
        actions?.idle?.reset().play();
        for (const clip of clips) {
            if (clip.name === "sit-down" || clip.name === "stand-up") {
                const action = mixer.clipAction(clip);
                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;
            }
        }
    }, [mixer, clips, actions]);

    // ── Broadcast helper (declared before the F-key useEffect that calls it) ──
    const broadcastSit = useCallback(
        (isSitting) => {
            const conn = connectionRef.current;
            if (conn?.state === "Connected") {
                conn.invoke("Sit", groupId, player.id, isSitting).catch((err) =>
                    console.error("Sit Error:", err),
                );
            }
        },
        [groupId, player.id],
    );

    // ── F key: toggle sit / stand ─────────────────────────────────────────────
    useEffect(() => {
        if (!player.isLocal) return;

        const handleKeyDown = (e) => {
            if (e.key.toLowerCase() !== "f") return;
            if (!actions) return;

            const {
                idle,
                walk,
                "sit-down": sitDown,
                "stand-up": standUp,
            } = actions;
            const state = sitState.current;

            if (state === "idle") {
                // ── Bug fix 1: only allow sitting near an actual seat ──────
                const pos = ref.current?.position;
                if (!pos || !isNearAnySeat(pos.x, pos.z)) return;

                clearTimeout(sitTimer.current);

                // Snap to the nearest seat's exact position and face the stage.
                // This must happen before the animation plays so the avatar
                // doesn't sit at a random offset or wrong angle.
                const nearest = SEAT_POSITIONS.reduce(
                    (best, seat) => {
                        const dx = pos.x - seat.x;
                        const dz = pos.z - seat.z;
                        const d = dx * dx + dz * dz;
                        return d < best.d ? { seat, d } : best;
                    },
                    { seat: null, d: Infinity },
                ).seat;

                if (nearest && ref.current) {
                    ref.current.position.x = nearest.x;
                    // +0.2 shifts the avatar root slightly toward the stage so the
                    // sit-down animation lands the hips centred on the cushion.
                    // The cushion centre is at nearest.z; the seat back is at
                    // nearest.z - 0.22, so without the offset the avatar sits
                    // too far into the back rest.
                    ref.current.position.z = nearest.z + 0.40;
                    // rotation.y = PI → mesh (which has PI baked in) faces +Z = toward stage
                    ref.current.rotation.y = Math.PI;
                    velocity.current.x = 0;
                    velocity.current.z = 0;
                }

                idle?.fadeOut(0.15);
                walk?.fadeOut(0.15);

                sitDown?.reset().fadeIn(0.15).play();
                sitState.current = "sitting_down";

                const dur = (sitDown?.getClip()?.duration ?? 2.233) * 1000;
                sitTimer.current = setTimeout(() => {
                    // Clip is now clamped at its last frame (seated pose).
                    // Do NOT fade to idle here — the clamped sit-down pose IS
                    // the "sitting" visual. useFrame's walk/idle block is
                    // silenced while sitState !== "idle", so nothing fights it.
                    sitState.current = "sitting";
                    broadcastSit(true);
                }, dur);

                broadcastSit(false);
            } else if (state === "sitting") {
                clearTimeout(sitTimer.current);

                // Fade out the clamped sit-down pose and play stand-up
                const sitDown_ = actions["sit-down"];
                sitDown_?.fadeOut(0.15);

                standUp?.reset().fadeIn(0.15).play();
                sitState.current = "standing_up";

                const dur = (standUp?.getClip()?.duration ?? 2.267) * 1000;
                sitTimer.current = setTimeout(() => {
                    // Stand-up clip clamped at final (standing) frame.
                    // Now fade into idle to resume normal locomotion.
                    standUp?.fadeOut(0.2);
                    idle?.reset().fadeIn(0.2).play();
                    sitState.current = "idle";
                    broadcastSit(false);
                }, dur);

                broadcastSit(false);
            }
            // Ignore F during transitions (sitting_down / standing_up)
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            clearTimeout(sitTimer.current);
        };
    }, [actions, broadcastSit, player.isLocal]); // eslint-disable-line react-hooks/exhaustive-deps

    // Last broadcast position ref
    const lastBroadcastRef = useRef({ x: 0, z: 0 });

    // ── Per-frame logic ───────────────────────────────────────────────────────
    useFrame((_, delta) => {
        if (!ref.current) return;

        const idle = actions?.idle;
        const walk = actions?.walk;
        const sitDown = actions?.["sit-down"];
        const standUp = actions?.["stand-up"];

        if (player.isLocal) {
            const isSeated =
                sitState.current === "sitting" ||
                sitState.current === "sitting_down" ||
                sitState.current === "standing_up";

            // ── Input → direction (blocked while seated) ───────────────────
            let inputX = 0,
                inputZ = 0;
            if (!isSeated) {
                if (keys.current.w) {
                    inputX -= Math.sin(cameraState.yaw);
                    inputZ -= Math.cos(cameraState.yaw);
                }
                if (keys.current.s) {
                    inputX += Math.sin(cameraState.yaw);
                    inputZ += Math.cos(cameraState.yaw);
                }
                if (keys.current.a) {
                    inputX -= Math.sin(cameraState.yaw + Math.PI / 2);
                    inputZ -= Math.cos(cameraState.yaw + Math.PI / 2);
                }
                if (keys.current.d) {
                    inputX += Math.sin(cameraState.yaw + Math.PI / 2);
                    inputZ += Math.cos(cameraState.yaw + Math.PI / 2);
                }
            }

            const hasInput = inputX !== 0 || inputZ !== 0;
            if (hasInput) {
                const len = Math.sqrt(inputX * inputX + inputZ * inputZ);
                inputX /= len;
                inputZ /= len;
                velocity.current.x += inputX * ACCELERATION;
                velocity.current.z += inputZ * ACCELERATION;
                const speed = Math.sqrt(
                    velocity.current.x ** 2 + velocity.current.z ** 2,
                );
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

            // ── Walk / idle animation (only when not in sit state machine) ─
            if (sitState.current === "idle" && idle && walk) {
                if (moving && !walk.isRunning()) {
                    idle.fadeOut(0.2);
                    walk.reset().fadeIn(0.2).play();
                }
                if (!moving && !idle.isRunning()) {
                    walk.fadeOut(0.2);
                    idle.reset().fadeIn(0.2).play();
                }
            }

            // ── Position update ────────────────────────────────────────────
            if (moving && !isSeated) {
                const cur = ref.current.position;
                let newX = cur.x + vx;
                let newZ = cur.z + vz;

                newX = Math.max(-WALL_X, Math.min(WALL_X, newX));
                newZ = Math.max(WALL_Z_MIN, Math.min(WALL_Z_MAX, newZ));

                // Only block entry into the seat zone, not movement within it.
                // After standing up the avatar is still at the seat position
                // (inside the zone), so we must allow it to walk out freely.
                const alreadyInZone = isInSeatZone(cur.x, cur.z);
                const blockedX = !alreadyInZone && isInSeatZone(newX, cur.z);
                const blockedZ = !alreadyInZone && isInSeatZone(cur.x, newZ);

                if (!blockedX) {
                    ref.current.position.x = newX;
                } else {
                    velocity.current.x = 0;
                }
                if (!blockedZ) {
                    ref.current.position.z = newZ;
                } else {
                    velocity.current.z = 0;
                }

                const targetY = getFloorY(
                    ref.current.position.x,
                    ref.current.position.z,
                );
                currentY.current +=
                    (targetY - currentY.current) * Math.min(1, delta * 12);
                ref.current.position.y = currentY.current;

                ref.current.rotation.y = Math.atan2(vx, vz) + Math.PI;
            } else {
                const targetY = getFloorY(
                    ref.current.position.x,
                    ref.current.position.z,
                );
                currentY.current +=
                    (targetY - currentY.current) * Math.min(1, delta * 12);
                ref.current.position.y = currentY.current;
            }

            // ── Broadcast position ─────────────────────────────────────────
            const conn = connectionRef.current;
            const pos = ref.current.position;
            const rot = ref.current.rotation.y;

            const distMoved =
                Math.abs(pos.x - lastBroadcastRef.current.x) +
                Math.abs(pos.z - lastBroadcastRef.current.z);

            if (distMoved > 0.05 && conn && conn.state === "Connected") {
                conn.invoke(
                    "Move",
                    groupId,
                    player.id,
                    [pos.x, pos.y, pos.z],
                    rot,
                ).catch((err) => console.error("Move Error:", err));
                lastBroadcastRef.current = { x: pos.x, z: pos.z };
            }
        } else {
            // ── Remote player: lerp toward latest server position ──────────
            const targetData = remoteTargetsRef?.current?.[player.id];
            if (!targetData?.position) return;

            const [targetX, targetY, targetZ] = targetData.position;
            const targetRot = targetData.rotationY;

            ref.current.position.x = THREE.MathUtils.lerp(
                ref.current.position.x,
                targetX,
                delta * 10,
            );
            ref.current.position.y = THREE.MathUtils.lerp(
                ref.current.position.y,
                targetY,
                delta * 10,
            );
            ref.current.position.z = THREE.MathUtils.lerp(
                ref.current.position.z,
                targetZ,
                delta * 10,
            );

            let rotDiff = targetRot - ref.current.rotation.y;
            if (rotDiff > Math.PI) ref.current.rotation.y += Math.PI * 2;
            if (rotDiff < -Math.PI) ref.current.rotation.y -= Math.PI * 2;
            ref.current.rotation.y = THREE.MathUtils.lerp(
                ref.current.rotation.y,
                targetRot,
                delta * 12,
            );

            // ── Remote sit state driven by remoteTargetsRef.isSitting ──────
            const isSitting = targetData.isSitting ?? false;
            const remoteSitState = sitState.current;

            if (isSitting && remoteSitState === "idle") {
                idle?.fadeOut(0.15);
                walk?.fadeOut(0.15);
                sitDown?.reset().fadeIn(0.15).play();
                sitState.current = "sitting_down";

                const dur = (sitDown?.getClip()?.duration ?? 2.233) * 1000;
                sitTimer.current = setTimeout(() => {
                    sitState.current = "sitting";
                }, dur);
            } else if (!isSitting && remoteSitState === "sitting") {
                clearTimeout(sitTimer.current);
                sitDown?.fadeOut(0.15);
                standUp?.reset().fadeIn(0.15).play();
                sitState.current = "standing_up";

                const dur = (standUp?.getClip()?.duration ?? 2.267) * 1000;
                sitTimer.current = setTimeout(() => {
                    standUp?.fadeOut(0.2);
                    idle?.reset().fadeIn(0.2).play();
                    sitState.current = "idle";
                }, dur);
            }

            // ── Walk / idle for remote (movement delta) ────────────────────
            if (sitState.current === "idle" && idle && walk) {
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
useGLTF.preload("/sit-down.glb");
useGLTF.preload("/stand-up.glb");
