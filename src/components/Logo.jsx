import { useId } from 'react';

/** Marca original YORIICHI PRO UNLOCK: disco solar, rayos y hoja de acero. */
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
        <radialGradient id={`sun-${id}`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#ffe6ad" />
          <stop offset="45%" stopColor="#ff5b3f" />
          <stop offset="100%" stopColor="#7a0d12" />
        </radialGradient>
        <linearGradient id={`blade-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f8e3b0" />
          <stop offset="60%" stopColor="#e9c887" />
          <stop offset="100%" stopColor="#37b6ff" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="22" fill={`url(#sun-${id})`} />
      <circle cx="32" cy="32" r="22" fill="none" stroke="#e9c887" strokeWidth="1.2" opacity="0.8" />
      <g stroke="#05060a" strokeWidth="2" strokeLinecap="round" opacity="0.85">
        <path d="M32 10v6M32 48v6M10 32h6M48 32h6M16.5 16.5l4.2 4.2M43.3 43.3l4.2 4.2M47.5 16.5l-4.2 4.2M20.7 43.3l-4.2 4.2" />
      </g>
      <path d="M42 14 L22 34 L29 34 L22 50 L46 26 L37 26 Z" fill={`url(#blade-${id})`} />
    </svg>
  );
}

export function Logo({ size = 44, showText = true }) {
  return (
    <span className="brand">
      <LogoMark size={size} />
      {showText && (
        <span className="brand-text">
          <span className="brand-name">YORIICHI</span>
          <span className="brand-suffix">PRO UNLOCK</span>
        </span>
      )}
    </span>
  );
}
