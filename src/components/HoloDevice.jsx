import { useId } from 'react';

/**
 * Dispositivo holográfico futurista — SVG original construido en el proyecto.
 *
 * Representa un smartphone de última generación con pantalla transparente y
 * profundidad, marco metálico luminoso, circuitos, escáner, candado de
 * seguridad holográfico e indicadores IMEI / ICCID / eSIM / NETWORK en
 * pequeñas interfaces flotantes.
 *
 * No usa imágenes externas ni datos reales: los identificadores aparecen
 * enmascarados porque las consultas aún no están conectadas.
 */
export function HoloDevice({ className = '' }) {
  const uid = useId().replace(/:/g, '');
  const g = (name) => `${name}-${uid}`;

  const chips = [
    { cls: 'holo-chip-imei', label: 'IMEI', value: '35•• •••••• ••' },
    { cls: 'holo-chip-iccid', label: 'ICCID', value: '89•• •••• ••••' },
    { cls: 'holo-chip-esim', label: 'eSIM', value: '•••• ••••' },
    { cls: 'holo-chip-net', label: 'NETWORK', value: 'PENDIENTE' },
  ];

  return (
    <div className={`holo-device ${className}`.trim()}>
      <span className="holo-aura" aria-hidden="true" />

      <svg className="holo-svg" viewBox="0 0 440 680" role="img" aria-labelledby={g('title')}>
        <title id={g('title')}>
          Dispositivo holográfico futurista con pantalla transparente, circuitos, escáner,
          candado de seguridad e indicadores IMEI, ICCID, eSIM y NETWORK
        </title>

        <defs>
          <linearGradient id={g('metal')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#eef6ff" />
            <stop offset="22%" stopColor="#9fb4cc" />
            <stop offset="46%" stopColor="#f6fbff" />
            <stop offset="70%" stopColor="#5f7c9b" />
            <stop offset="100%" stopColor="#cfe2f4" />
          </linearGradient>
          <linearGradient id={g('edge')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8ef2ff" />
            <stop offset="48%" stopColor="#38e1ff" />
            <stop offset="100%" stopColor="#2f7bff" />
          </linearGradient>
          <linearGradient id={g('glass')} x1="0.1" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor="#123a63" stopOpacity="0.74" />
            <stop offset="44%" stopColor="#0a1c33" stopOpacity="0.84" />
            <stop offset="100%" stopColor="#040a14" stopOpacity="0.94" />
          </linearGradient>
          <linearGradient id={g('scan')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38e1ff" stopOpacity="0" />
            <stop offset="50%" stopColor="#9ef6ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#38e1ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g('beam')} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#38e1ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#38e1ff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={g('core')} cx="50%" cy="44%" r="54%">
            <stop offset="0%" stopColor="#bff6ff" stopOpacity="0.75" />
            <stop offset="48%" stopColor="#38e1ff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#0a1c33" stopOpacity="0" />
          </radialGradient>
          <filter id={g('glow')} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={g('soft')} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <clipPath id={g('screen')}>
            <rect x="136" y="74" width="168" height="548" rx="24" />
          </clipPath>
        </defs>

        {/* Proyección y base luminosa */}
        <ellipse cx="220" cy="642" rx="152" ry="17" fill="#38e1ff" fillOpacity="0.2" filter={`url(#${g('soft')})`} />
        <path d="M148 642 L292 642 L346 452 L94 452 Z" fill={`url(#${g('beam')})`} opacity="0.45" />

        <g transform="rotate(-6 220 355)">
          {/* Marco metálico con canto luminoso */}
          <rect x="120" y="58" width="200" height="580" rx="34" fill={`url(#${g('metal')})`} />
          <rect
            x="120"
            y="58"
            width="200"
            height="580"
            rx="34"
            fill="none"
            stroke={`url(#${g('edge')})`}
            strokeWidth="2.2"
            opacity="0.95"
            filter={`url(#${g('glow')})`}
          />
          <rect x="128" y="66" width="184" height="564" rx="28" fill="#04070e" />

          {/* Cristal de la pantalla */}
          <rect x="136" y="74" width="168" height="548" rx="24" fill={`url(#${g('glass')})`} />
          <rect x="136" y="74" width="168" height="548" rx="24" fill={`url(#${g('core')})`} opacity="0.42" />
          <rect
            x="136"
            y="74"
            width="168"
            height="548"
            rx="24"
            fill="none"
            stroke="#8ef2ff"
            strokeOpacity="0.42"
            strokeWidth="1.1"
          />

          <g clipPath={`url(#${g('screen')})`}>
            {/* Retícula holográfica */}
            <g stroke="#38e1ff" strokeOpacity="0.09" strokeWidth="1">
              <path d="M164 74 V622M192 74 V622M220 74 V622M248 74 V622M276 74 V622" />
              <path d="M136 108 H304M136 142 H304M136 176 H304M136 210 H304M136 244 H304M136 278 H304M136 312 H304M136 346 H304M136 380 H304M136 414 H304M136 448 H304M136 482 H304M136 516 H304M136 550 H304M136 584 H304" />
            </g>

            {/* Circuitos electrónicos */}
            <g stroke="#38e1ff" strokeOpacity="0.45" strokeWidth="1.2" fill="none">
              <path d="M146 120 H186 V168 H214 V206" />
              <path d="M294 148 H262 V194 H236" />
              <path d="M146 468 H182 V518 H210" />
              <path d="M294 500 H258 V540 H232" />
              <path d="M160 596 H198 V566" />
            </g>
            <g fill="#8ef2ff">
              <circle cx="214" cy="206" r="2.4" />
              <circle cx="236" cy="194" r="2.4" />
              <circle cx="210" cy="518" r="2.4" />
              <circle cx="232" cy="540" r="2.4" />
              <circle cx="198" cy="566" r="2" />
              <circle cx="146" cy="120" r="2" />
              <circle cx="294" cy="148" r="2" />
            </g>

            {/* Encabezado de la interfaz */}
            <text x="150" y="98" fill="#9ef6ff" fontSize="10" letterSpacing="2.4" fontFamily="monospace">
              YORIICHI OS
            </text>
            <text x="150" y="112" fill="#5fd8ff" fontSize="7" letterSpacing="1.6" fontFamily="monospace" opacity="0.8">
              SECURE LINK · v2
            </text>
            <rect x="252" y="88" width="40" height="4" rx="2" fill="#38e1ff" fillOpacity="0.55" />
            <rect x="252" y="96" width="26" height="3" rx="1.5" fill="#38e1ff" fillOpacity="0.3" />

            {/* Candado holográfico */}
            <g className="holo-lock">
              <circle
                cx="220"
                cy="340"
                r="54"
                fill="none"
                stroke="#38e1ff"
                strokeOpacity="0.42"
                strokeWidth="1"
                strokeDasharray="4 10"
                className="holo-ring"
              />
              <circle cx="220" cy="340" r="42" fill="#38e1ff" fillOpacity="0.07" />
              <circle cx="220" cy="340" r="42" fill="none" stroke="#8ef2ff" strokeOpacity="0.34" strokeWidth="1" />
              <path
                d="M204 330 V318 A16 16 0 0 1 236 318 V330"
                fill="none"
                stroke="#bff6ff"
                strokeWidth="5"
                strokeLinecap="round"
                filter={`url(#${g('glow')})`}
              />
              <rect
                x="196"
                y="330"
                width="48"
                height="42"
                rx="9"
                fill="#0a1c33"
                stroke="#8ef2ff"
                strokeWidth="2"
                filter={`url(#${g('glow')})`}
              />
              <circle cx="220" cy="347" r="4.2" fill="#bff6ff" />
              <path d="M220 351 V360" stroke="#bff6ff" strokeWidth="3" strokeLinecap="round" />
              <text
                x="220"
                y="392"
                fill="#7fe4ff"
                fontSize="7.5"
                letterSpacing="2.6"
                fontFamily="monospace"
                textAnchor="middle"
              >
                ENCRYPTED
              </text>
            </g>

            {/* Filas de datos */}
            <g fill="#38e1ff">
              <rect x="150" y="440" width="58" height="4" rx="2" fillOpacity="0.5" />
              <rect x="150" y="450" width="34" height="3" rx="1.5" fillOpacity="0.28" />
              <rect x="150" y="478" width="46" height="4" rx="2" fillOpacity="0.42" />
              <rect x="150" y="488" width="70" height="3" rx="1.5" fillOpacity="0.24" />
            </g>

            {/* Huella / escáner inferior */}
            <g stroke="#38e1ff" strokeOpacity="0.5" strokeWidth="1.2" fill="none">
              <circle cx="220" cy="574" r="17" />
              <path d="M212 574 a8 8 0 0 1 16 0M208 580 a12 12 0 0 1 24 0" strokeOpacity="0.32" />
            </g>
            <rect x="192" y="604" width="56" height="4" rx="2" fill="#8ef2ff" fillOpacity="0.35" />

            {/* Línea de escaneo */}
            <rect className="holo-scan" x="136" y="74" width="168" height="58" fill={`url(#${g('scan')})`} />
          </g>

          {/* Muesca y cámara */}
          <rect x="192" y="80" width="56" height="9" rx="4.5" fill="#04070e" stroke="#38e1ff" strokeOpacity="0.3" />
          <circle cx="258" cy="84.5" r="3" fill="#0a1c33" stroke="#8ef2ff" strokeOpacity="0.7" />

          {/* Botones laterales */}
          <rect x="318" y="150" width="5" height="44" rx="2.5" fill={`url(#${g('metal')})`} />
          <rect x="318" y="212" width="5" height="70" rx="2.5" fill={`url(#${g('metal')})`} />
          <rect x="117" y="176" width="5" height="34" rx="2.5" fill={`url(#${g('metal')})`} />

          {/* Reflejo diagonal del cristal */}
          <path d="M150 74 L214 74 L166 622 L136 622 Z" fill="#bff6ff" fillOpacity="0.05" />
        </g>

        {/* Corchetes HUD */}
        <g stroke="#38e1ff" strokeOpacity="0.55" strokeWidth="1.6" fill="none">
          <path d="M74 92 V72 H94" />
          <path d="M366 72 H386 V92" />
          <path d="M386 612 V632 H366" />
          <path d="M94 632 H74 V612" />
        </g>
        <circle cx="220" cy="648" r="2.4" fill="#ff3b45" fillOpacity="0.9" />
      </svg>

      <div className="holo-chips" aria-hidden="true">
        {chips.map((chip) => (
          <span className={`holo-chip ${chip.cls}`} key={chip.label}>
            <b>{chip.label}</b>
            <i>{chip.value}</i>
          </span>
        ))}
      </div>
    </div>
  );
}
