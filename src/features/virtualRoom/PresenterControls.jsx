/**
 * PresenterControls.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Drop into: src/features/virtualRoom/PresenterControls.jsx
 *
 * A floating HUD that appears only when:
 *   (a) a PDF has been loaded, AND
 *   (b) the local avatar is on the stage (z > STAGE_Z_MIN)
 *
 * For the audience (not on stage) a minimal "Slides: N / T" indicator
 * appears at the top-right so everyone knows what slide is active.
 *
 * Props:
 *   currentSlide  {number}   0-based index
 *   totalSlides   {number}
 *   isPresenter   {boolean}  true when local avatar is on stage
 *   pdfLoaded     {boolean}  true once a PDF URL is set
 *   onPrev        {fn}
 *   onNext        {fn}
 *   onUpload      {fn(file)} called with a File object when user picks a PDF
 *   presenterName {string}   username of whoever is currently on stage (or "")
 */

export default function PresenterControls({
    currentSlide  = 0,
    totalSlides   = 0,
    isPresenter   = false,
    pdfLoaded     = false,
    onPrev,
    onNext,
    onUpload,
    presenterName = "",
}) {
    // ── File-picker (invisible input, triggered by button) ───────────────────
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) onUpload?.(file);
        // Reset so the same file can be re-picked
        e.target.value = "";
    };

    const slideLabel = totalSlides > 0
        ? `${currentSlide + 1} / ${totalSlides}`
        : "— / —";

    // ════════════════════════════════════════════════════════════════════════
    // PRESENTER VIEW — full controls shown on stage
    // ════════════════════════════════════════════════════════════════════════
    if (isPresenter) {
        return (
            <div
                style={{
                    position: "absolute",
                    bottom: 28,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 40,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "rgba(10,10,20,0.82)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: 16,
                    padding: "10px 16px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                    userSelect: "none",
                }}
            >
                {/* Upload PDF button */}
                <label
                    title="Upload PDF slides"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        cursor: "pointer",
                        background: "rgba(139,92,246,0.25)",
                        border: "1px solid rgba(139,92,246,0.5)",
                        borderRadius: 10,
                        padding: "6px 12px",
                        color: "#c4b5fd",
                        fontSize: 13,
                        fontWeight: 600,
                        transition: "background 0.15s",
                        whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "rgba(139,92,246,0.4)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "rgba(139,92,246,0.25)")
                    }
                >
                    <span style={{ fontSize: 15 }}>📄</span>
                    {pdfLoaded ? "Change PDF" : "Load PDF"}
                    <input
                        type="file"
                        accept=".pdf"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                </label>

                {/* Divider */}
                <div style={{
                    width: 1,
                    height: 28,
                    background: "rgba(255,255,255,0.12)",
                    borderRadius: 1,
                }} />

                {/* Prev button */}
                <button
                    onClick={onPrev}
                    disabled={!pdfLoaded || currentSlide <= 0}
                    title="Previous slide  (←)"
                    style={{
                        background: "none",
                        border: "none",
                        cursor: pdfLoaded && currentSlide > 0 ? "pointer" : "not-allowed",
                        color: pdfLoaded && currentSlide > 0
                            ? "rgba(255,255,255,0.9)"
                            : "rgba(255,255,255,0.25)",
                        fontSize: 22,
                        lineHeight: 1,
                        padding: "2px 6px",
                        borderRadius: 8,
                        transition: "background 0.15s, color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                        if (pdfLoaded && currentSlide > 0)
                            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    }}
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "none")
                    }
                >
                    ‹
                </button>

                {/* Slide counter */}
                <div style={{
                    minWidth: 64,
                    textAlign: "center",
                    color: pdfLoaded ? "#f1f5f9" : "rgba(255,255,255,0.3)",
                    fontSize: 14,
                    fontWeight: 700,
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "0.02em",
                }}>
                    {slideLabel}
                </div>

                {/* Next button */}
                <button
                    onClick={onNext}
                    disabled={!pdfLoaded || currentSlide >= totalSlides - 1}
                    title="Next slide  (→)"
                    style={{
                        background: "none",
                        border: "none",
                        cursor: pdfLoaded && currentSlide < totalSlides - 1 ? "pointer" : "not-allowed",
                        color: pdfLoaded && currentSlide < totalSlides - 1
                            ? "rgba(255,255,255,0.9)"
                            : "rgba(255,255,255,0.25)",
                        fontSize: 22,
                        lineHeight: 1,
                        padding: "2px 6px",
                        borderRadius: 8,
                        transition: "background 0.15s, color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                        if (pdfLoaded && currentSlide < totalSlides - 1)
                            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    }}
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "none")
                    }
                >
                    ›
                </button>

                {/* Divider */}
                <div style={{
                    width: 1,
                    height: 28,
                    background: "rgba(255,255,255,0.12)",
                    borderRadius: 1,
                }} />

                {/* On-stage badge */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    color: "#86efac",
                    fontSize: 12,
                    fontWeight: 600,
                }}>
                    <span style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#4ade80",
                        boxShadow: "0 0 6px #4ade80",
                        display: "inline-block",
                        animation: "pulse-dot 2s ease-in-out infinite",
                    }} />
                    Presenting
                </div>

                <style>{`
                    @keyframes pulse-dot {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.4; }
                    }
                `}</style>
            </div>
        );
    }

    // ════════════════════════════════════════════════════════════════════════
    // AUDIENCE VIEW — slim slide indicator + presenter name
    // ════════════════════════════════════════════════════════════════════════
    if (!pdfLoaded) return null;

    return (
        <div
            style={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 30,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 4,
                pointerEvents: "none",
                userSelect: "none",
            }}
        >
            {presenterName && (
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(10,10,20,0.70)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8,
                    padding: "4px 10px",
                    color: "#86efac",
                    fontSize: 12,
                    fontWeight: 600,
                }}>
                    <span style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#4ade80",
                        display: "inline-block",
                    }} />
                    {presenterName} is presenting
                </div>
            )}

            <div style={{
                background: "rgba(10,10,20,0.70)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                padding: "4px 10px",
                color: "rgba(255,255,255,0.7)",
                fontSize: 12,
                fontWeight: 600,
                fontVariantNumeric: "tabular-nums",
            }}>
                Slide {slideLabel}
            </div>
        </div>
    );
}
