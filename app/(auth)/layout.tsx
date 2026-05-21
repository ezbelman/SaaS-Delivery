export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>

      {/* ── Left decorative panel (desktop only) ── */}
      <div
        className="hidden lg:flex lg:w-[42%] relative overflow-hidden flex-col"
        style={{ background: "var(--surface)" }}
      >
        {/* Dot grid */}
        <div className="absolute inset-0 sdp-dots opacity-70 pointer-events-none" />

        {/* Concentric circles — bottom-right anchor */}
        <div className="absolute -bottom-32 -right-32 pointer-events-none">
          <svg width="560" height="560" viewBox="0 0 560 560" fill="none">
            {[55, 110, 175, 250, 335, 430].map((r, i) => (
              <circle
                key={r}
                cx="440"
                cy="440"
                r={r}
                stroke="#F5A623"
                strokeOpacity={Math.max(0.05, 0.42 - i * 0.065).toFixed(3)}
                strokeWidth="1.2"
              />
            ))}
            <circle cx="440" cy="440" r="7" fill="#F5A623" fillOpacity="0.75" />
            <circle cx="440" cy="440" r="18" fill="#F5A623" fillOpacity="0.12" />
          </svg>
        </div>

        {/* Small top-left dot cluster */}
        <div className="absolute top-16 left-12 pointer-events-none opacity-40">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            {[12, 24, 38].map((r, i) => (
              <circle key={r} cx="40" cy="40" r={r} stroke="#F5A623" strokeOpacity={(0.5 - i * 0.12).toFixed(2)} strokeWidth="1" />
            ))}
            <circle cx="40" cy="40" r="3" fill="#F5A623" fillOpacity="0.8" />
          </svg>
        </div>

        {/* Brand content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-sdp-red flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>S</span>
            </div>
            <span className="text-ink font-semibold text-sm tracking-wide" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Slalom
            </span>
          </div>

          {/* Hero copy — Slalom signature italic pattern */}
          <div>
            <div className="sdp-sep text-[9px] mb-6" style={{ letterSpacing: '0.6em' }}>* * *</div>
            <h1
              className="text-4xl font-bold text-ink leading-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Build better<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300, opacity: 0.58 }}>
                tomorrows
              </em>
              <br />together.
            </h1>
            <p className="text-sm text-ink-2 mt-5 leading-relaxed max-w-xs">
              Enterprise program governance & delivery management platform for Slalom consulting engagements.
            </p>

            {/* Feature bullets */}
            <div className="mt-8 space-y-2.5">
              {[
                "RAID Log & escalation management",
                "Gantt, Kanban & Sprint planning",
                "Org chart, RACI & change management",
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-3">
                  <div className="sdp-gold-dot shrink-0" style={{ width: 5, height: 5 }} />
                  <span className="text-xs text-ink-2">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div>
            <div className="sdp-sep text-[9px] mb-4" style={{ letterSpacing: '0.6em' }}>* * *</div>
            <p className="text-[11px] text-ink-3">
              &copy; {new Date().getFullYear()} Slalom, LLC. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Subtle top-right decoration on mobile / form side */}
        <div className="absolute top-0 right-0 pointer-events-none opacity-20 lg:opacity-10">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
            {[20, 45, 75, 110].map((r, i) => (
              <circle key={r} cx="180" cy="20" r={r} stroke="#F5A623" strokeOpacity={(0.5 - i * 0.1).toFixed(2)} strokeWidth="1" />
            ))}
          </svg>
        </div>
        {children}
      </div>

    </div>
  )
}
