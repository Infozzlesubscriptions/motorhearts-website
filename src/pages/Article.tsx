import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ArticleCard from "@/components/ArticleCard";
import { articles, formatDate, getArticle, getCategory } from "@/data/articles";

const Article = () => {
  const { slug } = useParams();
  const article = getArticle(slug || "");
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = article ? `${article.title} — MotorHearts` : "Story not found — MotorHearts";
  }, [article]);

  if (!article) return <><SiteHeader /><main className="mx-auto min-h-[70vh] max-w-7xl px-6 pb-20 pt-40"><p className="text-xs uppercase tracking-widest text-primary">Lost on the road</p><h1 className="my-6 font-display text-4xl font-bold">This story couldn't be found.</h1><Link to="/" className="inline-flex items-center gap-3 text-sm"><ArrowLeft className="h-4 w-4" /> Return to the journal</Link></main><SiteFooter /></>;

  const category = getCategory(article.category);
  const related = articles.filter(a => a.slug !== article.slug && a.category === article.category);
  const selection = [...related, ...articles.filter(a => a.slug !== article.slug && a.category !== article.category)].slice(0, 3);

  return <>
    <SiteHeader />
    <main className="pt-16 sm:pt-20">
      <header className="mx-auto max-w-5xl px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-16">
        <Link to={`/?topic=${article.category}`} className="mb-10 inline-flex items-center gap-3 text-xs text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className="h-3.5 w-3.5" /> Back to {category?.name}</Link>
        <div className="mb-5 flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.22em]"><Link to={`/?topic=${article.category}`} className="text-primary">{category?.name}</Link><span className="h-px w-7 bg-border" /><span className="text-muted-foreground">{article.readTime} min read</span></div>
        <h1 className="max-w-4xl font-display text-4xl font-extrabold leading-[1.08] tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl">{article.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">{article.dek}</p>
        <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-border pt-6"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-card font-display text-xs font-bold">{article.author.split(" ").map(n => n[0]).join("")}</div><div><p className="text-xs font-semibold">{article.author}</p><p className="mt-1 text-[11px] text-muted-foreground">{article.authorRole}</p></div><span className="ml-auto text-xs text-muted-foreground">{formatDate(article.date)}</span></div>
      </header>
      <figure className="mx-auto max-w-[1440px] px-5 sm:px-8"><img src={article.image} alt={article.title} className="aspect-[4/3] w-full rounded-2xl object-cover sm:aspect-[21/10]" fetchPriority="high" /><figcaption className="mt-3 text-right text-[10px] uppercase tracking-wider text-muted-foreground">Editorial imagery · Unsplash</figcaption></figure>
      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        {article.specs && <aside className="mb-12 grid grid-cols-2 gap-6 rounded-2xl border border-border bg-card p-7 sm:grid-cols-4"><h2 className="sr-only">At a glance</h2>{article.specs.map(s => <div key={s.label}><p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p><p className="font-display text-lg font-semibold">{s.value}</p></div>)}<p className="col-span-2 text-[10px] text-muted-foreground sm:col-span-4">Illustrative specifications for this sample editorial feature.</p></aside>}
        <article className="space-y-7 font-serif text-lg leading-[1.85] text-foreground/85 sm:text-xl">
          {article.body.map((paragraph, i) => <div key={i}><p className={i === 0 ? "first-letter:float-left first-letter:mr-3 first-letter:mt-2 first-letter:font-display first-letter:text-6xl first-letter:font-bold first-letter:leading-none first-letter:text-foreground" : ""}>{paragraph}</p>{i === 1 && <blockquote className="my-12 border-l-2 border-primary py-2 pl-7 font-display text-2xl font-semibold leading-snug tracking-tight text-foreground sm:text-3xl">“{article.pullQuote}”</blockquote>}</div>)}
        </article>
        <div className="mt-12 flex items-center justify-between border-y border-border py-6"><p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">An independent perspective</p><Link to={`/?topic=${article.category}`} className="inline-flex items-center gap-2 text-xs font-medium transition-colors hover:text-primary">More {category?.name} <ArrowUpRight className="h-4 w-4" /></Link></div>
        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">This is a curated sample story for the MotorHearts editorial showcase. Names, experiences and specifications are illustrative.</p>
      </div>
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-24"><div className="mb-9"><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">Keep exploring</p><h2 className="font-display text-3xl font-bold tracking-tight">The journey continues.</h2></div><div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-3">{selection.map(a => <ArticleCard key={a.slug} article={a} />)}</div></section>
    </main>
    <SiteFooter />
  </>;
};

export default Article;
