import { Link } from "react-router-dom";

const Logo = ({ className = "" }: { className?: string }) => (
  <Link
    to="/"
    aria-label="MotorHearts — home"
    className={`inline-flex w-[170px] max-w-full shrink-0 items-center text-foreground sm:w-[205px] ${className}`}
  >
    <svg viewBox="0 0 280 80" width="280" height="80" className="h-[54px] w-full sm:h-[60px]" aria-hidden="true" focusable="false">
      <g transform="translate(8 6) scale(1.1)" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 48A24 24 0 1 1 50 48" />
        <path d="M10 25L32 32L54 25M32 32L23 50M32 32L41 50" />
        <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
        <path d="M27 55H37" stroke="hsl(var(--primary))" strokeWidth="4" />
      </g>
      <text x="120" y="36" fontFamily="Inter, Arial, sans-serif" fontSize="25" fontWeight="500" letterSpacing="6.4" fill="currentColor">MOTOR</text>
      <text x="119" y="71" fontFamily="Inter, Arial, sans-serif" fontSize="30" fontWeight="600" letterSpacing="4.3" fill="currentColor">HEARTS</text>
    </svg>
    <span className="sr-only">MotorHearts</span>
  </Link>
);

export default Logo;
