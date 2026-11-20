const ROWS = [
  { label: 'IMEI CHECK', value: '35•••••••42', y: 152, tone: '#7fe4ff' },
  { label: 'NETWORK STATUS', value: 'ONLINE', y: 196, tone: '#5ef2a8' },
  { label: 'eSIM MANAGEMENT', value: '1 PROFILE', y: 240, tone: '#7fe4ff' },
  { label: 'SECURITY SCAN', value: 'RUNNING 78%', y: 284, tone: '#e8c46a' },
];

const GRID_V = [52, 80, 108, 136, 164, 192, 220, 248, 276];
const GRID_H = [120, 168, 216, 264, 312, 360, 408, 456, 504, 552, 600];

export function HeroDevice() {
  return (
    <div className="device-stage">
      <span className="device-glow" aria-hidden="true" />
      <div className="device-float">
        <svg
          className="device-svg"
          viewBox="0 0 340 700"
          role="img"
          aria-labelledby="holo-device-title"
        >
          <title id="holo-device-title">
            Smartphone conceptual de titanio con diagnóstico de dispositivo, comprobación de IMEI,
            estado de red, gestión eSIM y escaneo de seguridad
          </title>

          <defs>
            <linearGradient id="devFrame" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6b788c" />
              <stop offset="20%" stopColor="#1b2230" />
              <stop offset="50%" stopColor="#0a0e16" />
              <stop offset="78%" stopColor="#2c3646" />
              <stop offset="100%" stopColor="#0b1119" />
            </linearGradient>
            <linearGradient id="devEdge" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#9df2ff" stopOpacity="0.95" />
              <stop offset="34%" stopColor="#2f7bff" stopOpacity="0.32" />
              <stop offset="68%" stopColor="#38e1ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1b4bff" stopOpacity="0.42" />
            </linearGradient>
            <linearGradient id="devGlass" x1="0" y1="0" x2="0.35" y2="1">
              <stop offset="0%" stopColor="#06111c" />
              <stop offset="46%" stopColor="#04101d" />
              <stop offset="100%" stopColor="#020a14" />
            </linearGradient>
            <linearGradient id="devSheen" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#cdefff" stopOpacity="0.2" />
              <stop offset="46%" stopColor="#8fd8ff" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="devBar" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38e1ff" />
              <stop offset="58%" stopColor="#2f7bff" />
              <stop offset="100%" stopColor="#e8c46a" />
            </linearGradient>
            <radialGradient id="devScanner" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38e1ff" stopOpacity="0.32" />
              <stop offset="68%" stopColor="#2f7bff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#2f7bff" stopOpacity="0" />
            </radialGradient>
            <clipPath id="devScreenClip">
              <rect x="28" y="48" width="284" height="604" rx="38" />
            </clipPath>
          </defs>

          {/* Circuitos electrónicos alrededor del dispositivo */}
          <g
            className="dev-circuits"
            aria-hidden="true"
            fill="none"
            stroke="#38e1ff"
            strokeWidth="0.9"
            opacity="0.4"
          >
            <path d="M20 172 H10 V138" />
            <circle cx="10" cy="135" r="2.2" fill="#38e1ff" stroke="none" />
            <path d="M20 296 H6 V330" />
            <circle cx="6" cy="333" r="2.2" fill="#38e1ff" stroke="none" />
            <path d="M20 470 H12 V510" />
            <circle cx="12" cy="513" r="2" fill="#38e1ff" stroke="none" />
            <path d="M320 210 H332 V176" />
            <circle cx="332" cy="173" r="2.2" fill="#38e1ff" stroke="none" />
            <path d="M320 392 H336 V430" />
            <circle cx="336" cy="433" r="2.2" fill="#38e1ff" stroke="none" />
            <path d="M320 556 H330 V596" />
            <circle cx="330" cy="599" r="2" fill="#38e1ff" stroke="none" />
            <path d="M52 40 C52 14 128 2 170 2 C212 2 288 14 288 40" opacity="0.55" />
            <path d="M52 660 C52 686 128 698 170 698 C212 698 288 686 288 660" opacity="0.55" />
          </g>

          {/* Cuerpo de titanio */}
          <rect x="20" y="40" width="300" height="620" rx="44" fill="url(#devFrame)" />
          <rect
            x="20"
            y="40"
            width="300"
            height="620"
            rx="44"
            fill="none"
            stroke="url(#devEdge)"
            strokeWidth="1.5"
            opacity="0.92"
          />
          <rect
            x="24.5"
            y="44.5"
            width="291"
            height="611"
            rx="40"
            fill="none"
            stroke="#0c1520"
            strokeWidth="1"
            opacity="0.85"
          />
          <rect x="18" y="196" width="3.4" height="34" rx="1.7" fill="#3a4759" />
          <rect x="18" y="244" width="3.4" height="52" rx="1.7" fill="#3a4759" />
          <rect x="318.6" y="232" width="3.4" height="66" rx="1.7" fill="#3a4759" />

          {/* Cristal */}
          <rect x="28" y="48" width="284" height="604" rx="38" fill="url(#devGlass)" />

          <g clipPath="url(#devScreenClip)">
            <g stroke="#1d5f8f" strokeWidth="0.35" opacity="0.22">
              {GRID_V.map((x) => (
                <line key={`v${x}`} x1={x} y1="48" x2={x} y2="652" />
              ))}
              {GRID_H.map((y) => (
                <line key={`h${y}`} x1="28" y1={y} x2="312" y2={y} />
              ))}
            </g>

            <path d="M28 48 H312 L150 652 H28 Z" fill="url(#devSheen)" opacity="0.55" />

            <text x="52" y="82" className="dev-micro">09:41</text>
            <text x="288" y="82" textAnchor="end" className="dev-micro">5G · 98%</text>

            <text x="52" y="112" className="dev-title">DEVICE DIAGNOSTICS</text>
            <rect x="52" y="120" width="236" height="1.6" rx="0.8" fill="url(#devBar)" opacity="0.85" />
            <text x="52" y="140" className="dev-label">LIVE TELEMETRY</text>
            <text x="288" y="140" textAnchor="end" className="dev-label">HOLO UI</text>

            {ROWS.map((row) => (
              <g key={row.label}>
                <rect
                  x="48"
                  y={row.y}
                  width="244"
                  height="36"
                  rx="11"
                  fill="rgba(56,225,255,0.05)"
                  stroke="rgba(56,225,255,0.18)"
                  strokeWidth="0.8"
                />
                <circle cx="60" cy={row.y + 18} r="2.6" fill={row.tone} className="dev-pulse" />
                <text x="70" y={row.y + 21.5} className="dev-row-label">{row.label}</text>
                <text x="282" y={row.y + 21.5} textAnchor="end" className="dev-row-value">
                  {row.value}
                </text>
              </g>
            ))}

            {/* Escáner circular holográfico */}
            <circle cx="170" cy="404" r="58" fill="url(#devScanner)" />
            <circle
              cx="170"
              cy="404"
              r="54"
              fill="none"
              stroke="#38e1ff"
              strokeWidth="0.9"
              strokeDasharray="3 6"
              opacity="0.6"
              className="dev-ring-a"
            />
            <circle
              cx="170"
              cy="404"
              r="46"
              fill="none"
              stroke="url(#devBar)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeDasharray="206 290"
              transform="rotate(-90 170 404)"
              opacity="0.9"
            />
            <circle
              cx="170"
              cy="404"
              r="46"
              fill="none"
              stroke="#9df2ff"
              strokeWidth="2"
              strokeDasharray="1 11"
              opacity="0.5"
              className="dev-ring-b"
            />
            <g className="dev-sweep">
              <line x1="170" y1="404" x2="170" y2="350" stroke="#9df2ff" strokeWidth="1.4" opacity="0.75" />
            </g>
            <circle cx="170" cy="404" r="30" fill="none" stroke="rgba(56,225,255,0.35)" strokeWidth="0.8" />
            <line x1="140" y1="404" x2="200" y2="404" stroke="rgba(56,225,255,0.28)" strokeWidth="0.7" />
            <line x1="170" y1="374" x2="170" y2="434" stroke="rgba(56,225,255,0.28)" strokeWidth="0.7" />
            <text x="170" y="401" textAnchor="middle" className="dev-scan-value">98%</text>
            <text x="170" y="413" textAnchor="middle" className="dev-scan-caption">SECURE</text>
            <text x="170" y="482" textAnchor="middle" className="dev-label">HOLOGRAPHIC SCANNER</text>

            <rect x="48" y="508" width="244" height="4" rx="2" fill="#0d2233" />
            <rect x="48" y="508" width="190" height="4" rx="2" fill="url(#devBar)" opacity="0.95" />
            <text x="48" y="528" className="dev-label">SYSTEM INTEGRITY</text>
            <text x="292" y="528" textAnchor="end" className="dev-label">78%</text>

            <rect x="48" y="544" width="112" height="26" rx="9" fill="rgba(56,225,255,0.06)" stroke="rgba(56,225,255,0.2)" strokeWidth="0.7" />
            <text x="104" y="561" textAnchor="middle" className="dev-chip">TITANIUM</text>
            <rect x="168" y="544" width="124" height="26" rx="9" fill="rgba(232,196,106,0.06)" stroke="rgba(232,196,106,0.22)" strokeWidth="0.7" />
            <text x="230" y="561" textAnchor="middle" className="dev-chip is-gold">SECURE ENCLAVE</text>

            <rect x="140" y="636" width="60" height="3" rx="1.5" fill="#2b4a63" />

            <rect x="28" y="140" width="284" height="2" fill="url(#devBar)" opacity="0.22" className="dev-scanline" />
          </g>

          {/* Cámara frontal discreta */}
          <circle cx="170" cy="62" r="5" fill="#050b12" stroke="#1e3348" strokeWidth="0.8" />
          <rect x="150" y="53" width="40" height="2" rx="1" fill="#12212e" />
        </svg>
      </div>
    </div>
  );
}
