import { useId } from 'react';

/**
 * Recursos visuales originales de YORIICHI PRO UNLOCK.
 * Ilustración vectorial propia inspirada en la referencia:
 * luna carmesí, silueta de pagoda, guerrero samurái con katana
 * y un teléfono futurista con candado cian y red global.
 */

export function SamuraiArt({ className = '' }) {
  const uid = useId().replace(/:/g, '');
  const moon = `moon-${uid}`;
  const armor = `armor-${uid}`;
  const blade = `blade-${uid}`;
  const cloak = `cloak-${uid}`;
  const mist = `mist-${uid}`;
  const glow = `glow-${uid}`;

  return (
    <svg
      className={`hero-art-svg ${className}`.trim()}
      viewBox="0 0 360 480"
      role="img"
      aria-label="Ilustración original: guerrero samurái frente a una luna carmesí y una pagoda"
    >
      <defs>
        <radialGradient id={moon} cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#ff8a63" stopOpacity="0.95" />
          <stop offset="34%" stopColor="#e2382c" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#9d0f1e" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#3d0509" stopOpacity="0.9" />
        </radialGradient>
        <linearGradient id={armor} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2a3348" />
          <stop offset="48%" stopColor="#101725" />
          <stop offset="100%" stopColor="#05080f" />
        </linearGradient>
        <linearGradient id={blade} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#8fd8ff" />
          <stop offset="45%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e8c46a" />
        </linearGradient>
        <linearGradient id={cloak} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8102e" stopOpacity="0.62" />
          <stop offset="60%" stopColor="#8d0f1d" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#1a0306" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id={mist} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38e1ff" stopOpacity="0" />
          <stop offset="100%" stopColor="#38e1ff" stopOpacity="0.16" />
        </linearGradient>
        <filter id={glow} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="9" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Luna carmesí */}
      <circle cx="182" cy="168" r="132" fill="#c8102e" fillOpacity="0.18" filter={`url(#${glow})`} />
      <circle cx="182" cy="168" r="118" fill={`url(#${moon})`} />
      <circle cx="182" cy="168" r="118" fill="none" stroke="#ff9a7a" strokeOpacity="0.35" strokeWidth="1.2" />
      <circle cx="182" cy="168" r="104" fill="none" stroke="#3d0509" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 12" />

      {/* Pagoda al fondo */}
      <g fill="#150509" stroke="#c8102e" strokeOpacity="0.35" strokeWidth="1">
        <path d="M300 372 L300 250 L338 268 L338 372 Z" />
        <path d="M276 262 L320 236 L364 262 L356 268 L284 268 Z" />
        <path d="M286 226 L320 204 L354 226 L346 232 L294 232 Z" />
        <path d="M294 196 L320 178 L346 196 L340 201 L300 201 Z" />
        <path d="M314 178 L320 158 L326 178 Z" />
      </g>
      <g stroke="#e8c46a" strokeOpacity="0.22" strokeWidth="1">
        <path d="M292 268 L292 372M306 268 L306 372M348 268 L348 372M330 268 L330 372" />
      </g>

      {/* Reflejo de suelo */}
      <ellipse cx="182" cy="424" rx="150" ry="26" fill={`url(#${mist})`} />

      {/* Capa / haori */}
      <path
        d="M108 268 C74 312 62 372 70 432 L292 432 C300 372 288 312 254 268 Z"
        fill={`url(#${cloak})`}
        stroke="#c8102e"
        strokeOpacity="0.4"
        strokeWidth="1.3"
      />
      <path d="M108 268 L182 320 L254 268" fill="none" stroke="#e8c46a" strokeOpacity="0.35" strokeWidth="1.6" />

      {/* Hombreras (sode) */}
      <path d="M84 258 L140 234 L150 310 L92 328 Z" fill={`url(#${armor})`} stroke="#e8c46a" strokeOpacity="0.55" strokeWidth="1.5" />
      <path d="M280 258 L224 234 L214 310 L272 328 Z" fill={`url(#${armor})`} stroke="#e8c46a" strokeOpacity="0.55" strokeWidth="1.5" />
      <g stroke="#38e1ff" strokeOpacity="0.28" strokeWidth="1">
        <path d="M92 272 L142 252M94 290 L144 270M96 308 L146 288" />
        <path d="M272 272 L222 252M270 290 L220 270M268 308 L218 288" />
      </g>

      {/* Torso */}
      <path d="M140 236 L224 236 L238 348 L126 348 Z" fill={`url(#${armor})`} stroke="#e8c46a" strokeOpacity="0.45" strokeWidth="1.5" />
      <g stroke="#e8c46a" strokeOpacity="0.22" strokeWidth="1">
        <path d="M136 260 L230 260M134 284 L232 284M132 308 L234 308M130 332 L236 332" />
      </g>
      <path d="M182 236 L182 348" stroke="#c8102e" strokeOpacity="0.6" strokeWidth="2.2" />

      {/* Faja carmesí */}
      <path d="M128 336 L238 336 L242 358 L124 358 Z" fill="#8d0f1d" fillOpacity="0.75" stroke="#e8c46a" strokeOpacity="0.4" strokeWidth="1.2" />

      {/* Cuello y guarda */}
      <path d="M150 234 C150 208 214 208 214 234 Z" fill="#0a0e18" stroke="#e8c46a" strokeOpacity="0.35" strokeWidth="1.2" />
      <path d="M142 220 C142 192 222 192 222 220" fill="none" stroke="#e8c46a" strokeOpacity="0.45" strokeWidth="1.7" />

      {/* Yelmo */}
      <path d="M140 196 C140 140 224 140 224 196 Z" fill={`url(#${armor})`} stroke="#e8c46a" strokeOpacity="0.65" strokeWidth="1.8" />
      <path d="M182 146 L182 196" stroke="#e8c46a" strokeOpacity="0.35" strokeWidth="1.4" />

      {/* Media luna (maedate) */}
      <path d="M182 92 C210 118 210 158 182 180 C196 152 196 118 182 92 Z" fill="#e8c46a" fillOpacity="0.95" stroke="#f9e9be" strokeWidth="1" />

      {/* Máscara */}
      <path d="M150 200 C168 190 196 190 214 200 L208 226 C194 240 170 240 156 226 Z" fill="#12070c" stroke="#c8102e" strokeOpacity="0.8" strokeWidth="1.6" />
      <g stroke="#ff3b2f" strokeWidth="2.4" strokeLinecap="round" filter={`url(#${glow})`}>
        <path d="M160 210 L176 211" />
        <path d="M188 211 L204 210" />
      </g>
      <path d="M172 224 L192 224" stroke="#c8102e" strokeOpacity="0.5" strokeWidth="1.6" />

      {/* Cabello y pendiente */}
      <path d="M138 190 C126 214 128 246 140 262 L152 232 Z" fill="#12080c" stroke="#c8102e" strokeOpacity="0.4" strokeWidth="1.2" />
      <path d="M226 190 C238 214 236 246 224 262 L212 232 Z" fill="#12080c" stroke="#c8102e" strokeOpacity="0.4" strokeWidth="1.2" />
      <path d="M150 218 L150 236" stroke="#e8c46a" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="150" cy="240" r="3.4" fill="#ff3b2f" filter={`url(#${glow})`} />

      {/* Katana */}
      <path d="M272 140 L112 386" stroke={`url(#${blade})`} strokeWidth="5" strokeLinecap="round" filter={`url(#${glow})`} />
      <path d="M272 140 L112 386" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M266 152 L252 174" stroke="#c8102e" strokeWidth="8" strokeLinecap="round" />
      <circle cx="259" cy="163" r="4.6" fill="none" stroke="#e8c46a" strokeWidth="1.7" />

      {/* Manos */}
      <circle cx="265" cy="155" r="8.5" fill="#0a0e18" stroke="#e8c46a" strokeOpacity="0.5" strokeWidth="1.4" />
      <circle cx="136" cy="346" r="8.5" fill="#0a0e18" stroke="#e8c46a" strokeOpacity="0.5" strokeWidth="1.4" />

      {/* Partículas */}
      <g fill="#38e1ff" fillOpacity="0.65">
        <circle cx="66" cy="188" r="2" />
        <circle cx="96" cy="132" r="1.6" />
        <circle cx="308" cy="330" r="2.2" />
        <circle cx="332" cy="196" r="1.5" />
      </g>
      <ellipse cx="182" cy="432" rx="96" ry="10" fill="#e8c46a" fillOpacity="0.12" />
    </svg>
  );
}

export function LockedPhone({ className = '' }) {
  const uid = useId().replace(/:/g, '');
  const body = `body-${uid}`;
  const screen = `screen-${uid}`;
  const cyan = `cyan-${uid}`;
  const glow = `pglow-${uid}`;

  return (
    <svg
      className={`hero-device-svg ${className}`.trim()}
      viewBox="0 0 300 480"
      role="img"
      aria-label="Teléfono futurista con candado cian, red global y elementos tecnológicos"
    >
      <defs>
        <linearGradient id={body} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2b3a52" />
          <stop offset="42%" stopColor="#0d1424" />
          <stop offset="100%" stopColor="#04070e" />
        </linearGradient>
        <linearGradient id={screen} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b1a2e" />
          <stop offset="55%" stopColor="#050b16" />
          <stop offset="100%" stopColor="#02040a" />
        </linearGradient>
        <linearGradient id={cyan} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c9f6ff" />
          <stop offset="45%" stopColor="#38e1ff" />
          <stop offset="100%" stopColor="#2f7bff" />
        </linearGradient>
        <filter id={glow} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Halo y anillos orbitales */}
      <circle cx="150" cy="238" r="132" fill="#2f7bff" fillOpacity="0.09" />
      <g fill="none" stroke="#38e1ff" strokeOpacity="0.3">
        <ellipse cx="150" cy="238" rx="142" ry="62" strokeWidth="1" strokeDasharray="3 10" />
        <ellipse cx="150" cy="238" rx="120" ry="120" strokeWidth="0.9" strokeOpacity="0.14" />
      </g>

      {/* Globo de red */}
      <g fill="none" stroke="#38e1ff" strokeOpacity="0.22" strokeWidth="1">
        <circle cx="150" cy="126" r="52" />
        <ellipse cx="150" cy="126" rx="24" ry="52" />
        <ellipse cx="150" cy="126" rx="42" ry="52" />
        <path d="M98 126 H202M106 104 H194M106 148 H194" />
      </g>
      <g fill="#38e1ff" fillOpacity="0.85">
        <circle cx="118" cy="104" r="2.4" />
        <circle cx="186" cy="112" r="2" />
        <circle cx="150" cy="78" r="2.2" />
        <circle cx="132" cy="150" r="1.8" />
      </g>

      {/* Cuerpo del teléfono */}
      <g transform="rotate(-4 150 250)">
        <rect x="70" y="70" width="160" height="352" rx="32" fill={`url(#${body})`} stroke="#38e1ff" strokeOpacity="0.45" strokeWidth="1.8" />
        <rect x="76" y="76" width="148" height="340" rx="27" fill={`url(#${screen})`} stroke="#e8c46a" strokeOpacity="0.18" strokeWidth="1" />
        <rect x="122" y="84" width="56" height="9" rx="4.5" fill="#04060d" stroke="#38e1ff" strokeOpacity="0.3" strokeWidth="0.8" />

        {/* Rejilla técnica */}
        <g stroke="#38e1ff" strokeOpacity="0.1" strokeWidth="1">
          <path d="M88 116 H212M88 142 H212M88 330 H212M88 356 H212" />
        </g>

        {/* Candado cian */}
        <g filter={`url(#${glow})`}>
          <path d="M126 232 V212 a24 24 0 0 1 48 0 v20" fill="none" stroke={`url(#${cyan})`} strokeWidth="7" strokeLinecap="round" />
          <rect x="114" y="232" width="72" height="58" rx="13" fill={`url(#${cyan})`} fillOpacity="0.94" />
        </g>
        <circle cx="150" cy="254" r="6.5" fill="#04101c" />
        <path d="M150 260 v11" stroke="#04101c" strokeWidth="4" strokeLinecap="round" />
        <path d="M132 312 h36" stroke="#38e1ff" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
        <path d="M140 322 h20" stroke="#38e1ff" strokeOpacity="0.28" strokeWidth="2" strokeLinecap="round" />

        {/* Circuitos */}
        <g stroke="#38e1ff" strokeOpacity="0.4" strokeWidth="1.4" fill="none">
          <path d="M88 196 H118 L132 182" />
          <path d="M212 196 H182 L168 182" />
          <path d="M88 296 H118 L132 282" />
          <path d="M212 296 H182 L168 282" />
        </g>
        <g fill="#38e1ff" fillOpacity="0.75">
          <circle cx="88" cy="196" r="2.8" />
          <circle cx="212" cy="196" r="2.8" />
          <circle cx="88" cy="296" r="2.8" />
          <circle cx="212" cy="296" r="2.8" />
        </g>
      </g>

      {/* Chips flotantes */}
      <g>
        <rect x="10" y="158" width="66" height="26" rx="8" fill="#060a14" stroke="#38e1ff" strokeOpacity="0.5" strokeWidth="1.2" />
        <text x="43" y="175" textAnchor="middle" fill="#8fd8ff" fontSize="10" fontFamily="monospace" letterSpacing="1">IMEI</text>
      </g>
      <g>
        <rect x="224" y="252" width="66" height="26" rx="8" fill="#060a14" stroke="#e8c46a" strokeOpacity="0.5" strokeWidth="1.2" />
        <text x="257" y="269" textAnchor="middle" fill="#f9e9be" fontSize="10" fontFamily="monospace" letterSpacing="1">eSIM</text>
      </g>
      <g>
        <rect x="8" y="304" width="74" height="26" rx="8" fill="#060a14" stroke="#c8102e" strokeOpacity="0.55" strokeWidth="1.2" />
        <text x="45" y="321" textAnchor="middle" fill="#ff9a8f" fontSize="10" fontFamily="monospace" letterSpacing="1">ICCID</text>
      </g>
      <g>
        <rect x="216" y="356" width="76" height="26" rx="8" fill="#060a14" stroke="#e8c46a" strokeOpacity="0.4" strokeWidth="1.2" />
        <text x="254" y="373" textAnchor="middle" fill="#f9e9be" fontSize="9" fontFamily="monospace" letterSpacing="0.6">NETWORK</text>
      </g>

      <ellipse cx="150" cy="440" rx="88" ry="11" fill="#38e1ff" fillOpacity="0.12" />
    </svg>
  );
}
