import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { categories } from "@/data/articles";
import Logo from "./Logo";

const SiteHeader = ({ overlay = false }: { overlay?: boolean }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  const solid = !overlay || scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid ? "border-b border-border bg-background/90 backdrop-blur-xl" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-5 lg:flex">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/?topic=${c.slug}`}
              className="relative text-[13px] font-medium tracking-wide text-foreground/75 transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform hover:text-foreground hover:after:scale-x-100"
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/#about"
            className="hidden rounded-full border border-border px-5 py-2 text-[13px] font-semibold transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground sm:inline-flex"
          >
            Our story
          </a>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:border-foreground/40 lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full border-border bg-background px-8 pt-16 sm:max-w-sm">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Sections</p>
              <nav className="flex flex-col">
                {categories.map((c, i) => (
                  <Link
                    key={c.slug}
                    to={`/?topic=${c.slug}`}
                    className="group flex items-baseline gap-4 border-b border-border py-4 font-display text-2xl font-bold transition-colors hover:text-primary"
                  >
                    <span className="text-xs font-medium text-muted-foreground">0{i + 1}</span>
                    {c.name}
                  </Link>
                ))}
              </nav>
              <a
                href="/#about"
                onClick={() => setOpen(false)}
                className="mt-10 inline-flex w-full items-center justify-center rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
              >
                The MotorHearts story
              </a>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
