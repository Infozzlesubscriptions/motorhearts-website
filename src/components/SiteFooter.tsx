import { Link } from "react-router-dom";
import { useContent } from "@/lib/ContentContext";
import Logo from "./Logo";

export default function SiteFooter() {
  const { content } = useContent();
  return <footer className="border-t border-border">
    <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="text-3xl" />
          <p className="mt-5 max-w-xs text-sm leading-7 text-muted-foreground">An independent editorial showcase for people who live to drive. Considered stories about machines, makers and roads.</p>
        </div>
        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Explore</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link to="/">Home</Link><Link to="/articles">All articles</Link>
            <Link to="/guides">Guides</Link><Link to="/authors">Authors</Link>
            {content.categories.map(c => <Link key={c.id} to={`/category/${c.slug}`}>{c.name}</Link>)}
          </div>
        </div>
        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">The publication</p>
          <div className="flex flex-col gap-3 text-sm">
            <Link to="/about">About</Link>
            <Link to="/editorial-policy">Editorial policy</Link>
            <Link to="/privacy-policy">Privacy policy</Link>
            <Link to="/brand-concepts">Logo concepts</Link>
          </div>
        </div>
        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Share MotorHearts</p>
          <div className="flex flex-col gap-3 text-sm">
            <a target="_blank" rel="noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}>Share to Facebook</a>
            <a target="_blank" rel="noreferrer" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent("MotorHearts — automotive stories")}`}>Share to X</a>
            <a target="_blank" rel="noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}>Share to LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} MotorHearts. Independent editorial showcase.</p>
        <p>Illustrative sample features; no legal or professional assurance.</p>
      </div>
    </div>
  </footer>;
}
