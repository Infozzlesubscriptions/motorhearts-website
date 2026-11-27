import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useContent } from "@/lib/ContentContext";
import Logo from "./Logo";
import { isPublicCategory } from "@/lib/categories";

export default function SiteHeader() {
  const { content, loading } = useContent();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => { setOpen(false); setSearchOpen(false); }, [location.pathname]);
  useEffect(() => {
    let previous = window.scrollY > 32;
    setScrolled(previous);
    const onScroll = () => {
      const next = window.scrollY > 32;
      if (next !== previous) { previous = next; setScrolled(next); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName) && !target?.isContentEditable) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term || loading) return [];
    return content.articles.filter(article => {
      const category = content.categories.find(item => item.id === article.categoryId)?.name ?? "";
      const author = content.authors.find(item => item.id === article.authorId)?.name ?? "";
      return `${article.title} ${article.dek} ${category} ${author}`.toLowerCase().includes(term);
    }).slice(0, 8);
  }, [content, query, loading]);

  const sections = [
    { to: "/", name: "Home" },
    ...content.categories.filter(isPublicCategory).map(category => ({ to: `/category/${category.slug}`, name: category.name })),
    { to: "/guides", name: "Guides" },
  ];

  return <>
    <header className={`fixed inset-x-0 top-0 z-40 border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 ${scrolled ? "border-border bg-card/95 shadow-[0_8px_32px_rgba(0,0,0,0.12)]" : "border-border/60 bg-background/95"}`}>
      <div className={`mx-auto flex max-w-[1600px] items-center justify-between gap-5 px-5 transition-[height] duration-300 sm:px-8 lg:px-12 ${scrolled ? "h-16 sm:h-[72px]" : "h-[68px] sm:h-20"}`}>
        <Logo />
        <nav aria-label="Primary navigation" className="no-scrollbar hidden min-w-0 flex-1 items-center gap-4 overflow-x-auto whitespace-nowrap py-3 2xl:flex">
          {sections.map(section => <NavLink key={section.to} to={section.to} end className="nav-link text-[13px] font-medium">{section.name}</NavLink>)}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <button aria-label="Search stories" onClick={() => setSearchOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:border-foreground/40 hover:bg-secondary"><Search className="h-4 w-4" /></button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button aria-label="Open navigation menu" className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:border-foreground/40 hover:bg-secondary 2xl:hidden"><Menu className="h-4 w-4" /></button>
            </SheetTrigger>
            <SheetContent side="right" onCloseAutoFocus={event => { if (searchOpen) event.preventDefault(); }} className="mobile-menu w-full overflow-y-auto border-border bg-background px-7 pt-14 data-[state=closed]:duration-200 data-[state=open]:duration-300 sm:max-w-md">
              <SheetTitle className="font-display text-2xl font-bold"><Logo /></SheetTitle>
              <SheetDescription className="mb-8 mt-2 text-xs text-muted-foreground">Six worlds. One passion.</SheetDescription>
              <nav aria-label="Mobile navigation" className="flex flex-col gap-5">
                {[...sections, { to: "/articles", name: "All articles" }, { to: "/authors", name: "Authors" }, { to: "/about", name: "About" }].map((section, index) => <NavLink
                  key={section.to} to={section.to} end className="nav-link font-display text-lg font-semibold"
                  style={{ "--menu-delay": `${Math.min(index * 20, 140)}ms` } as CSSProperties}
                >{section.name}</NavLink>)}
              </nav>
              <button onClick={() => { setOpen(false); setSearchOpen(true); }} className="mt-9 flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"><Search className="h-4 w-4" /> Search the journal</button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogContent className="top-[10%] max-h-[85dvh] max-w-2xl translate-y-0 overflow-y-auto rounded-2xl border-border bg-card p-6 sm:top-[15%] sm:p-8">
        <DialogTitle className="font-display text-2xl font-bold">Search the journal</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">Find stories by title, category or author.</DialogDescription>
        <div className="relative mt-3">
          <Input aria-label="Search stories, categories, or authors" autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Try a story, category or author" className="h-12 rounded-xl border-border bg-background pr-10" />
          <button aria-label="Clear search" onClick={() => setQuery("")} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-3 max-h-[45dvh] space-y-2 overflow-y-auto">
          {loading && <p role="status" className="py-6 text-sm text-muted-foreground">Loading WordPress stories…</p>}
          {!loading && query.trim() && results.length === 0 && <p role="status" className="py-6 text-sm text-muted-foreground">No stories match that search. Try another term.</p>}
          {results.map(article => <Link key={article.slug} onClick={() => setSearchOpen(false)} to={`/article/${article.slug}`} className="block rounded-xl border border-border p-4 hover:border-foreground/30 hover:bg-background">
            <span className="text-[10px] uppercase tracking-widest text-primary">{content.categories.find(category => category.id === article.categoryId)?.name}</span>
            <p className="mt-1 font-display font-semibold">{article.title}</p>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{article.dek}</p>
          </Link>)}
        </div>
      </DialogContent>
    </Dialog>
  </>;
}
