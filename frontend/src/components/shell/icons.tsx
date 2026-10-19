type IconProps = { className?: string };

const base = "h-5 w-5";

export function HomeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className ?? base} aria-hidden="true">
      <path d="M4 11 12 4l8 7" strokeLinecap="square" />
      <path d="M6 10v10h12V10" strokeLinecap="square" />
    </svg>
  );
}

export function RoutineIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className ?? base} aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="square" />
    </svg>
  );
}

export function ProductIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className ?? base} aria-hidden="true">
      <rect x="7" y="3" width="10" height="18" />
      <path d="M7 9h10" strokeLinecap="square" />
    </svg>
  );
}

export function IngredientIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className ?? base} aria-hidden="true">
      <path d="M12 3c3.5 4.5 6 7.5 6 10.5A6 6 0 0 1 6 13.5C6 10.5 8.5 7.5 12 3Z" strokeLinejoin="round" />
    </svg>
  );
}

export function AskIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className ?? base} aria-hidden="true">
      <path d="M4 5h16v11H9l-5 4V5Z" strokeLinejoin="round" />
    </svg>
  );
}

export function MicIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className ?? base} aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" strokeLinecap="square" />
    </svg>
  );
}

export function SkinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className ?? base} aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M9 10h.01M15 10h.01M9 15c1.5 1.2 4.5 1.2 6 0" strokeLinecap="round" />
    </svg>
  );
}
