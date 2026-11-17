import { Link } from "react-router-dom";

const Logo = ({ className = "" }: { className?: string }) => (
  <Link
    to="/"
    aria-label="MotorHearts — home"
    className={`inline-flex w-[170px] max-w-full shrink-0 items-center sm:w-[205px] ${className}`}
  >
    <img
      src="/motorhearts-logo.png"
      alt="MotorHearts"
      decoding="async"
      className="h-[54px] w-full object-contain sm:h-[60px]"
    />
  </Link>
);

export default Logo;
