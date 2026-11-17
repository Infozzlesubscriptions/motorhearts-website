import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ArticleCard from "@/components/ArticleCard";
import { useContent } from "@/lib/ContentContext";
import NotFound from "./NotFound";

function ArchiveFrame({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  useEffect(() => {
    document.title = `${title} — MotorHearts`;
    window.scrollTo(0, 0);
  }, [title]);
  return <>
    <SiteHeader />
    <main className="mx-auto min-h-[70vh] max-w-7xl px-5 pb-20 pt-32 sm:px-8 sm:pt-40">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">The journal</p>
      <h1 className="font-display text-4xl font-bold sm:text-6xl">{title}</h1>
      <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">{intro}</p>
      <div className="mt-12">{children}</div>
    </main>
    <SiteFooter />
  </>;
}

export function CategoryArchive() {
  const { slug } = useParams();
  const { content } = useContent();
  const category = content.categories.find(item => item.slug === slug);
  if (!category) return <NotFound />;
  const stories = [...content.articles].filter(story => story.categoryId === category.id).sort((first, second) => second.date.localeCompare(first.date));
  return <ArchiveFrame title={category.name} intro={category.blurb}>{stories.length ? <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{stories.map(article => <ArticleCard key={article.slug} article={article} />)}</div> : <p className="rounded-xl border border-border bg-card p-7 text-muted-foreground">No stories in this category yet.</p>}</ArchiveFrame>;
}

export function GuidesArchive() {
  const { content } = useContent();
  const stories = content.articles.filter(article => article.guide).sort((first, second) => second.date.localeCompare(first.date));
  return <ArchiveFrame title="Popular Guides" intro="Practical knowledge and considered advice for better days on the road.">{stories.length ? <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{stories.map(article => <ArticleCard key={article.slug} article={article} />)}</div> : <p className="text-muted-foreground">No guides are available yet.</p>}</ArchiveFrame>;
}

export function ArticlesArchive() {
  const { content } = useContent();
  const stories = [...content.articles].sort((first, second) => second.date.localeCompare(first.date));
  return <ArchiveFrame title="All articles" intro="Every story from the MotorHearts journal, in one place."><div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{stories.map(article => <ArticleCard key={article.slug} article={article} />)}</div></ArchiveFrame>;
}

export function AuthorsIndex() {
  const { content } = useContent();
  return <ArchiveFrame title="Our authors" intro="Meet the editors and contributors behind our stories."><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{content.authors.map(author => <Link key={author.id} to={`/author/${author.slug}`} className="rounded-2xl border border-border bg-card p-6 hover:border-foreground/40"><div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-background font-display font-bold">{author.image ? <img src={author.image} alt="" className="h-full w-full object-cover" /> : author.name.split(" ").map(part => part[0]).join("")}</div><div><h2 className="font-display text-xl font-bold">{author.name}</h2><p className="mt-1 text-xs text-muted-foreground">{author.role}</p></div></div><p className="mt-5 text-sm leading-6 text-muted-foreground">{author.bio}</p></Link>)}</div></ArchiveFrame>;
}

export function AuthorArchive() {
  const { slug } = useParams();
  const { content } = useContent();
  const author = content.authors.find(item => item.slug === slug);
  if (!author) return <NotFound />;
  const stories = content.articles.filter(article => article.authorId === author.id).sort((first, second) => second.date.localeCompare(first.date));
  return <ArchiveFrame title={author.name} intro={`${author.role} · ${author.bio}`}><div className="mb-8 text-xs text-muted-foreground">Contributor archive · {stories.length} {stories.length === 1 ? "story" : "stories"}</div>{stories.length ? <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{stories.map(article => <ArticleCard key={article.slug} article={article} />)}</div> : <p className="text-muted-foreground">No stories by this author yet.</p>}</ArchiveFrame>;
}
