import { useEffect } from "react";
import ArticleCard from "@/components/ArticleCard";
import { ContentLoadingPage, ContentStatus } from "@/components/ContentStatus";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useContent } from "@/lib/ContentContext";
import { isGuideStory } from "@/lib/guides";

export default function PopularGuides() {
  const { content, loading } = useContent();
  const guides = content.articles
    .filter(article => isGuideStory(article, content.categories))
    .sort((first, second) => second.date.localeCompare(first.date));

  useEffect(() => {
    document.title = "Guides — MotorHearts";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  if (loading) return <ContentLoadingPage />;

  return <>
    <SiteHeader />
    <main className="mx-auto min-h-[70vh] max-w-7xl px-5 pb-20 pt-32 sm:px-8 sm:pt-40">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">The journal</p>
      <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">Guides</h1>
      <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">Practical knowledge and considered advice for better days on the road.</p>
      <div className="mt-12">
        <ContentStatus />
        {guides.length ? <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((article, index) => <ArticleCard key={article.slug} article={article} index={index} headingLevel={2} />)}
        </div> : <p className="rounded-xl border border-border bg-card p-7 text-muted-foreground">No guides are available yet.</p>}
      </div>
    </main>
    <SiteFooter />
  </>;
}
