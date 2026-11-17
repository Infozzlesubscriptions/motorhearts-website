import { Link } from "react-router-dom";
import { dateLabel, type Story, useContent } from "@/lib/ContentContext";
import Reveal from "./Reveal";
import EditorialImage from "./EditorialImage";

type Props = {
  article: Story;
  size?: "default" | "large" | "compact";
  index?: number;
  headingLevel?: 2 | 3;
};

export default function ArticleCard({ article, size = "default", index = 0, headingLevel = 3 }: Props) {
  const { content } = useContent();
  const category = content.categories.find(c => c.id === article.categoryId);
  const author = content.authors.find(a => a.id === article.authorId);
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const date = <time dateTime={article.date}>{dateLabel(article.date)}</time>;

  if (size === "compact") return (
    <Reveal as="article" delay={(index % 3) * 70}>
      <Link to={`/article/${article.slug}`} className="group flex gap-5">
        <div className="aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-xl bg-card sm:w-40">
          <EditorialImage src={article.image} alt={article.title} width={400} height={300} sizes="160px" className="h-full w-full object-cover" />
        </div>
        <div className="flex min-w-0 flex-col justify-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.17em] text-primary">{category?.name}</span>
          <Heading className="mt-2 font-display text-base font-bold leading-snug transition-colors group-hover:text-foreground/80 sm:text-lg">{article.title}</Heading>
          <span className="mt-2 text-xs leading-relaxed text-muted-foreground">{date}</span>
        </div>
      </Link>
    </Reveal>
  );

  const large = size === "large";
  return (
    <Reveal as="article" delay={(index % 4) * 70}>
      <Link to={`/article/${article.slug}`} className="group block">
        <div className={`overflow-hidden rounded-2xl bg-card ${large ? "aspect-[4/3] sm:aspect-[16/10]" : "aspect-[4/3]"}`}>
          <EditorialImage
            src={article.image} alt={article.title} width={960} height={720}
            sizes={large ? "(min-width: 1024px) 600px, (min-width: 640px) 80vw, 100vw" : "(min-width: 1024px) 380px, (min-width: 640px) 45vw, 100vw"}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.17em]">
          <span className="text-primary">{category?.name}</span>
          <span className="h-px w-4 bg-border" aria-hidden="true" />
          <span className="text-muted-foreground">{date}</span>
        </div>
        <Heading className={`mt-3 font-display font-bold leading-tight text-balance transition-colors group-hover:text-foreground/80 ${large ? "text-2xl sm:text-4xl" : "text-xl sm:text-2xl"}`}>{article.title}</Heading>
        <p className={`mt-3 leading-relaxed text-muted-foreground ${large ? "max-w-2xl sm:text-lg" : "line-clamp-2 text-sm"}`}>{article.dek}</p>
      </Link>
      <p className="mt-4 text-xs text-muted-foreground">
        By <Link to={author ? `/author/${author.slug}` : "/authors"} className="text-foreground/90 hover:text-primary" rel="author">{author?.name}</Link>
      </p>
    </Reveal>
  );
}
