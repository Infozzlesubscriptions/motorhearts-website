import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ArticleCard from "@/components/ArticleCard";
import Newsletter from "@/components/Newsletter";
import Reveal from "@/components/Reveal";
import EditorialImage from "@/components/EditorialImage";
import { dateLabel, useContent } from "@/lib/ContentContext";
import { ContentLoadingPage, ContentStatus } from "@/components/ContentStatus";

function SectionHeading(
    {
        eyebrow,
        title,
        link,
        linkLabel
    }: {
        eyebrow: string;
        title: string;
        link?: string;
        linkLabel?: string;
    }
) {
    return (
        <Reveal className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <div>
                <p
                    className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
                <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
            </div>
            {link && <Link
                to={link}
                className="inline-flex items-center gap-3 text-xs text-muted-foreground hover:text-primary">{linkLabel}<ArrowRight className="h-3.5 w-3.5" /></Link>}
        </Reveal>
    );
}

export default function Index() {
    const {
        content, loading, isFallback
    } = useContent();

    useEffect(() => {
        document.title = "MotorHearts — For the love of the drive";

        window.scrollTo({
            top: 0,
            behavior: "instant"
        });
    }, []);

    const byDate = [...content.articles].sort((first, second) => second.date.localeCompare(first.date));
    const hero = content.articles.find(article => article.hero) ?? byDate[0];
    const selected = byDate.filter(article => article.featured).sort((first, second) => (first.featuredOrder ?? 0) - (second.featuredOrder ?? 0));
    const featured = [...selected, ...byDate.filter(article => !article.featured)].slice(0, 3);
    const latest = byDate.slice(0, 4);
    const spotlight = content.articles.find(article => article.spotlight) ?? byDate[0];
    const guides = content.articles.filter(article => article.guide).slice(0, 3);

    if (loading) return <ContentLoadingPage />;

    return (
        <>
            <SiteHeader />
            <main className="pt-[68px] sm:pt-20">
                <section
                    className="mx-auto max-w-[1600px] px-5 pb-12 pt-7 sm:px-8 sm:pb-16 sm:pt-9 lg:px-12"
                    aria-label="Cover story">
                    <div
                        className="mb-6 flex justify-end border-b border-border pb-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:hidden">
                        <span className="shrink-0">Vol. 01</span>
                    </div>
                    <ContentStatus />
                    {hero ? <div
                        className="grid overflow-hidden rounded-2xl border border-border bg-card lg:min-h-[590px] lg:grid-cols-[0.78fr_1.22fr]">
                        <div
                            className="flex min-w-0 flex-col justify-center px-7 py-12 sm:px-12 lg:px-14 xl:px-16">
                            <p
                                className="mb-6 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">MotorHearts journal · {content.categories.find(category => category.id === hero.categoryId)?.name}</p>
                            <h1
                                className="break-words font-display text-[clamp(2.25rem,3.5vw,4.5rem)] font-extrabold leading-[1.06] tracking-[-0.045em]">{hero.title}</h1>
                            <p
                                className="mt-7 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">{hero.dek}</p>
                            <a
                                href="#latest"
                                className="mt-8 inline-flex w-fit items-center gap-6 rounded-full bg-foreground px-6 py-3.5 text-xs font-semibold text-background hover:bg-primary hover:text-white">Explore Articles <ArrowRight className="h-4 w-4" /></a>
                        </div>
                        <Link
                            to={`/article/${hero.slug}`}
                            className="group relative block min-h-[350px] overflow-hidden sm:min-h-[470px] lg:min-h-full"
                            aria-label={`Read ${hero.title}`}>
                            <EditorialImage
                                src={hero.image}
                                alt={hero.title}
                                priority
                                parallax
                                sizes="(min-width: 1024px) 60vw, 100vw"
                                width={1440}
                                height={1080}
                                className="absolute inset-0 h-full w-full object-cover" />
                            <div
                                className="absolute inset-x-5 bottom-5 rounded-xl border border-white/15 bg-background/90 p-5 backdrop-blur-sm sm:inset-x-7 sm:bottom-7 sm:p-7">
                                <p
                                    className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">The cover story</p>
                                <div className="mt-3 flex items-center justify-between gap-4">
                                    <p className="text-xs text-muted-foreground"><time dateTime={hero.date}>{dateLabel(hero.date)}</time>· {hero.readTime}min read</p>
                                    <span className="inline-flex items-center gap-2 text-xs font-medium">Read story <ArrowUpRight className="h-4 w-4" /></span>
                                </div>
                            </div>
                        </Link>
                    </div> : <div className="grid overflow-hidden rounded-2xl border border-border bg-card lg:min-h-[590px] lg:grid-cols-[0.78fr_1.22fr]"><div className="flex min-w-0 flex-col justify-center px-7 py-12 sm:px-12 lg:px-14 xl:px-16"><p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">MotorHearts journal</p><h1 className="font-display text-[clamp(2.25rem,3.5vw,4.5rem)] font-extrabold leading-[1.06] tracking-[-0.045em]">For the love of the drive.</h1><p className="mt-7 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">Our first stories are on the way. Explore the worlds of MotorHearts below.</p><a href="#latest" className="mt-8 inline-flex w-fit items-center gap-6 rounded-full bg-foreground px-6 py-3.5 text-xs font-semibold text-background hover:bg-primary hover:text-white">Explore Articles <ArrowRight className="h-4 w-4" /></a></div><div className="flex min-h-[350px] items-center justify-center bg-background p-10 sm:min-h-[470px]"><img src="/motorhearts-logo.png" alt="MotorHearts" className="max-h-[380px] w-full object-contain" /></div></div>}
                </section>
                <section
                    className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-16"
                    aria-label="Featured stories">
                    <SectionHeading
                        eyebrow="The edit"
                        title="Featured stories."
                        link="/articles"
                        linkLabel="All stories" />
                    {featured.length ? <div className="grid gap-9 lg:grid-cols-2">
                        <ArticleCard article={featured[0]} size="large" />
                        <div className="grid content-start gap-8 lg:pt-2">{featured.slice(1).map(
                                (article, index) => <ArticleCard key={article.slug} article={article} size="compact" index={index + 1} />
                            )}</div>
                    </div> : <p className="rounded-xl border border-border bg-card p-7 text-muted-foreground">Featured stories are on the way.</p>}
                </section>
                <section
                    className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-20"
                    aria-label="Explore categories">
                    <SectionHeading eyebrow="Six worlds, one passion" title="Explore categories." />
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {content.categories.map((category, index) => <Reveal key={category.id} delay={(index % 3) * 70}>
                            <Link
                                to={`/category/${category.slug}`}
                                className="group relative block aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-foreground/40">
                                <EditorialImage
                                    src={category.image}
                                    alt=""
                                    sizes="(min-width: 1024px) 400px, (min-width: 640px) 45vw, 100vw"
                                    width={800}
                                    height={500}
                                    className="absolute inset-0 h-full w-full object-cover" />
                                <div
                                    className="absolute inset-0 bg-background/45 transition-colors duration-500 group-hover:bg-background/30" />
                                <div className="absolute inset-x-5 bottom-5">
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/85">0{index + 1}</span>
                                    <h3 className="mt-1 font-display text-2xl font-bold">{category.name}</h3>
                                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/90">{category.blurb}</p>
                                </div>
                            </Link>
                        </Reveal>)}
                    </div>
                </section>
                <section
                    id="latest"
                    className="mx-auto max-w-7xl scroll-mt-24 px-5 py-12 sm:px-8 sm:py-20"
                    aria-label="Latest articles">
                    <SectionHeading
                        eyebrow="Fresh from the road"
                        title="Latest articles."
                        link="/articles"
                        linkLabel="View archive" />
                    {latest.length ? <div className="grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">{latest.map(
                            (article, index) => <ArticleCard key={article.slug} article={article} index={index} />
                        )}</div> : <p className="rounded-xl border border-border bg-card p-7 text-muted-foreground">No published stories yet. Check back soon.</p>}
                </section>
                <section
                    className="editorial-light mt-6 border-y border-border"
                    aria-label="Popular guides">
                    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
                        <SectionHeading
                            eyebrow="Practical knowledge"
                            title="Popular guides."
                            link="/guides"
                            linkLabel="All guides" />
                        {guides.length ? <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-3">{guides.map(
                                (article, index) => <ArticleCard key={article.slug} article={article} index={index} />
                            )}</div> : <p className="text-muted-foreground">New guides are on the way.</p>}
                    </div>
                </section>
                {spotlight && <Reveal
                    as="section"
                    className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:py-24">
                    <div>
                        <p
                            className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">Editorial spotlight</p>
                        <h2
                            className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl">{spotlight.title}</h2>
                        <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">{spotlight.dek}</p>
                        <Link
                            to={`/article/${spotlight.slug}`}
                            className="mt-7 inline-flex items-center gap-3 border-b border-foreground/30 pb-2 text-sm font-semibold hover:border-primary hover:text-primary">Discover the story <ArrowRight className="h-4 w-4" /></Link>
                    </div>
                    <Link
                        to={`/article/${spotlight.slug}`}
                        className="group relative block aspect-[16/10] overflow-hidden rounded-2xl"
                        aria-label={`Read ${spotlight.title}`}>
                        <EditorialImage
                            src={spotlight.image}
                            alt={spotlight.title}
                            sizes="(min-width: 1024px) 760px, 100vw"
                            width={1200}
                            height={750}
                            className="h-full w-full object-cover" />
                        <div
                            className="absolute inset-x-4 bottom-4 rounded-xl border border-white/15 bg-background/90 px-4 py-3 backdrop-blur-sm">
                            <p className="text-xs text-muted-foreground"><time dateTime={spotlight.date}>{dateLabel(spotlight.date)}</time>· {spotlight.readTime}min read</p>
                        </div>
                    </Link>
                </Reveal>}
                <Reveal as="section" className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 sm:pb-24">
                    <div className="rounded-2xl border border-border bg-card p-8 sm:p-12">
                        <p
                            className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">This is MotorHearts</p>
                        <h2 className="font-display text-3xl font-bold sm:text-4xl">Not just what you drive.<br /><span className="font-serif font-normal italic text-muted-foreground">Why you drive.</span></h2>
                        <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">MotorHearts is an independent editorial showcase exploring automotive culture across six worlds.{isFallback && " The sample features are illustrative."}</p>
                        <Link
                            to="/about"
                            className="mt-5 inline-flex items-center gap-2 text-sm hover:text-primary">About MotorHearts <ArrowUpRight className="h-4 w-4" /></Link>
                    </div>
                </Reveal>
                <Reveal><Newsletter /></Reveal>
            </main>
            <SiteFooter />
        </>
    );
}