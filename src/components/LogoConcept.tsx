export type LogoConceptId = "precision" | "grand-tourer" | "apex";

type Props = {
  concept: LogoConceptId;
  iconOnly?: boolean;
  size?: number;
  className?: string;
};

function Wheel({ concept }: { concept: LogoConceptId }) {
  if (concept === "precision") return <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="32" cy="32" r="24" />
    <path d="M12 25L32 32L52 25M32 36V56" />
    <circle cx="32" cy="32" r="4" fill="currentColor" stroke="none" />
    <path d="M28 8.34A24 24 0 0 1 36 8.34" stroke="hsl(var(--primary))" strokeWidth="4" />
  </g>;

  if (concept === "grand-tourer") return <g fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 50C7 48 5 34 9 22C14 7 50 7 55 22C59 34 57 48 48 50Z" />
    <path d="M8 29H22L32 38L42 29H56M32 38V50" />
    <path d="M28 11.3Q32 10.7 36 11.3" stroke="hsl(var(--primary))" strokeWidth="4" />
  </g>;

  return <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 48A24 24 0 1 1 50 48" />
    <path d="M10 25L32 32L54 25M32 32L23 50M32 32L41 50" />
    <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
    <path d="M27 55H37" stroke="hsl(var(--primary))" strokeWidth="4" />
  </g>;
}

export default function LogoConcept({ concept, iconOnly = false, size = 32, className = "" }: Props) {
  if (iconOnly) return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} className={`shrink-0 text-[#F5F5F5] ${className}`} role="img" aria-label={`${concept} favicon study`}>
    <rect width="64" height="64" rx="14" fill="#111214" />
    <Wheel concept={concept} />
  </svg>;

  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 180" width="560" height="180" className={`h-auto w-full ${className}`} role="img" aria-label={`MotorHearts ${concept} logo concept`}>
    {concept === "precision" && <>
      <g transform="translate(100 58)"><Wheel concept={concept} /></g>
      <text x="194" y="102" fontFamily="Inter, Arial, sans-serif" fontSize="29" fontWeight="600" letterSpacing="2.6" fill="currentColor">MOTORHEARTS</text>
    </>}
    {concept === "grand-tourer" && <>
      <g transform="translate(248 21)"><Wheel concept={concept} /></g>
      <text x="280" y="133" textAnchor="middle" fontFamily="'Source Serif 4', Georgia, serif" fontSize="34" fontWeight="400" letterSpacing="3.6" fill="currentColor">MOTORHEARTS</text>
    </>}
    {concept === "apex" && <>
      <g transform="translate(151 54) scale(1.1)"><Wheel concept={concept} /></g>
      <text x="263" y="84" fontFamily="Inter, Arial, sans-serif" fontSize="25" fontWeight="500" letterSpacing="6.4" fill="currentColor">MOTOR</text>
      <text x="262" y="119" fontFamily="Inter, Arial, sans-serif" fontSize="30" fontWeight="600" letterSpacing="4.3" fill="currentColor">HEARTS</text>
    </>}
  </svg>;
}
