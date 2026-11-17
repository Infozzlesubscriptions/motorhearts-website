import { Link } from "react-router-dom";
import { categories } from "@/data/articles";
import Logo from "./Logo";

const SiteFooter = () => (
  <footer className="border-t border-border">
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo className="text-3xl sm:text-3xl" />
          <p className="mt-5 max-w-sm leading-relaxed text-muted-foreground">
            An independent publication for people who live to drive. Considered journalism on the machines, makers and
            roads that move us.
          </p>
        </div>
        <div className="md:col-span-4">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Sections</p>
          <ul className="grid grid-cols-2 gap-y-3 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={`/?topic=${c.slug}`} className="text-foreground/80 transition-colors hover:text-primary">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Our philosophy</p>
          <p className="font-serif text-2xl italic leading-snug text-foreground/80">The road is the destination.</p>
          <a href="/#about" className="mt-5 inline-block text-sm text-muted-foreground transition-colors hover:text-primary">About MotorHearts →</a>
        </div>
      </div>
      <div className="mt-16 flex flex-col gap-3 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} MotorHearts.com. All rights reserved.</p>
        <p>Made for those who feel it in their chest.</p>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
