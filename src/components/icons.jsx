const ICONS = {
  apple: (
    <>
      <path d="M12 6.5c1.6-2 4.2-2.2 5.4-1.4-.2 1.9-1.5 3.3-3.4 3.5" />
      <path d="M12.4 8.6c-2.6-1-5.6.3-6.6 3.2-.9 2.8.6 6.6 3.2 8.1 1.2.7 2.4.7 3.4.1 1 .6 2.2.6 3.4-.1 2.6-1.5 4.1-5.3 3.2-8.1-1-2.9-4-4.2-6.6-3.2z" />
    </>
  ),
  android: (
    <>
      <rect x="5" y="7" width="14" height="12" rx="3" />
      <path d="M8 7 6.5 4M16 7l1.5-3M3 11v5M21 11v5M9 19v2M15 19v2" />
      <circle cx="9.5" cy="11.5" r=".8" fill="currentColor" />
      <circle cx="14.5" cy="11.5" r=".8" fill="currentColor" />
    </>
  ),
  imei: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="2.5" />
      <path d="M9 7h6M9 17h6" />
      <path d="M12 10.5v4M10.5 12.5h3" />
    </>
  ),
  network: (
    <>
      <path d="M3 9a13 13 0 0 1 18 0M6.5 12.5a8 8 0 0 1 11 0M10 16a3.2 3.2 0 0 1 4 0" />
      <circle cx="12" cy="19.5" r="1" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4.2 3 7.6 7 9 4-1.4 7-4.8 7-9V6z" />
      <path d="M9.2 12.2l2 2 3.6-3.8" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="10" rx="2.4" />
      <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" />
      <circle cx="12" cy="15" r="1.3" />
    </>
  ),
  sim: (
    <>
      <path d="M7 3h7l4 4v14H7z" />
      <rect x="9.5" y="10" width="6" height="6" rx="1" />
      <path d="M9.5 13h6" />
    </>
  ),
  chip: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" />
    </>
  ),
  whatsapp: <path d="M20 12a8 8 0 0 1-11.9 7L4 20l1.1-3.9A8 8 0 1 1 20 12zM8.6 8.9c.5 2.9 2.6 5 5.5 5.5" />,
  telegram: <path d="M21 4 3 11l5 2 2 6 3-4 5 3z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M4 7l8 6 8-6" />
    </>
  ),
};

export function CategoryIcon({ name, size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name] || ICONS.chip}
    </svg>
  );
}
