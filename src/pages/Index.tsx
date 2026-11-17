import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowDown, ArrowUpRight, ArrowRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ArticleCard from "@/components/ArticleCard";
import { articles, categories, getCategory } from "@/data/articles";

const Index = () => {
  const [params, setParams] = useSearchParams();
  const topic = params.get("topic");
  const activeCategory = topic ? getCategory(topic) : undefined;
  const visibleArticles = activeCategory ? articles.filter(a => a.category === topic) : articles.slice(1, 7);
  const lead = articles[0];

  useEffect(() => {
    document.title = "MotorHearts — For the love of the drive";
    if (topic) {
      const timer = setTimeout(() => document.getElementById("journal")?.scrollIntoView({ behavior: "smooth" }), 100);
      return () => clearTimeout(timer);
    }
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [topic]);

  return (
    <>
      <SiteHeader />
      <main className="pt-16 sm:pt-20">
        <section className="mx-auto max-w-[1600px] px-5 pb-8 pt-8 sm:px-8 lg:px-12 lg:pb-12 lg:pt-10">
          <div className="mb-7 flex items-center justify-between border-b border-border pb-5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:text-[11px]">
            <p className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Independent automotive culture</p>
            <p className="hidden sm:block">The machines. The people. The passion.</p>
            <p className="sm:hidden">Vol. 01</p>
          </div>
          <div className="relative grid overflow-hidden rounded-2xl border border-border bg-card lg:min-h-[570px] lg:grid-cols-[0.85fr_1.15fr]">
            <div className="relative z-10 flex flex-col justify-center px-7 py-12 sm:px-12 sm:py-16 lg:px-12 xl:px-16">
              <p className="mb-7 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground"><span className="h-px w-8 bg-primary" /> For the love of the drive</p>
              <h1 className="font-display text-[clamp(2.7rem,6vw,6rem)] font-extrabold leading-[0.98] tracking-[-0.055em]">More than<br />machines.<br /><span className="text-primary">A feeling.</span></h1>
              <p className="mt-7 max-w-sm text-sm leading-7 text-muted-foreground sm:text-base">Stories for those who hear more than an engine. Who see more than a road. Who feel it in their chest.</p>
              <Link to={`/article/${lead.slug}`} className="mt-9 inline-flex w-fit items-center gap-7 rounded-full bg-foreground px-6 py-3.5 text-xs font-semibold text-background transition-colors hover:bg-primary hover:text-primary-foreground">Read the cover story <ArrowUpRight className="h-4 w-4" /></Link>
            </div>
            <Link to={`/article/${lead.slug}`} className="group relative block min-h-[350px] overflow-hidden sm:min-h-[470px]" aria-label={lead.title}>
              <img src={lead.image} alt="Silver Porsche sports car on a forest-lined mountain road" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-center motion-safe:animate-hero-zoom" />
              <span className="absolute left-6 top-6 rounded-full bg-background/85 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] backdrop-blur-sm">The cover story · 01</span>
              <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/15 bg-background/85 p-5 backdrop-blur-lg sm:bottom-7 sm:left-7 sm:right-7 sm:p-7">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Cars · 12 min read</p>
                <div className="flex items-center justify-between gap-5"><h2 className="max-w-sm font-display text-xl font-bold leading-tight sm:text-2xl">Above the Clouds:<br />Three Alpine Passes in the New GT Coupé</h2><ArrowUpRight className="h-6 w-6 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></div>
              </div>
            </Link>
          </div>
          <div className="mt-7 flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground"><p>Considered journalism. Uncompromising passion.</p><a href="#journal" className="flex items-center gap-3 transition-colors hover:text-foreground"><span className="hidden sm:inline">Explore the journal</span><ArrowDown className="h-4 w-4" /></a></div>
        </section>

        <section id="journal" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-12 sm:px-8 sm:py-16">
          <div className="flex items-end justify-between gap-5">
            <div><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">The Journal</p><h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{activeCategory ? activeCategory.name : "Fresh from the road."}</h2></div>
            <span className="hidden text-xs text-muted-foreground sm:block">Good stories. No shortcuts.</span>
          </div>
          <div className="no-scrollbar mb-9 mt-7 flex gap-2 overflow-x-auto border-b border-border pb-6">
            <button onClick={() => setParams({})} className={`shrink-0 rounded-full border px-5 py-2.5 text-xs font-medium transition-colors ${!activeCategory ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground"}`}>All stories</button>
            {categories.map(c => <button key={c.slug} onClick={() => setParams({ topic: c.slug })} className={`shrink-0 rounded-full border px-5 py-2.5 text-xs font-medium transition-colors ${topic === c.slug ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground"}`}>{c.name}</button>)}
          </div>
          {activeCategory && <p className="mb-8 text-muted-foreground">{activeCategory.blurb}</p>}
          <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {visibleArticles.map(a => <ArticleCard key={a.slug} article={a} />)}
          </div>
        </section>

        <section className="mt-8 border-y border-border bg-card/40">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.55fr_1fr] lg:gap-20 lg:py-20">
            <div className="flex flex-col justify-between"><div><p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">The long read</p><h2 className="font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">Some things<br />only get better<br /><span className="font-serif font-normal italic text-muted-foreground">with time.</span></h2><p className="mt-6 max-w-sm text-sm leading-7 text-muted-foreground">Beyond the polished chrome, every classic holds a story. We go looking for the ones worth telling.</p></div><Link to={`/article/${articles[3].slug}`} className="mt-8 flex w-fit items-center gap-6 border-b border-foreground/30 pb-2 text-xs font-semibold transition-colors hover:text-primary">Discover the story <ArrowRight className="h-4 w-4" /></Link></div>
            <Link to={`/article/${articles[3].slug}`} className="group relative block aspect-[16/10] overflow-hidden rounded-2xl"><img src={articles[3].image} alt="Vintage sports car with classic chrome detailing" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /><span className="absolute bottom-5 left-5 rounded-full bg-background/85 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] backdrop-blur-sm">Classic Cars · 14 min read</span></Link>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="mb-9 flex items-end justify-between"><div><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">Worth your time</p><h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">The editor's selection.</h2></div><span className="hidden text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">Handpicked, not algorithmic</span></div>
          <div className="grid gap-9 lg:grid-cols-3">{[articles[7], articles[4], articles[8]].map(a => <ArticleCard key={a.slug} article={a} />)}</div>
        </section>

        <section id="about" className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-20 sm:px-8 sm:pb-24">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 sm:p-14">
            <div className="absolute bottom-0 left-0 top-0 w-1 bg-primary" />
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.7fr]"><div><p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">This is MotorHearts</p><h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl">Not just what you drive.<br /><span className="font-serif font-normal italic text-muted-foreground">Why you drive.</span></h2></div><div className="space-y-4 text-sm leading-7 text-muted-foreground"><p>From the first twist of a throttle to the last mountain hairpin, we believe the best machines bring us closer to something human.</p><p>MotorHearts is an independent editorial showcase, exploring automotive culture through considered stories across six worlds. The articles in this first edition are illustrative sample features.</p><a href="#journal" className="inline-flex items-center gap-4 pt-2 text-xs font-semibold text-foreground transition-colors hover:text-primary">Find your next story <ArrowUpRight className="h-4 w-4" /></a></div></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
};

export default Index;
