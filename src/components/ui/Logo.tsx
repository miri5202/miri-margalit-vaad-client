interface LogoProps {
  className?: string;
}

// לוגו: בניין קטן מצויר עם חלונות מוארים
function Logo({ className = "size-9" }: LogoProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect x="7" y="12" width="26" height="25" rx="3" fill="var(--wall)" stroke="var(--ink)" strokeWidth="2.5" />
      <path d="M4 14 L20 3 L36 14" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="12" y="17" width="6" height="6" rx="1" fill="#ffcf5c" stroke="var(--ink)" strokeWidth="2" />
      <rect x="22" y="17" width="6" height="6" rx="1" fill="#ffcf5c" stroke="var(--ink)" strokeWidth="2" />
      <rect x="17" y="27" width="6" height="10" rx="1" fill="#ff7a5c" stroke="var(--ink)" strokeWidth="2" />
    </svg>
  );
}

export default Logo;
