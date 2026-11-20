import { useId } from 'react';

/**
 * Recursos visuales originales de YORIICHI PRO UNLOCK.
 * Dibujos vectoriales propios (sin imágenes de terceros) para la portada:
 * una figura de inspiración samurái y un teléfono futurista con candado.
 */

export function SamuraiArt({ className = '' }) {
  const uid = useId().replace(/:/g, '');
  const sun = `sun-${uid}`;
  const armor = `armor-${uid}`;
  const blade = `blade-${uid}`;
  const cloak = `cloak-${uid}`;

  return (
    <svg
      className={`hero-art-svg ${className}`.trim()}
      viewBox="0 0 320 440"
      role="img"
      aria-label="Ilustración original de un guerrero samurái con katana"
    >
      <defs>
        <radialGradient id={sun} cx="50%" cy="46%" r="52%">
          <stop offset="0%" stopColor="#ffe9bd" stopOpacity="0.95" />
          <stop offset="42%" stopColor="#e8c46a" stopOpacity="0.55" />
          <stop offset="78%" stopColor="#c8102e" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#c8102e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={armor} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a2233" />
          <stop offset="55%" stopColor="#0b1120" />
          <stop offset="100%" stopColor="#05080f" />
        </linearGradient>
        <linearGradient id={blade} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#e8c46a" />
          <stop offset="55%" stopColor="#f9e9be" />
          <stop offset="100%" stopColor="#38e1ff" />
        </linearGradient>
        <linearGradient id={cloak} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8102e" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#c8102e" stopOpacity="0.04" />
        </linearGradient>
      </defs>

      {/* Sol y rayos */}
      <circle cx="160" cy="150" r="132" fill={`url(#${sun})`} />
      <g stroke="#e8c46a" strokeOpacity="0.22" strokeWidth="1">
        <circle cx="160" cy="150" r="104" fill="none" strokeDasharray="3 9" />
        <circle cx="160" cy="150" r="122" fill="none" strokeDasharray="2 14" strokeOpacity="0.14" />
      </g>

      {/* Capa / haori */}
      <path
        d="M96 262 C64 300 52 356 60 408 L262 408 C268 356 256 300 226 262 Z"
        fill={`url(#${cloak})`}
        stroke="#c8102e"
        strokeOpacity="0.45"
        strokeWidth="1.2"
      />

      {/* Hombreras (sode) */}
      <path d="M74 250 L128 228 L136 300 L84 316 Z" fill={`url(#${armor})`} stroke="#e8c46a" strokeOpacity="0.55" strokeWidth="1.4" />
      <path d="M246 250 L192 228 L184 300 L236 316 Z" fill={`url(#${armor})`} stroke="#e8c46a" strokeOpacity="0.55" strokeWidth="1.4" />
      <g stroke="#38e1ff" strokeOpacity="0.32" strokeWidth="1">
        <path d="M82 264 L130 245M84 280 L132 262M86 296 L134 280" />
        <path d="M238 264 L190 245M236 280 L188 262M234 296 L186 280" />
      </g>

      {/* Torso */}
      <path d="M128 228 L192 228 L204 330 L116 330 Z" fill={`url(#${armor})`} stroke="#e8c46a" strokeOpacity="0.5" strokeWidth="1.4" />
      <g stroke="#e8c46a" strokeOpacity="0.28" strokeWidth="1">
        <path d="M124 250 L196 250M122 272 L198 272M120 294 L200 294M118 314 L202 314" />
      </g>
      <path d="M160 228 L160 330" stroke="#c8102e" strokeOpacity="0.65" strokeWidth="2" />
      <circle cx="160" cy="252" r="6" fill="none" stroke="#c8102e" strokeWidth="2" strokeOpacity="0.8" />
      <circle cx="160" cy="288" r="6" fill="none" stroke="#c8102e" strokeWidth="2" strokeOpacity="0.8" />

      {/* Cuello y guarda (shikoro) */}
      <path d="M126 226 C126 200 194 200 194 226 Z" fill="#0a0e18" stroke="#e8c46a" strokeOpacity="0.4" strokeWidth="1.2" />
      <path d="M116 214 C116 186 204 186 204 214" fill="none" stroke="#e8c46a" strokeOpacity="0.5" strokeWidth="1.6" />
      <path d="M110 202 C110 172 210 172 210 202" fill="none" stroke="#e8c46a" strokeOpacity="0.35" strokeWidth="1.4" />

      {/* Yelmo (kabuto) */}
      <path d="M112 176 C112 118 208 118 208 176 Z" fill={`url(#${armor})`} stroke="#e8c46a" strokeOpacity="0.7" strokeWidth="1.8" />
      <path d="M160 122 L160 176" stroke="#e8c46a" strokeOpacity="0.4" strokeWidth="1.4" />
      <path d="M130 140 C142 128 178 128 190 140" fill="none" stroke="#38e1ff" strokeOpacity="0.5" strokeWidth="1.6" />

      {/* Media luna (maedate) */}
      <path
        d="M160 74 C186 96 186 132 160 152 C172 128 172 96 160 74 Z"
        fill="#e8c46a"
        fillOpacity="0.9"
        stroke="#f9e9be"
        strokeWidth="1"
      />

      {/* Máscara (menpo) */}
      <path d="M124 178 C142 170 178 170 196 178 L190 206 C176 218 144 218 130 206 Z" fill="#12070c" stroke="#c8102e" strokeOpacity="0.8" strokeWidth="1.6" />
      <g stroke="#38e1ff" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.85">
        <path d="M136 188 L152 188" />
        <path d="M168 188 L184 188" />
      </g>
      <path d="M146 200 L174 200" stroke="#c8102e" strokeOpacity="0.55" strokeWidth="1.6" />

      {/* Katana */}
      <path d="M244 132 L96 372" stroke={`url(#${blade})`} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M244 132 L96 372" stroke="#f9e9be" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M238 144 L226 162" stroke="#c8102e" strokeWidth="7" strokeLinecap="round" strokeOpacity="0.9" />
      <circle cx="232" cy="154" r="4.5" fill="none" stroke="#e8c46a" strokeWidth="1.6" />
      <path d="M118 340 L134 344" stroke="#e8c46a" strokeWidth="2.4" strokeLinecap="round" strokeOpacity="0.7" />

      {/* Manos */}
      <circle cx="238" cy="146" r="8" fill="#0a0e18" stroke="#e8c46a" strokeOpacity="0.55" strokeWidth="1.4" />
      <circle cx="120" cy="332" r="8" fill="#0a0e18" stroke="#e8c46a" strokeOpacity="0.55" strokeWidth="1.4" />

      {/* Base luminosa */}
      <ellipse cx="160" cy="412" rx="108" ry="14" fill="#38e1ff" fillOpacity="0.08" />
      <ellipse cx="160" cy="412" rx="72" ry="8" fill="#e8c46a" fillOpacity="0.14" />
    </svg>
  );
}

export function LockedPhone({ className = '' }) {
  const uid = useId().replace(/:/g, '');
  const body = `body-${uid}`;
  const screen = `screen-${uid}`;
  const lock = `lock-${uid}`;
  const chip = `chip-${uid}`;

  return (
    <svg
      className={`hero-device-svg ${className}`.trim()}
      viewBox="0 0 260 440"
      role="img"
      aria-label="Teléfono futurista con candado y elementos tecnológicos"
    >
      <defs>
        <linearGradient id={body} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#243149" />
          <stop offset="45%" stopColor="#0d1424" />
          <stop offset="100%" stopColor="#05080f" />
        </linearGradient>
        <linearGradient id={screen} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1526" />
          <stop offset="55%" stopColor="#050a14" />
          <stop offset="100%" stopColor="#02040a" />
        </linearGradient>
        <linearGradient id={lock} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f9e9be" />
          <stop offset="55%" stopColor="#e8c46a" />
          <stop offset="100%" stopColor="#c8102e" />
        </linearGradient>
        <linearGradient id={chip} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38e1ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#2f7bff" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Halo */}
      <ellipse cx="130" cy="222" rx="118" ry="150" fill="#2f7bff" fillOpacity="0.09" />

      {/* Cuerpo del teléfono */}
      <rect x="42" y="26" width="176" height="372" rx="34" fill={`url(#${body})`} stroke="#38e1ff" strokeOpacity="0.4" strokeWidth="1.6" />
      <rect x="48" y="32" width="164" height="360" rx="29" fill={`url(#${screen})`} stroke="#e8c46a" strokeOpacity="0.22" strokeWidth="1" />

      {/* Muesca */}
      <rect x="104" y="40" width="52" height="9" rx="4.5" fill="#04060d" stroke="#38e1ff" strokeOpacity="0.25" strokeWidth="0.8" />

      {/* Barra de estado */}
      <g stroke="#38e1ff" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round">
        <path d="M66 62 L66 58M72 62 L72 55M78 62 L78 52" />
      </g>
      <circle cx="176" cy="58" r="5" fill="none" stroke="#e8c46a" strokeOpacity="0.6" strokeWidth="1.4" />
      <rect x="182" y="55" width="14" height="7" rx="2" fill="none" stroke="#e8c46a" strokeOpacity="0.6" strokeWidth="1.2" />

      {/* Rejilla técnica */}
      <g stroke="#38e1ff" strokeOpacity="0.12" strokeWidth="1">
        <path d="M58 92 H202M58 120 H202M58 148 H202M58 300 H202M58 328 H202M58 356 H202" />
      </g>

      {/* Candado */}
      <path d="M104 196 V176 a26 26 0 0 1 52 0 v20" fill="none" stroke={`url(#${lock})`} strokeWidth="7" strokeLinecap="round" />
      <rect x="92" y="196" width="76" height="62" rx="14" fill={`url(#${lock})`} fillOpacity="0.92" stroke="#f9e9be" strokeOpacity="0.6" strokeWidth="1.4" />
      <circle cx="130" cy="220" r="7" fill="#0a0e18" />
      <path d="M130 226 v12" stroke="#0a0e18" strokeWidth="4" strokeLinecap="round" />

      {/* Circuitos */}
      <g stroke="#38e1ff" strokeOpacity="0.45" strokeWidth="1.4" fill="none">
        <path d="M66 288 H96 L110 274" />
        <path d="M194 288 H164 L150 274" />
        <path d="M66 340 H100 L114 326" />
        <path d="M194 340 H160 L146 326" />
      </g>
      <g fill="#38e1ff" fillOpacity="0.8">
        <circle cx="66" cy="288" r="3" />
        <circle cx="194" cy="288" r="3" />
        <circle cx="66" cy="340" r="3" />
        <circle cx="194" cy="340" r="3" />
      </g>

      {/* Chips flotantes */}
      <g>
        <rect x="8" y="120" width="62" height="26" rx="8" fill="#060a14" stroke={`url(#${chip})`} strokeOpacity="0.55" strokeWidth="1.2" />
        <text x="39" y="137" textAnchor="middle" fill="#8fd8ff" fontSize="10" fontFamily="monospace" letterSpacing="1">
          IMEI
        </text>
      </g>
      <g>
        <rect x="190" y="196" width="62" height="26" rx="8" fill="#060a14" stroke="#e8c46a" strokeOpacity="0.5" strokeWidth="1.2" />
        <text x="221" y="213" textAnchor="middle" fill="#f9e9be" fontSize="10" fontFamily="monospace" letterSpacing="1">
          eSIM
        </text>
      </g>
      <g>
        <rect x="6" y="236" width="72" height="26" rx="8" fill="#060a14" stroke="#c8102e" strokeOpacity="0.55" strokeWidth="1.2" />
        <text x="42" y="253" textAnchor="middle" fill="#ff9a8f" fontSize="10" fontFamily="monospace" letterSpacing="1">
          ICCID
        </text>
      </g>

      {/* Base */}
      <ellipse cx="130" cy="404" rx="82" ry="10" fill="#38e1ff" fillOpacity="0.1" />
    </svg>
  );
}
