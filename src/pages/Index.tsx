import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ArticleCard from "@/components/ArticleCard";
import Newsletter from "@/components/Newsletter";
import { dateLabel, useContent } from "@/lib/ContentContext";

export default function Index() {
  const { content } = useContent();
  useEffect(() => {
    document.title = "MotorHearts — For the love of the drive";
    window.scrollTo(0, 0);
  }, []);
  const byDate = [...content.articles].sort((first, second) => second.date.localeCompare(first.date));
  const hero = content.articles.find(article => article.hero) ?? byDate[0];
  const featured = content.articles.filter(article => article.featured).slice(0, 3);
  const latest = byDate.slice(0, 4);
  const spotlight = content.articles.find(article => article.spotlight) ?? byDate[0];
  const guides = content.articles.filter(article => article.guide).slice(0, 3);

  return <>
    <SiteHeader />
    <main className="pt-[68px] sm:pt-20">
      <section className="mx-auto max-w-[1600px] px-5 pb-12 pt-7 sm:px-8 sm:pb-16 sm:pt-9 lg:px-12">
        <div className="mb-6 flex justify-between border-b border-border pb-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground"><span>Independent automotive culture</span><span className="hidden sm:block">The machines. The people. The passion.</span><span className="sm:hidden">Vol. 01</span></div>
        <div className="grid overflow-hidden rounded-2xl border border-border bg-card lg:min-h-[590px] lg:grid-cols-[0.78fr_1.22fr]">
          <div className="flex flex-col justify-center px-7 py-12 sm:px-12 lg:px-14 xl:px-20">
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">MotorHearts journal · {content.categories.find(category => category.id === hero.categoryId)?.name}</p>
            <h1 className="font-display text-[clamp(2.25rem,3.5vw,4.5rem)] font-extrabold leading-[1.06] tracking-[-0.045em]">{hero.title}</h1>
            <p className="mt-7 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">{hero.dek}</p>
            <a href="#latest" className="mt-8 inline-flex w-fit items-center gap-6 rounded-full bg-foreground px-6 py-3.5 text-xs font-semibold text-background hover:bg-primary hover:text-white">Explore Articles <ArrowRight className="h-4 w-4" /></a>
          </div>
          <Link to={`/article/${hero.slug}`} className="group relative block min-h-[350px] overflow-hidden sm:min-h-[470px] lg:min-h-full">
            <img src={hero.image} alt={hero.title} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
            <div className="absolute inset-x-5 bottom-5 rounded-xl border border-white/15 bg-background/90 p-5 backdrop-blur-sm sm:inset-x-7 sm:bottom-7 sm:p-7">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Cover story · {content.categories.find(category => category.id === hero.categoryId)?.name}</p>
              <div className="flex items-end justify-between gap-4"><div className="min-w-0"><h2 className="break-words font-display text-xl font-bold leading-tight sm:text-3xl">{hero.title}</h2><p className="mt-2 break-words text-sm text-muted-foreground">{hero.dek}</p></div><ArrowUpRight className="h-5 w-5 shrink-0" /></div>
            </div>
          </Link>
        </div>
        <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Considered journalism. Uncompromising passion.</p>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-8 flex items-end justify-between"><div><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">The edit</p><h2 className="font-display text-3xl font-bold sm:text-4xl">Featured stories.</h2></div><Link to="/articles" className="text-xs text-muted-foreground hover:text-primary">All stories →</Link></div>
        {featured.length ? <div className="grid gap-9 lg:grid-cols-2"><ArticleCard article={featured[0]} size="large" /><div className="grid content-start gap-8">{featured.slice(1).map(article => <ArticleCard key={article.slug} article={article} size="compact" />)}</div></div> : <p className="text-muted-foreground">No featured stories selected yet.</p>}
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-8"><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">Six worlds, one passion</p><h2 className="font-display text-3xl font-bold sm:text-4xl">Explore categories.</h2></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{content.categories.map((category, index) => <Link key={category.id} to={`/category/${category.slug}`} className="group relative aspect-[16/10] overflow-hidden rounded-2xl bg-card"><img src={category.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-65 transition-transform duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-black/35" /><div className="absolute inset-x-5 bottom-5"><span className="text-[10px] uppercase tracking-[0.2em] text-white/75">0{index + 1}</span><h3 className="mt-1 font-display text-2xl font-bold">{category.name}</h3><p className="mt-1 line-clamp-2 text-sm text-white/75">{category.blurb}</p></div></Link>)}</div>
      </section>

      <section id="latest" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-8 flex items-end justify-between"><div><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">Fresh from the road</p><h2 className="font-display text-3xl font-bold sm:text-4xl">Latest articles.</h2></div><Link to="/articles" className="text-xs text-muted-foreground hover:text-primary">View archive →</Link></div>
        {latest.length ? <div className="grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">{latest.map(article => <ArticleCard key={article.slug} article={article} />)}</div> : <p className="text-muted-foreground">No stories are available yet.</p>}
      </section>

      <section className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16"><div className="mb-8 flex items-end justify-between"><div><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">Practical knowledge</p><h2 className="font-display text-3xl font-bold sm:text-4xl">Popular guides.</h2></div><Link to="/guides" className="text-xs text-muted-foreground hover:text-primary">All guides →</Link></div>
          {guides.length ? <div className="grid gap-8 lg:grid-cols-3">{guides.map(article => <ArticleCard key={article.slug} article={article} />)}</div> : <p className="text-muted-foreground">New guides are on the way.</p>}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:py-20">
        <div><p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">The long read</p><h2 className="font-display text-4xl font-bold leading-tight sm:text-5xl">{spotlight.title}</h2><p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">{spotlight.dek}</p><Link to={`/article/${spotlight.slug}`} className="mt-7 inline-flex items-center gap-3 border-b border-foreground/30 pb-2 text-sm font-semibold">Discover the story <ArrowRight className="h-4 w-4" /></Link></div>
        <Link to={`/article/${spotlight.slug}`} className="group relative aspect-[16/10] overflow-hidden rounded-2xl"><img src={spotlight.image} alt={spotlight.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /><div className="absolute inset-x-3 bottom-3 max-h-[calc(100%-1.5rem)] overflow-y-auto rounded-xl border border-white/15 bg-background/90 p-3 backdrop-blur-sm sm:inset-x-5 sm:bottom-5 sm:p-4"><p className="break-words text-sm font-semibold leading-5">{spotlight.title}</p><p className="mt-1 break-words text-xs text-muted-foreground">{dateLabel(spotlight.date)}</p></div></Link>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-12"><p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">This is MotorHearts</p><h2 className="font-display text-3xl font-bold sm:text-4xl">Not just what you drive.<br /><span className="font-serif font-normal italic text-muted-foreground">Why you drive.</span></h2><p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">MotorHearts is an independent editorial showcase exploring automotive culture across six worlds. The sample features are illustrative.</p><Link to="/about" className="mt-5 inline-flex items-center gap-2 text-sm hover:text-primary">About MotorHearts <ArrowUpRight className="h-4 w-4" /></Link></div>
      </section>
      <Newsletter />
    </main>
    <SiteFooter />
  </>;
}
