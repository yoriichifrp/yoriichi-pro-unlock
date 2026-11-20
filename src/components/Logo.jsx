import { useId } from 'react';

/** Marca original YORIICHI PRO UNLOCK: emblema de guerrero y wordmark plateado/dorado. */
export function LogoMark({ size = 44 }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      className="brand-mark"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="YORIICHI PRO UNLOCK"
    >
      <defs>
        <radialGradient id={`disc-${id}`} cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#ff7a5c" />
          <stop offset="55%" stopColor="#c8102e" />
          <stop offset="100%" stopColor="#3d0509" />
        </radialGradient>
        <linearGradient id={`edge-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f9e9be" />
          <stop offset="55%" stopColor="#e8c46a" />
          <stop offset="100%" stopColor="#b8913c" />
        </linearGradient>
        <linearGradient id={`steel-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#c9d6e8" />
          <stop offset="100%" stopColor="#38e1ff" />
        </linearGradient>
      </defs>

      <rect x="1.5" y="1.5" width="61" height="61" rx="16" fill="#06090f" stroke={`url(#edge-${id})`} strokeWidth="1.6" />
      <circle cx="32" cy="30" r="20" fill={`url(#disc-${id})`} fillOpacity="0.92" />
      <circle cx="32" cy="30" r="20" fill="none" stroke="#f9e9be" strokeOpacity="0.35" strokeWidth="1" />

      {/* Rostro estilizado del guerrero */}
      <path d="M22 26 C24 19 40 19 42 26 L41 34 C38 40 26 40 23 34 Z" fill="#0a0d14" stroke={`url(#edge-${id})`} strokeWidth="1.2" />
      <path d="M25 28 L31 28M33 28 L39 28" stroke="#ff3b2f" strokeWidth="2" strokeLinecap="round" />
      <path d="M28 35 L36 35" stroke="#c8102e" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M20 24 C16 32 18 40 22 44 L26 32 Z" fill="#12080c" stroke="#c8102e" strokeOpacity="0.45" strokeWidth="1" />
      <path d="M44 24 C48 32 46 40 42 44 L38 32 Z" fill="#12080c" stroke="#c8102e" strokeOpacity="0.45" strokeWidth="1" />

      {/* Hoja de acero */}
      <path d="M47 44 L26 56 L33 46 L28 44 L45 38 Z" fill={`url(#steel-${id})`} opacity="0.92" />
    </svg>
  );
}

export function Logo({ size = 44, showText = true }) {
  return (
    <span className="brand">
      <span className="brand-emblem">
        <LogoMark size={size} />
      </span>
      {showText && (
        <span className="brand-text">
          <span className="brand-name">YORIICHI</span>
          <span className="brand-suffix">PRO UNLOCK</span>
        </span>
      )}
    </span>
  );
}
