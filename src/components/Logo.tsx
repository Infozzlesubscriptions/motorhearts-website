import { Link } from "react-router-dom";

const Logo = ({ className = "" }: { className?: string }) => (
  <Link
    to="/"
    aria-label="MotorHearts — home"
    className={`inline-flex w-[170px] max-w-full shrink-0 items-center text-foreground sm:w-[205px] ${className}`}
  >
    <svg viewBox="0 0 360 64" width="360" height="64" className="h-auto w-full" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="32" cy="32" r="24" />
        <path d="M12 25L32 32L52 25M32 36V56" />
        <circle cx="32" cy="32" r="4" fill="currentColor" stroke="none" />
        <path d="M28 8.34A24 24 0 0 1 36 8.34" stroke="hsl(var(--primary))" strokeWidth="4" />
      </g>
      <text x="94" y="44" fontFamily="Inter, Arial, sans-serif" fontSize="29" fontWeight="600" letterSpacing="2.6" fill="currentColor">MOTORHEARTS</text>
    </svg>
    <span className="sr-only">MotorHearts</span>
  </Link>
);

export default Logo;
