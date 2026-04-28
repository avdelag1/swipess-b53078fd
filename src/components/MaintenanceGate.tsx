import React, { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "Swipess_maintenance_unlocked_v1";
const REQUIRED_TAPS = 8;
const TAP_RESET_MS = 1500;

export function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(STORAGE_KEY) === "true";
  });
  const [taps, setTaps] = useState(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  if (unlocked) return <>{children}</>;

  const handleLogoTap = () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);

    setTaps((prev) => {
      const next = prev + 1;
      if (next >= REQUIRED_TAPS) {
        try {
          sessionStorage.setItem(STORAGE_KEY, "true");
        } catch {
          // ignore — fall back to in-memory unlock
        }
        if ("vibrate" in navigator) navigator.vibrate([20, 40, 20]);
        setUnlocked(true);
        return 0;
      }
      return next;
    });

    if ("vibrate" in navigator) navigator.vibrate(8);

    resetTimer.current = setTimeout(() => setTaps(0), TAP_RESET_MS);
  };

  const remaining = Math.max(0, REQUIRED_TAPS - taps);
  const showHint = taps >= 3;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background:
          "radial-gradient(ellipse at top, #1a0a1a 0%, #050005 60%, #000 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        color: "#fff",
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        textAlign: "center",
        userSelect: "none",
        WebkitUserSelect: "none",
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        aria-label="Swipess logo"
        onClick={handleLogoTap}
        style={{
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
          outline: "none",
          WebkitTapHighlightColor: "transparent",
          transform: taps > 0 ? `scale(${1 + taps * 0.012})` : "scale(1)",
          transition: "transform 180ms cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        <img
          src="/icons/Swipess-logo.png"
          alt="Swipess"
          width={160}
          height={160}
          draggable={false}
          style={{
            width: "min(45vw, 180px)",
            height: "auto",
            filter:
              "drop-shadow(0 0 32px rgba(244, 63, 94, 0.45)) drop-shadow(0 0 8px rgba(244, 63, 94, 0.3))",
            pointerEvents: "none",
          }}
        />
      </button>

      <h1
        style={{
          marginTop: "2.5rem",
          fontSize: "clamp(1.6rem, 5vw, 2.4rem)",
          fontWeight: 900,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          fontStyle: "italic",
        }}
      >
        We&rsquo;re under maintenance
      </h1>

      <p
        style={{
          marginTop: "1rem",
          maxWidth: "32rem",
          fontSize: "0.95rem",
          lineHeight: 1.6,
          opacity: 0.6,
          fontWeight: 500,
        }}
      >
        Swipess is currently undergoing scheduled improvements. We&rsquo;ll be
        back online shortly. Thanks for your patience.
      </p>

      <div
        style={{
          marginTop: "3rem",
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "1.5rem",
        }}
      >
        {Array.from({ length: REQUIRED_TAPS }).map((_, i) => (
          <span
            key={i}
            style={{
              width: i < taps ? "1.25rem" : "0.5rem",
              height: "0.5rem",
              borderRadius: "999px",
              background:
                i < taps ? "rgba(244, 63, 94, 0.95)" : "rgba(255,255,255,0.1)",
              transition: "all 220ms cubic-bezier(0.32, 0.72, 0, 1)",
            }}
          />
        ))}
      </div>

      <p
        style={{
          marginTop: "1.25rem",
          fontSize: "0.7rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          fontWeight: 700,
          opacity: showHint ? 0.5 : 0,
          transition: "opacity 320ms ease",
          minHeight: "1rem",
        }}
      >
        {showHint && remaining > 0
          ? `${remaining} more tap${remaining === 1 ? "" : "s"}`
          : ""}
      </p>

      <p
        style={{
          position: "absolute",
          bottom: "1.5rem",
          left: 0,
          right: 0,
          fontSize: "0.6rem",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          fontWeight: 700,
          opacity: 0.2,
        }}
      >
        Swipess &middot; Status: Maintenance
      </p>
    </div>
  );
}

export default MaintenanceGate;
