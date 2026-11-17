import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ArticleCard from "@/components/ArticleCard";
import EditorialImage from "@/components/EditorialImage";
import Reveal from "@/components/Reveal";
import { dateLabel, useContent } from "@/lib/ContentContext";
import NotFound from "./NotFound";

export default function Article() {
  const { slug } = useParams();
  const { content } = useContent();
  const article = content.articles.find(a => a.slug === slug);
  const category = content.categories.find(c => c.id === article?.categoryId);
  const author = content.authors.find(a => a.id === article?.authorId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = article ? `${article.title} — MotorHearts` : "Story not found — MotorHearts";
    if (!article) return;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = meta?.content;
    if (meta) meta.content = article.dek;
    const structuredData = document.createElement("script");
    structuredData.type = "application/ld+json";
    structuredData.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.dek,
      image: new URL(article.image, window.location.origin).href,
      datePublished: article.date,
      author: { "@type": "Person", name: author?.name, url: `${window.location.origin}/author/${author?.slug}` },
      publisher: { "@type": "Organization", name: "MotorHearts" },
      mainEntityOfPage: window.location.href,
    });
    document.head.appendChild(structuredData);
    return () => {
      structuredData.remove();
      if (meta && previousDescription !== undefined) meta.content = previousDescription;
    };
  }, [article, author?.name, author?.slug]);

  if (!article) return <NotFound />;
  const related = content.articles.filter(a => a.slug !== article.slug && a.categoryId === article.categoryId)
    .concat(content.articles.filter(a => a.slug !== article.slug && a.categoryId !== article.categoryId)).slice(0, 3);

  return <>
    <SiteHeader />
    <main className="pt-[68px] sm:pt-20">
      <article>
        <header className="mx-auto max-w-5xl px-5 pb-10 pt-10 sm:px-8 sm:pb-14 sm:pt-16">
          <Link to={`/category/${category?.slug}`} className="mb-9 inline-flex items-center gap-3 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to {category?.name}</Link>
          <div className="mb-5 flex flex-wrap items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.22em]">
            <Link to={`/category/${category?.slug}`} className="text-primary">{category?.name}</Link>
            <span className="h-px w-7 bg-border" aria-hidden="true" />
            <span className="text-muted-foreground">{article.readTime} min read</span>
          </div>
          <h1 className="max-w-4xl break-words font-display text-4xl font-extrabold leading-[1.08] tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl">{article.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">{article.dek}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-border pt-6">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-card font-display text-xs font-bold" aria-hidden="true">
              {author?.image ? <EditorialImage src={author.image} alt="" sizes="40px" width={40} height={40} className="h-full w-full object-cover" /> : author?.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <Link to={`/author/${author?.slug}`} rel="author" className="text-xs font-semibold hover:text-primary">{author?.name}</Link>
              <p className="mt-1 text-[11px] text-muted-foreground">{author?.role}</p>
            </div>
            <time dateTime={article.date} className="ml-auto text-xs text-muted-foreground">{dateLabel(article.date)}</time>
          </div>
        </header>
        <figure className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <EditorialImage src={article.image} alt={article.title} priority sizes="(min-width: 1440px) 1376px, 100vw" width={1440} height={810} className="aspect-[4/3] w-full rounded-2xl object-cover sm:aspect-[21/10]" />
        </figure>
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
          {article.specs.length > 0 && <Reveal className="mb-12">
            <aside className="grid grid-cols-2 gap-6 rounded-2xl border border-border bg-card p-7 sm:grid-cols-4">
              <h2 className="sr-only">At a glance</h2>
              {article.specs.map((spec, index) => <div key={`${spec.label}-${index}`}><p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">{spec.label}</p><p className="font-display text-lg font-semibold">{spec.value}</p></div>)}
              <p className="col-span-2 text-[10px] text-muted-foreground sm:col-span-4">Illustrative specifications for this sample editorial feature.</p>
            </aside>
          </Reveal>}
          <div className="space-y-7 font-serif text-lg leading-[1.85] text-foreground/85 sm:text-xl">
            {article.body.map((paragraph, index) => <div key={index}>
              <p>{paragraph}</p>
              {index === 1 && <Reveal><blockquote className="my-12 border-l-2 border-primary py-2 pl-7 font-display text-2xl font-semibold leading-snug text-foreground sm:text-3xl">“{article.pullQuote}”</blockquote></Reveal>}
            </div>)}
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-y border-border py-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">An independent perspective</p>
            <Link to={`/category/${category?.slug}`} className="inline-flex items-center gap-2 text-xs hover:text-primary">More {category?.name} <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">This is a curated sample story for the MotorHearts editorial showcase. Names, experiences and specifications are illustrative.</p>
        </div>
      </article>
      {related.length > 0 && <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <Reveal><h2 className="mb-8 font-display text-3xl font-bold">The journey continues.</h2></Reveal>
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-3">{related.map((story, index) => <ArticleCard key={story.slug} article={story} index={index} />)}</div>
      </section>}
    </main>
    <SiteFooter />
  </>;
}
