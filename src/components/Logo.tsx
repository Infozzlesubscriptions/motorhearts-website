import { Link } from "react-router-dom";

const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`group inline-flex items-baseline font-display text-xl font-black uppercase tracking-tight sm:text-2xl ${className}`}>
    <span>Motor</span>
    <span className="font-semibold text-muted-foreground transition-colors group-hover:text-foreground">Hearts</span>
    <span className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
  </Link>
);

export default Logo;
