// ScanX QR Logo — matches the brand image exactly:
// Blue scan-corner frame around a QR grid, with a blue shield+check badge overlay,
// followed by "ScanX" in white bold and "QR" in blue bold.

interface ScanXLogoProps {
  /** "full" = icon + wordmark (default), "icon" = icon only, "wordmark" = text only */
  variant?: "full" | "icon" | "wordmark";
  /** Height of the icon in px (width scales proportionally) */
  iconSize?: number;
  /** Font size for the wordmark in px */
  fontSize?: number;
  className?: string;
}

export default function ScanXLogo({
  variant = "full",
  iconSize = 40,
  fontSize = 22,
  className = "",
}: ScanXLogoProps) {
  const s = iconSize;

  const Icon = (
    <svg
      width={s}
      height={s}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Scan-corner frame (blue) ── */}
      {/* Top-left corner */}
      <path d="M4 20 L4 4 L20 4" stroke="#3B6EF8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      {/* Top-right corner */}
      <path d="M60 4 L76 4 L76 20" stroke="#3B6EF8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bottom-left corner */}
      <path d="M4 60 L4 76 L20 76" stroke="#3B6EF8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bottom-right corner */}
      <path d="M60 76 L76 76 L76 60" stroke="#3B6EF8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

      {/* ── QR code grid (white/light) ── */}
      {/* Top-left finder */}
      <rect x="13" y="13" width="18" height="18" rx="2" fill="white" />
      <rect x="17" y="17" width="10" height="10" rx="1" fill="#1a1a2e" />
      {/* Top-right finder */}
      <rect x="49" y="13" width="18" height="18" rx="2" fill="white" />
      <rect x="53" y="17" width="10" height="10" rx="1" fill="#1a1a2e" />
      {/* Bottom-left finder */}
      <rect x="13" y="49" width="18" height="18" rx="2" fill="white" />
      <rect x="17" y="53" width="10" height="10" rx="1" fill="#1a1a2e" />
      {/* Data dots */}
      <rect x="35" y="13" width="6" height="6" rx="1" fill="white" />
      <rect x="43" y="13" width="6" height="6" rx="1" fill="white" />
      <rect x="35" y="21" width="6" height="6" rx="1" fill="white" />
      <rect x="13" y="35" width="6" height="6" rx="1" fill="white" />
      <rect x="21" y="35" width="6" height="6" rx="1" fill="white" />
      <rect x="35" y="35" width="6" height="6" rx="1" fill="white" />
      <rect x="43" y="35" width="6" height="6" rx="1" fill="white" />
      <rect x="35" y="43" width="6" height="6" rx="1" fill="white" />
      <rect x="43" y="43" width="6" height="6" rx="1" fill="white" />
      <rect x="35" y="51" width="6" height="6" rx="1" fill="white" />
      <rect x="43" y="51" width="6" height="6" rx="1" fill="white" />
      <rect x="35" y="59" width="6" height="6" rx="1" fill="white" />
      <rect x="43" y="59" width="6" height="6" rx="1" fill="white" />

      {/* ── Shield + check badge (bottom-right overlay) ── */}
      {/* Shield body */}
      <path
        d="M52 46 L52 46 L64 41 L76 46 L76 54 C76 60 70 65 64 67 C58 65 52 60 52 54 Z"
        fill="#3B6EF8"
      />
      {/* Check mark */}
      <path
        d="M59 54 L62.5 57.5 L69 50"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const Wordmark = (
    <span
      className="font-black tracking-tight leading-none select-none"
      style={{ fontSize }}
    >
      <span style={{ color: "#ffffff" }}>ScanX </span>
      <span style={{ color: "#3B6EF8" }}>QR</span>
    </span>
  );

  if (variant === "icon") return <span className={className}>{Icon}</span>;
  if (variant === "wordmark") return <span className={className}>{Wordmark}</span>;

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      {Icon}
      {Wordmark}
    </span>
  );
}
