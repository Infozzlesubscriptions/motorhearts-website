import { Link } from "react-router-dom";

const Logo = ({ className = "" }: { className?: string }) => (
  <Link
    to="/"
    aria-label="MotorHearts — home"
    className={`inline-flex w-[170px] max-w-full shrink-0 items-center text-foreground sm:w-[205px] ${className}`}
  >
    <svg viewBox="0 0 360 125" width="360" height="125" className="h-[54px] w-full sm:h-[60px]" aria-hidden="true" focusable="false">
      <g transform="translate(148 1)" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 50C7 48 5 34 9 22C14 7 50 7 55 22C59 34 57 48 48 50Z" />
        <path d="M8 29H22L32 38L42 29H56M32 38V50" />
        <path d="M28 11.3Q32 10.7 36 11.3" stroke="hsl(var(--primary))" strokeWidth="4" />
      </g>
      <text x="180" y="113" textAnchor="middle" fontFamily="'Source Serif 4', Georgia, serif" fontSize="34" fontWeight="400" letterSpacing="3.6" fill="currentColor">MOTORHEARTS</text>
    </svg>
    <span className="sr-only">MotorHearts</span>
  </Link>
);

export default Logo;
