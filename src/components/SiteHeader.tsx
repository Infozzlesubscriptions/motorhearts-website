import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useContent } from "@/lib/ContentContext";
import Logo from "./Logo";

export default function SiteHeader() {
  const { content } = useContent();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const location = useLocation();
  useEffect(() => setOpen(false), [location]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "/" && !["INPUT", "TEXTAREA"].includes((event.target as HTMLElement)?.tagName)) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return content.articles.filter(article => {
      const category = content.categories.find(item => item.id === article.categoryId)?.name ?? "";
      const author = content.authors.find(item => item.id === article.authorId)?.name ?? "";
      return `${article.title} ${article.dek} ${category} ${author}`.toLowerCase().includes(term);
    }).slice(0, 8);
  }, [content, query]);
  const links = <><Link to="/" className="text-[13px] font-medium">Home</Link>{content.categories.map(category => <Link key={category.id} to={`/category/${category.slug}`} className="text-[13px] font-medium">{category.name}</Link>)}<Link to="/guides" className="text-[13px] font-medium">Guides</Link></>;

  return <>
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between gap-5 px-5 sm:h-20 sm:px-8 lg:px-12">
        <Logo />
        <nav className="hidden min-w-0 flex-1 items-center justify-start gap-4 overflow-x-auto whitespace-nowrap 2xl:flex">{links}</nav>
        <div className="flex items-center gap-2">
          <button aria-label="Search stories" onClick={() => setSearchOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:border-foreground/50"><Search className="h-4 w-4" /></button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild><button aria-label="Open menu" className="flex h-10 w-10 items-center justify-center rounded-full border border-border 2xl:hidden"><Menu className="h-4 w-4" /></button></SheetTrigger>
            <SheetContent side="right" className="w-full overflow-y-auto border-border bg-background px-7 pt-14 sm:max-w-sm">
              <SheetTitle className="sr-only">Site navigation</SheetTitle>
              <nav className="flex flex-col gap-5 text-lg">{links}<Link to="/articles">All articles</Link><Link to="/authors">Authors</Link><Link to="/about">About</Link></nav>
              <button onClick={() => { setOpen(false); setSearchOpen(true); }} className="mt-8 flex items-center gap-3 text-muted-foreground"><Search className="h-4 w-4" /> Search the journal</button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogContent className="top-[20%] max-w-2xl translate-y-0 border-border bg-card p-6 sm:p-8">
        <DialogTitle className="font-display text-2xl font-bold">Search the journal</DialogTitle>
        <div className="relative mt-5"><Input aria-label="Search stories, categories, or authors" autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Try a story, category or author" className="h-12 border-border bg-background pr-10" /><button aria-label="Clear search" onClick={() => setQuery("")} className="absolute right-3 top-3 text-muted-foreground"><X className="h-5 w-5" /></button></div>
        <div className="mt-5 max-h-[50vh] space-y-2 overflow-y-auto">{query.trim() && results.length === 0 && <p className="py-6 text-sm text-muted-foreground">No stories match that search. Try another term.</p>}{results.map(article => <Link key={article.slug} onClick={() => setSearchOpen(false)} to={`/article/${article.slug}`} className="block rounded-lg border border-border p-4 hover:bg-background"><span className="text-[10px] uppercase tracking-widest text-primary">{content.categories.find(category => category.id === article.categoryId)?.name}</span><p className="mt-1 font-display font-semibold">{article.title}</p><p className="mt-1 text-sm text-muted-foreground">{article.dek}</p></Link>)}</div>
      </DialogContent>
    </Dialog>
  </>;
}
