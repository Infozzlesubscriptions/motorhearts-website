import { Link } from "react-router-dom";
import { dateLabel, type Story, useContent } from "@/lib/ContentContext";

type Props = { article: Story; size?: "default" | "large" | "compact" };
export default function ArticleCard({ article, size = "default" }: Props) {
  const { content } = useContent();
  const category = content.categories.find(c => c.id === article.categoryId);
  const author = content.authors.find(a => a.id === article.authorId);
  if (size === "compact") return <Link to={`/article/${article.slug}`} className="group flex gap-5"><div className="aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-xl bg-card sm:w-40"><img src={article.image} alt={article.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /></div><div className="flex flex-col justify-center"><span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">{category?.name}</span><h3 className="mt-2 font-display text-lg font-bold leading-snug group-hover:text-foreground/80">{article.title}</h3><span className="mt-2 text-xs text-muted-foreground">{dateLabel(article.date)}</span></div></Link>;
  const large = size === "large";
  return <article><Link to={`/article/${article.slug}`} className="group block"><div className={`overflow-hidden rounded-2xl bg-card ${large ? "aspect-[4/3] sm:aspect-[16/10]" : "aspect-[4/3]"}`}><img src={article.image} alt={article.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" /></div><div className="mt-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em]"><span className="text-primary">{category?.name}</span><span className="h-px w-6 bg-border" /><span className="text-muted-foreground">{dateLabel(article.date)}</span></div><h3 className={`mt-3 font-display font-bold leading-tight text-balance transition-colors group-hover:text-foreground/80 ${large ? "text-2xl sm:text-4xl" : "text-xl sm:text-2xl"}`}>{article.title}</h3><p className={`mt-3 leading-relaxed text-muted-foreground ${large ? "max-w-2xl sm:text-lg" : "line-clamp-2"}`}>{article.dek}</p></Link><p className="mt-4 text-xs text-muted-foreground">By <Link to={author ? `/author/${author.slug}` : "/authors"} className="text-foreground/90 hover:text-primary">{author?.name}</Link></p></article>;
}
