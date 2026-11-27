import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, Gauge, ShieldCheck, Wrench } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import { ContentLoadingPage, ContentStatus } from "@/components/ContentStatus";
import EditorialImage from "@/components/EditorialImage";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useContent } from "@/lib/ContentContext";

const guidePrinciples = [
  { icon: Compass, title: "Plan with confidence", copy: "Straightforward advice for routes, touring and everyday journeys." },
  { icon: Wrench, title: "Understand your machine", copy: "Practical maintenance and setup knowledge without the jargon." },
  { icon: ShieldCheck, title: "Drive prepared", copy: "Considered guidance that puts safety and good decisions first." },
];

export default function PopularGuides() {
  const { content, loading } = useContent();
  const guides = content.articles
    .filter(article => article.guide)
    .sort((first, second) => second.date.localeCompare(first.date));
  const leadGuide = guides[0];
  const remainingGuides = guides.slice(1);

  useEffect(() => {
    document.title = "Popular Guides — MotorHearts";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  if (loading) return <ContentLoadingPage />;

  return <>
    <SiteHeader />
    <main className="min-h-[70vh] pt-[68px] sm:pt-20">
      <section className="relative isolate overflow-hidden border-b border-border">
        {leadGuide && <EditorialImage
          src={leadGuide.image}
          alt=""
          priority
          width={1920}
          height={900}
          sizes="100vw"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45"
        />}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,hsl(var(--background))_10%,hsl(var(--background)/.9)_48%,hsl(var(--background)/.4)_100%)]" />
        <div className="mx-auto flex min-h-[520px] max-w-7xl items-end px-5 py-16 sm:min-h-[600px] sm:px-8 sm:py-24">
          <Reveal className="max-w-3xl">
            <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-background/40 backdrop-blur-sm">
              <Gauge className="h-5 w-5 text-primary" />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">The MotorHearts handbook</p>
            <h1 className="mt-4 font-display text-5xl font-bold leading-[0.98] tracking-[-0.04em] text-white sm:text-7xl">Popular guides.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">Practical knowledge, thoughtful advice and useful answers for better days on the road.</p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        <ContentStatus />
        {leadGuide ? <>
          <section aria-labelledby="guide-start-here">
            <Reveal className="mb-8 flex items-end justify-between gap-5 border-b border-border pb-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">Editor&apos;s pick</p>
                <h2 id="guide-start-here" className="mt-2 font-display text-3xl font-bold sm:text-4xl">Start here.</h2>
              </div>
              <span className="hidden text-xs text-muted-foreground sm:block">{guides.length} {guides.length === 1 ? "guide" : "guides"}</span>
            </Reveal>
            <Reveal className="grid overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-[1.15fr_.85fr]">
              <Link to={`/article/${leadGuide.slug}`} className="group block min-h-[320px] overflow-hidden lg:min-h-[470px]">
                <EditorialImage src={leadGuide.image} alt={leadGuide.title} width={1200} height={900} sizes="(min-width: 1024px) 60vw, 100vw" className="h-full w-full object-cover" />
              </Link>
              <div className="flex flex-col justify-center p-8 sm:p-12">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Most useful right now</p>
                <h3 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">{leadGuide.title}</h3>
                <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">{leadGuide.dek}</p>
                <Link to={`/article/${leadGuide.slug}`} className="mt-7 inline-flex w-fit items-center gap-3 border-b border-foreground/30 pb-2 text-sm font-semibold hover:border-primary hover:text-primary">
                  Read the guide <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </section>

          {remainingGuides.length > 0 && <section className="py-16 sm:py-24" aria-labelledby="all-guides">
            <Reveal className="mb-9">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">Built for the road</p>
              <h2 id="all-guides" className="mt-3 font-display text-3xl font-bold sm:text-4xl">Explore all guides.</h2>
            </Reveal>
            <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {remainingGuides.map((article, index) => <ArticleCard key={article.slug} article={article} index={index} headingLevel={2} />)}
            </div>
          </section>}
        </> : <p className="rounded-xl border border-border bg-card p-7 text-muted-foreground">New guides are on the way.</p>}
      </div>

      <section className="editorial-light border-y border-border">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <Reveal>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">Our approach</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-tight sm:text-5xl">Useful advice, made to go further.</h2>
          </Reveal>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
            {guidePrinciples.map(({ icon: Icon, title, copy }, index) => <Reveal key={title} delay={index * 70} className="bg-background p-7 sm:p-9">
              <Icon className="h-5 w-5 text-primary" />
              <h3 className="mt-7 font-display text-xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{copy}</p>
            </Reveal>)}
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </>;
}
