/* eslint-disable react/no-unknown-property */
/**
 * SlidePresenter.jsx
 * Renders PDF slides onto the lecture-hall board via a Three.js CanvasTexture.
 * Uses pdf.js v3 UMD build — stable worker string URL.
 */

import * as THREE from "three";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

const BOARD = {
    w: 9.6, h: 5.4,
    cx: 0, cy: 3.1, cz: 7.80,
    frameW: 10.0, frameH: 5.8, frameCY: 3.1, frameCZ: 7.85,
    trayY: 0.2, trayCZ: 7.92,
};

const PDFJS_CDN  = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const WORKER_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
const TEX_W = 2560, TEX_H = 1440;

export default function SlidePresenter({ currentSlide = 0, pdfUrl = null, onTotalPages }) {
    const { gl } = useThree();           // WebGLRenderer — needed to pre-upload texture
    const boardMeshRef = useRef(null);
    const pdfDocRef    = useRef(null);
    const pdfjsRef     = useRef(null);
    const dirtyRef     = useRef(false);

    // These are created once and live for the component lifetime
    const canvasRef    = useRef(null);
    const textureRef   = useRef(null);
    const materialRef  = useRef(null);

    // ── 1. Create canvas + texture + material imperatively on mount ───────────
    // All Three.js objects are owned here. We never declare <meshStandardMaterial>
    // in JSX for the board mesh so R3F's reconciler never touches its material.
    if (!canvasRef.current) {
        // Run synchronously on first render — before any useEffect
        const canvas = document.createElement("canvas");
        canvas.width  = TEX_W;
        canvas.height = TEX_H;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#1a2a1a";
        ctx.fillRect(0, 0, TEX_W, TEX_H);
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        ctx.font = "bold 38px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Load a PDF to start presenting", TEX_W / 2, TEX_H / 2);
        canvasRef.current = canvas;

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        
        
        texture.anisotropy = gl.capabilities.getMaxAnisotropy();
        texture.minFilter = THREE.LinearFilter; 
        
        textureRef.current = texture;

        materialRef.current = new THREE.MeshStandardMaterial({
            map: texture,
            color: 0xffffff,
            roughness: 0.85,
            metalness: 0.0,
        });
    }

    // ── 2. Assign our material to the mesh after every R3F reconciliation ─────
    // useLayoutEffect runs synchronously after R3F's reconciler finishes,
    // so we always win — our material is the last write to mesh.material.
    useLayoutEffect(() => {
        if (boardMeshRef.current && materialRef.current) {
            boardMeshRef.current.material = materialRef.current;
        }
    });

    // ── 3. Dispose on unmount ─────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            textureRef.current?.dispose();
            materialRef.current?.dispose();
        };
    }, []);

    // ── 4. Load pdf.js v3 UMD via script tag ──────────────────────────────────
    useEffect(() => {
        if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_CDN;
            pdfjsRef.current = window.pdfjsLib;
            return;
        }
        const script = document.createElement("script");
        script.src = PDFJS_CDN;
        script.onload = () => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_CDN;
            pdfjsRef.current = window.pdfjsLib;
        };
        document.head.appendChild(script);
    }, []);

    // ── 5. Load PDF when URL changes ──────────────────────────────────────────
    useEffect(() => {
        if (!pdfUrl) return;
        let cancelled = false;

        async function load() {
            let tries = 0;
            while (!pdfjsRef.current && tries++ < 40) {
                await new Promise(r => setTimeout(r, 250));
            }
            if (!pdfjsRef.current || cancelled) return;

            try {
                const CMAP_URL = "https://unpkg.com/pdfjs-dist@3.11.174/cmaps/";
                const STANDARD_FONTS_URL = "https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/";
                
                const doc = await pdfjsRef.current.getDocument({ 
                    url: pdfUrl, 
                    useWorkerFetch: false,
                    cMapUrl: CMAP_URL,
                    cMapPacked: true,
                    standardFontDataUrl: STANDARD_FONTS_URL // <--- ADD THIS
                }).promise;
                
                if (cancelled) return;
                pdfDocRef.current = doc;
                onTotalPages?.(doc.numPages);
                renderPage(0, doc);
            } catch (err) {
                console.error("SlidePresenter: PDF load error", err);
            }
        }
        load();
        return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pdfUrl]);

    // ── 6. Render a PDF page onto the canvas ──────────────────────────────────
    function renderPage(index, doc) {
        const d = doc ?? pdfDocRef.current;
        if (!d) return;
        const pageNum = Math.max(1, Math.min(index + 1, d.numPages));

        d.getPage(pageNum).then(page => {
            const vp    = page.getViewport({ scale: 1 });
            const scale = Math.min(TEX_W / vp.width, TEX_H / vp.height);
            const sv    = page.getViewport({ scale });
            const canvas = canvasRef.current;
            const ctx    = canvas.getContext("2d");
            const ox = (TEX_W - sv.width)  / 2;
            const oy = (TEX_H - sv.height) / 2;

            ctx.fillStyle = "#111";
            ctx.fillRect(0, 0, TEX_W, TEX_H);

            return page.render({ canvasContext: ctx, viewport: sv, transform: [1, 0, 0, 1, ox, oy] }).promise;
        }).then(() => {
            // Pre-upload to GPU immediately rather than waiting for next frame
            if (textureRef.current && materialRef.current) {
                textureRef.current.needsUpdate = true;
                gl.initTexture(textureRef.current);
            }
            dirtyRef.current = true;
        }).catch(err => console.error("SlidePresenter: page render error", err));
    }

    // ── 7. Re-render when slide index changes ─────────────────────────────────
    useEffect(() => {
        if (pdfDocRef.current) renderPage(currentSlide);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSlide]);

    // ── 8. Keep texture fresh each frame if dirty ─────────────────────────────
    useFrame(() => {
        if (dirtyRef.current && textureRef.current) {
            textureRef.current.needsUpdate = true;
            dirtyRef.current = false;
        }
    });

    return (
        <group>
            {/* Board frame */}
            <mesh position={[BOARD.cx, BOARD.frameCY, BOARD.frameCZ]}>
                <boxGeometry args={[BOARD.frameW, BOARD.frameH, 0.08]} />
                <meshStandardMaterial color="#5a3a1a" />
            </mesh>

            {/* Board surface — NO <meshStandardMaterial> here on purpose.
                Our imperative material (materialRef) is assigned in useLayoutEffect
                AFTER R3F reconciles, so it always wins. */}
            <mesh ref={boardMeshRef} position={[BOARD.cx, BOARD.cy, BOARD.cz]}>
                <boxGeometry args={[BOARD.w, BOARD.h, 0.04]} />
            </mesh>

            {/* Chalk tray */}
            <mesh position={[BOARD.cx, BOARD.trayY, BOARD.trayCZ]}>
                <boxGeometry args={[BOARD.w, 0.1, 0.12]} />
                <meshStandardMaterial color="#5a3a1a" />
            </mesh>
        </group>
    );
}
