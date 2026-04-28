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
        setUnlocked(true);
        return 0;
      }
      return next;
    });

    resetTimer.current = setTimeout(() => setTaps(0), TAP_RESET_MS);
  };

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
