/* eslint-disable react/no-unknown-property */

/**
 * LectureHall.jsx
 * ─────────────────────────────────────────────────────────
 * Drop this file into:  src/features/virtualRoom/LectureHall.jsx
 *
 * A fully procedural computer-science lecture hall built from
 * R3F box/plane geometry — no external assets needed.
 *
 * Layout (bird's-eye view, Z = depth into screen)
 *
 *   ┌────────────────────────────────────────┐  Z = -20 (back wall)
 *   │  [win] [win] [win]  back wall  [win]   │
 *   │  ┌──┐  ┌──┐  ┌──┐  ┌──┐  ┌──┐         │  tiered seats (5 rows)
 *   │  └──┘  └──┘  └──┘  └──┘  └──┘         │
 *   │                aisle floor             │
 *   │        ┌─────────────┐                 │
 *   │        │   podium    │   stage         │
 *   └────────────────────────────────────────┘  Z = +8  (front wall)
 *
 *   X: -12 (left wall) → +12 (right wall)
 *   Y:  0  (floor)     →  6  (ceiling)
 */

// ─── Palette ─────────────────────────────────────────────
const C = {
    floor:      "#c8bfb0",   // warm concrete
    floorAisle: "#b5aa99",   // slightly darker aisle strip
    wall:       "#ddd8cf",   // off-white walls
    ceiling:    "#e8e4de",   // slightly lighter ceiling
    stage:      "#a0855a",   // warm wood stage
    seatBack:   "#1a3a5c",   // dark-blue seat back
    seatCush:   "#1e4976",   // medium-blue cushion
    desk:       "#8b6e45",   // wood desk
    podium:     "#6b4e2a",   // darker wood podium
    windowPane: "#aed6f1",   // light-blue glass
    windowFrame:"#9e9e9e",   // grey frame
    board:      "#1a2a1a",   // near-black chalkboard
    boardFrame: "#5a3a1a",   // brown frame
    trim:       "#bbb5aa",   // skirting / trim
    stepRiser:  "#b8af9f",   // step riser faces
};

// ─── Tiny helpers ─────────────────────────────────────────
function Box({ pos, size, color, receiveShadow = true, castShadow = false }) {
    return (
        <mesh position={pos} receiveShadow={receiveShadow} castShadow={castShadow}>
            <boxGeometry args={size} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
}

// ─── Floor ────────────────────────────────────────────────
function Floor() {
    return (
        <>
            {/* Main floor slab */}
            <Box pos={[0, -0.05, -6]}  size={[24, 0.1, 28]} color={C.floor} />
            {/* Aisle strip down the centre */}
            <Box pos={[0, -0.04, -4]}  size={[2.4, 0.02, 20]} color={C.floorAisle} />
        </>
    );
}

// ─── Walls ────────────────────────────────────────────────
function Walls() {
    return (
        <>
            {/* Back wall */}
            <Box pos={[0,   3, -20]}  size={[24, 6, 0.3]} color={C.wall} />
            {/* Front wall */}
            <Box pos={[0,   3,  8]}   size={[24, 6, 0.3]} color={C.wall} />
            {/* Left wall */}
            <Box pos={[-12, 3, -6]}   size={[0.3, 6, 28]} color={C.wall} />
            {/* Right wall */}
            <Box pos={[12,  3, -6]}   size={[0.3, 6, 28]} color={C.wall} />
            {/* Ceiling */}
            <Box pos={[0,   6.05, -6]} size={[24, 0.1, 28]} color={C.ceiling} />
            {/* Floor-level skirting trim */}
            <Box pos={[0,    0.05, -19.85]} size={[23.4, 0.1, 0.1]} color={C.trim} />
            <Box pos={[-11.85, 0.05, -6]}   size={[0.1, 0.1, 27.6]} color={C.trim} />
            <Box pos={[11.85,  0.05, -6]}   size={[0.1, 0.1, 27.6]} color={C.trim} />
        </>
    );
}

// ─── Windows (back wall) ──────────────────────────────────
function Windows() {
    // 4 evenly spaced windows on the back wall
    const xPositions = [-8, -3, 3, 8];
    return (
        <group>
            {xPositions.map((x) => (
                <group key={x}>
                    {/* Outer frame */}
                    <Box pos={[x, 3.5, -19.84]} size={[2.4, 2.4, 0.08]} color={C.windowFrame} />
                    {/* Glass pane (slightly in front of frame) */}
                    <Box pos={[x, 3.5, -19.79]} size={[2.0, 2.0, 0.04]} color={C.windowPane} />
                    {/* Horizontal divider */}
                    <Box pos={[x, 3.5, -19.76]} size={[2.0, 0.06, 0.06]} color={C.windowFrame} />
                    {/* Vertical divider */}
                    <Box pos={[x, 3.5, -19.76]} size={[0.06, 2.0, 0.06]} color={C.windowFrame} />
                </group>
            ))}
        </group>
    );
}

// ─── Chalkboard / Whiteboard (front wall) ─────────────────
function Board() {
    return (
        <group>
            {/* Frame */}
            <Box pos={[0, 3.2, 7.82]} size={[8.4, 2.8, 0.08]} color={C.boardFrame} />
            {/* Board surface */}
            <Box pos={[0, 3.2, 7.87]} size={[8.0, 2.4, 0.04]} color={C.board} />
            {/* Chalk tray */}
            <Box pos={[0, 2.1, 7.92]} size={[8.0, 0.1, 0.12]} color={C.boardFrame} />
        </group>
    );
}

// ─── Stage ────────────────────────────────────────────────
function Stage() {
    return (
        <group>
            {/* Stage platform */}
            <Box pos={[0, 0.2, 4.5]}  size={[20, 0.4, 7]} color={C.stage} castShadow />
            {/* Stage front fascia */}
            <Box pos={[0, 0.1, 8.0]}  size={[20, 0.2, 0.1]} color={C.podium} />
            {/* Step up to stage — left side */}
            <Box pos={[-8, 0.1, 1.3]} size={[2, 0.2, 0.6]}  color={C.stepRiser} />
            {/* Step up to stage — right side */}
            <Box pos={[8,  0.1, 1.3]} size={[2, 0.2, 0.6]}  color={C.stepRiser} />
        </group>
    );
}

// ─── Podium ───────────────────────────────────────────────
function Podium() {
    return (
        <group position={[0, 0.4, 5.5]}>
            {/* Base */}
            <Box pos={[0, 0,    0]}  size={[1.0, 0.8, 0.6]} color={C.podium}  castShadow />
            {/* Top surface / lectern */}
            <Box pos={[0, 0.45, 0.05]} size={[0.9, 0.05, 0.5]} color={C.desk} castShadow />
            {/* Front panel accent */}
            <Box pos={[0, 0.1, 0.31]} size={[0.8, 0.4, 0.02]} color={C.seatBack} />
        </group>
    );
}

// ─── One seat (back + cushion + desk) ─────────────────────
function Seat({ position }) {
    const [x, y, z] = position;
    return (
        <group>
            {/* Seat cushion */}
            <Box
                pos={[x, y + 0.25, z]}
                size={[0.55, 0.08, 0.5]}
                color={C.seatCush}
                castShadow
            />
            {/* Seat back */}
            <Box
                pos={[x, y + 0.65, z - 0.22]}
                size={[0.55, 0.7, 0.07]}
                color={C.seatBack}
                castShadow
            />
            {/* Left armrest */}
            <Box pos={[x - 0.3, y + 0.37, z]} size={[0.06, 0.06, 0.5]} color={C.desk} />
            {/* Right armrest */}
            <Box pos={[x + 0.3, y + 0.37, z]} size={[0.06, 0.06, 0.5]} color={C.desk} />
            {/* Desk (folds out to the right in real life; here always open) */}
            <Box
                pos={[x + 0.55, y + 0.52, z + 0.1]}
                size={[0.5, 0.04, 0.36]}
                color={C.desk}
                castShadow
            />
        </group>
    );
}

// ─── Tiered seating block ─────────────────────────────────
/**
 * 5 rows × 8 seats per row.
 * Each row steps UP by 0.35 m and BACK by 1.2 m to create the
 * lecture-hall tier effect.
 *
 * Row 0 (front):  y = 0,     z = -2
 * Row 4 (back):   y = 1.4,   z = -6.8
 *
 * The riser (step face) for each row is a thin box between rows.
 */
function TieredSeating() {
    const ROWS         = 5;
    const SEATS_PER_ROW = 8;
    const ROW_STEP_Z   = -1.4;   // how far back each row is
    const ROW_STEP_Y   =  0.35;  // how much higher each row is
    const SEAT_SPACING =  1.4;   // horizontal gap between seats (centre-to-centre)
    const START_Z      = -2.0;
    const START_Y      =  0.0;

    // Total seat row width so we can centre them
    const totalWidth = (SEATS_PER_ROW - 1) * SEAT_SPACING;
    const startX     = -totalWidth / 2;

    return (
        <group>
            {Array.from({ length: ROWS }, (_, row) => {
                const rowY = START_Y + row * ROW_STEP_Y;
                const rowZ = START_Z + row * ROW_STEP_Z;

                return (
                    <group key={row}>
                        {/* Tier platform (the floor slab this row sits on) */}
                        <Box
                            pos={[0, rowY - 0.01, rowZ]}
                            size={[24, 0.1, Math.abs(ROW_STEP_Z) + 0.2]}
                            color={C.floor}
                        />

                        {/* Riser face (vertical face between tiers) */}
                        {row > 0 && (
                            <Box
                                pos={[0, rowY - ROW_STEP_Y / 2 - 0.01, rowZ - Math.abs(ROW_STEP_Z) / 2 + 0.05]}
                                size={[24, ROW_STEP_Y, 0.12]}
                                color={C.stepRiser}
                            />
                        )}

                        {/* Seats for this row */}
                        {Array.from({ length: SEATS_PER_ROW }, (_, col) => {
                            const seatX = startX + col * SEAT_SPACING;
                            return (
                                <Seat
                                    key={col}
                                    position={[seatX, rowY, rowZ]}
                                />
                            );
                        })}
                    </group>
                );
            })}
        </group>
    );
}

// ─── Ceiling lights ───────────────────────────────────────
function CeilingLights() {
    // 3 × 2 grid of recessed light panels
    const positions = [
        [-6, -3], [0, -3], [6, -3],
        [-6, -10], [0, -10], [6, -10],
    ];
    return (
        <group>
            {positions.map(([x, z], i) => (
                <group key={i}>
                    {/* Housing */}
                    <Box pos={[x, 5.96, z]} size={[1.6, 0.04, 0.7]} color="#ccc" />
                    {/* Emissive panel */}
                    <mesh position={[x, 5.94, z]}>
                        <boxGeometry args={[1.4, 0.01, 0.6]} />
                        <meshStandardMaterial color="#fffde7" emissive="#fffde7" emissiveIntensity={0.8} />
                    </mesh>
                    {/* Actual point light */}
                    <pointLight
                        position={[x, 5.8, z]}
                        intensity={8}
                        distance={12}
                        decay={2}
                        color="#fff9e6"
                    />
                </group>
            ))}
        </group>
    );
}

// ─── Main export ──────────────────────────────────────────
export default function LectureHall() {
    return (
        <group>
            <Floor />
            <Walls />
            <Windows />
            <Board />
            <Stage />
            <Podium />
            <TieredSeating />
            <CeilingLights />
        </group>
    );
}
