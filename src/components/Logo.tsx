import { Link } from "react-router-dom";

const letters = [
  { x: 0, d: "M0 22V2L8 13L16 2V22" },
  { x: 23, d: "M5 2H9Q14 2 14 7V17Q14 22 9 22H5Q0 22 0 17V7Q0 2 5 2Z" },
  { x: 44, d: "M0 2H14M7 2V22" },
  { x: 65, d: "M5 2H9Q14 2 14 7V17Q14 22 9 22H5Q0 22 0 17V7Q0 2 5 2Z" },
  { x: 86, d: "M0 22V2H8Q14 2 14 7Q14 12 8 12H0M8 12L15 22" },
  { x: 109, d: "M0 2V22M14 2V22M0 12H14" },
  { x: 132, d: "M14 2H0V22H14M0 12H11" },
  { x: 153, d: "M0 22L7 2L14 22M3 15H11" },
  { x: 174, d: "M0 22V2H8Q14 2 14 7Q14 12 8 12H0M8 12L15 22" },
  { x: 197, d: "M0 2H14M7 2V22" },
  { x: 218, d: "M14 2H5Q0 2 0 7Q0 12 7 12Q14 12 14 17Q14 22 9 22H0" },
];

const Logo = ({ className = "" }: { className?: string }) => (
  <Link
    to="/"
    aria-label="MotorHearts — home"
    className={`inline-flex w-[170px] max-w-full shrink-0 items-center text-foreground sm:w-[205px] ${className}`}
  >
    <svg viewBox="0 0 300 48" width="300" height="48" className="h-auto w-full" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M4 36V12L16 25L28 12V36M28 25H40M40 12V36" />
        <path d="M28 5H40" stroke="hsl(var(--primary))" strokeWidth="2.8" />
      </g>
      <g transform="translate(60 12)" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="square" strokeLinejoin="round">
        {letters.map(letter => <path key={letter.x} transform={`translate(${letter.x} 0)`} d={letter.d} />)}
      </g>
    </svg>
    <span className="sr-only">MotorHearts</span>
  </Link>
);

export default Logo;
