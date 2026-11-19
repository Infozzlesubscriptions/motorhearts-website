import { useEffect, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ArticleCard from "@/components/ArticleCard";
import EditorialImage from "@/components/EditorialImage";
import Reveal from "@/components/Reveal";
import { useContent, type Story } from "@/lib/ContentContext";
import { ContentLoadingPage, ContentStatus } from "@/components/ContentStatus";
import NotFound from "./NotFound";

function ArchiveFrame({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  const { loading } = useContent();
  useEffect(() => {
    document.title = `${title} — MotorHearts`;
    window.scrollTo({ top: 0, behavior: "instant" });
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previous = meta?.content;
    if (meta) meta.content = intro;
    return () => { if (meta && previous !== undefined) meta.content = previous; };
  }, [title, intro]);
  return <>
    <SiteHeader />
    <main className="mx-auto min-h-[70vh] max-w-7xl px-5 pb-20 pt-32 sm:px-8 sm:pt-40">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">The journal</p>
      <h1 className="break-words font-display text-4xl font-bold tracking-tight sm:text-6xl">{title}</h1>
      <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">{intro}</p>
      <div className="mt-12"><ContentStatus />{!loading && children}</div>
    </main>
    <SiteFooter />
  </>;
}

function StoriesGrid({ stories, emptyMessage }: { stories: Story[]; emptyMessage: string }) {
  return stories.length ? (
    <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {stories.map((article, index) => <ArticleCard key={article.slug} article={article} index={index} headingLevel={2} />)}
    </div>
  ) : <p className="rounded-xl border border-border bg-card p-7 text-muted-foreground">{emptyMessage}</p>;
}

export function CategoryArchive() {
  const { slug } = useParams();
  const { content, loading, error } = useContent();
  const category = content.categories.find(item => item.slug === slug);
  if (loading) return <ContentLoadingPage />;
  if (!category && error) return <ArchiveFrame title="Category unavailable" intro="Please retry the WordPress connection.">{null}</ArchiveFrame>;
  if (!category) return <NotFound />;
  const stories = content.articles.filter(story => story.categoryIds ? story.categoryIds.includes(category.id) : story.categoryId === category.id).sort((first, second) => second.date.localeCompare(first.date));
  return <ArchiveFrame title={category.name} intro={category.blurb}>
    <StoriesGrid stories={stories} emptyMessage="No stories in this category yet." />
  </ArchiveFrame>;
}

export function GuidesArchive() {
  const { content } = useContent();
  const stories = content.articles.filter(article => article.guide).sort((first, second) => second.date.localeCompare(first.date));
  return <ArchiveFrame title="Popular Guides" intro="Practical knowledge and considered advice for better days on the road.">
    <StoriesGrid stories={stories} emptyMessage="No guides are available yet." />
  </ArchiveFrame>;
}

export function ArticlesArchive() {
  const { content } = useContent();
  const stories = [...content.articles].sort((first, second) => second.date.localeCompare(first.date));
  return <ArchiveFrame title="All articles" intro="Every story from the MotorHearts journal, in one place.">
    <StoriesGrid stories={stories} emptyMessage="No stories are available yet." />
  </ArchiveFrame>;
}

export function AuthorsIndex() {
  const { content } = useContent();
  return <ArchiveFrame title="Our authors" intro="Meet the editors and contributors behind our stories.">
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {content.authors.map((author, index) => <Reveal key={author.id} delay={(index % 3) * 70}>
        <Link to={`/author/${author.slug}`} className="block h-full rounded-2xl border border-border bg-card p-6 hover:border-foreground/40">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-background font-display font-bold" aria-hidden="true">
              {author.image ? <EditorialImage src={author.image} alt="" width={56} height={56} sizes="56px" className="h-full w-full object-cover" /> : author.name.split(" ").map(part => part[0]).join("")}
            </div>
            <div className="min-w-0"><h2 className="font-display text-xl font-bold">{author.name}</h2><p className="mt-1 text-xs text-muted-foreground">{author.role}</p></div>
          </div>
          <p className="mt-5 text-sm leading-6 text-muted-foreground">{author.bio}</p>
        </Link>
      </Reveal>)}
    </div>
  </ArchiveFrame>;
}

export function AuthorArchive() {
  const { slug } = useParams();
  const { content, loading, error } = useContent();
  const author = content.authors.find(item => item.slug === slug);
  if (loading) return <ContentLoadingPage />;
  if (!author && error) return <ArchiveFrame title="Author unavailable" intro="Please retry the WordPress connection.">{null}</ArchiveFrame>;
  if (!author) return <NotFound />;
  const stories = content.articles.filter(article => article.authorId === author.id).sort((first, second) => second.date.localeCompare(first.date));
  return <ArchiveFrame title={author.name} intro={`${author.role} · ${author.bio}`}>
    <div className="mb-8 text-xs text-muted-foreground">Contributor archive · {stories.length} {stories.length === 1 ? "story" : "stories"}</div>
    <StoriesGrid stories={stories} emptyMessage="No stories by this author yet." />
  </ArchiveFrame>;
}
