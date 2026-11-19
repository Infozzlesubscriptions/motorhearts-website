import { z } from "zod";
import type { Author, Category, SiteContent, Story } from "./ContentContext";
import { categories as defaults, articles as samples } from "@/data/articles";

export const WORDPRESS_URL = (import.meta.env.VITE_WORDPRESS_URL?.trim() || "https://motorhearts.testingweblink.com").replace(/\/+$/, "");
export const WORDPRESS_ADMIN = `${WORDPRESS_URL}/wp-admin/`;
export const WORDPRESS_REST_URL = `${WORDPRESS_URL}/wp-json/wp/v2`;
export const FALLBACK_IMAGE = samples[0].image;
export function imageUrl(value: unknown, fallback = FALLBACK_IMAGE): string {
  if (typeof value !== "string" || !value.trim()) return fallback;
  try { const url = new URL(value, `${WORDPRESS_URL}/`); return url.protocol === "https:" ? url.href : fallback; } catch { return fallback; }
}
export function plainText(html: string): string {
  const document = new DOMParser().parseFromString(html, "text/html");
  document.querySelectorAll("script,style,iframe,object").forEach(node => node.remove());
  return (document.body.textContent ?? "").replace(/\s+/g, " ").trim();
}
const rendered = z.object({ rendered: z.string() });
const extra = z.record(z.unknown()).optional();
const categorySchema = z.object({ id: z.number(), slug: z.string(), name: z.string(), description: z.string().default(""), motorhearts: extra });
const authorSchema = z.object({ id: z.number(), slug: z.string(), name: z.string(), description: z.string().default(""), avatar_urls: z.record(z.string()).optional(), motorhearts: extra });
const postSchema = z.object({
  id: z.number(), slug: z.string(), date: z.string(), title: rendered, excerpt: rendered, content: rendered.extend({ protected: z.boolean().optional() }),
  author: z.number(), categories: z.array(z.number()).default([]), sticky: z.boolean().default(false), motorhearts: extra,
  _embedded: z.object({ author: z.array(z.unknown()).optional(), "wp:featuredmedia": z.array(z.object({ source_url: z.string().optional() }).passthrough()).optional() }).passthrough().optional(),
});

async function collection<S extends z.ZodTypeAny>(resource: string, schema: S, signal: AbortSignal): Promise<z.output<S>[]> {
  const result: z.output<S>[] = [];
  for (let page = 1; ; page++) {
    const url = new URL(`${WORDPRESS_REST_URL}/${resource}`);
    if (url.protocol !== "https:" || url.username || url.password || url.hash) throw new Error("Set VITE_WORDPRESS_URL to the HTTPS WordPress installation URL without credentials or a fragment.");
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", String(page));
    url.searchParams.set("context", "view");
    if (resource === "posts") { url.searchParams.set("_embed", "1"); url.searchParams.set("status", "publish"); }
    else url.searchParams.set("hide_empty", "false");
    const response = await fetch(url, { signal, credentials: "omit", headers: { Accept: "application/json" } });
    if (!response.ok) {
      if (page > 1 && response.status === 400) {
        const error = await response.json().catch(() => null);
        if (error?.code === "rest_post_invalid_page_number" || error?.code === "rest_invalid_page_number") break;
      }
      throw new Error(`WordPress returned HTTP ${response.status}.`);
    }
    const records = z.array(schema).parse(await response.json());
    result.push(...records);
    const pages = Number(response.headers.get("X-WP-TotalPages"));
    if (records.length < 100 || (pages > 0 && page >= pages)) break;
  }
  return result;
}

export async function loadWordPress(signal: AbortSignal): Promise<SiteContent> {
  const timeout = new AbortController();
  const abort = () => timeout.abort();
  signal.addEventListener("abort", abort, { once: true });
  if (signal.aborted) timeout.abort();
  const timer = window.setTimeout(abort, 25000);
  try {
    const [posts, terms] = await Promise.all([collection("posts", postSchema, timeout.signal), collection("categories", categorySchema, timeout.signal)]);
    const categories: Category[] = terms.map(term => {
      const defaultCategory = defaults.find(category => category.slug === term.slug);
      const sample = samples.find(story => story.category === term.slug);
      return { id: String(term.id), slug: term.slug, name: plainText(term.name), blurb: plainText(term.description) || defaultCategory?.blurb || `Stories from the ${plainText(term.name)} journal.`, image: imageUrl(term.motorhearts?.image, sample?.image ?? FALLBACK_IMAGE) };
    });
    const categoryOrder = (slug: string) => { const index = defaults.findIndex(category => category.slug === slug); return index === -1 ? defaults.length : index; };
    categories.sort((first, second) => categoryOrder(first.slug) - categoryOrder(second.slug));
    if (!categories.length && posts.length) categories.push({ id: "uncategorized", slug: "uncategorized", name: "Journal", blurb: "Stories from MotorHearts.", image: FALLBACK_IMAGE });
    const authors = new Map<string, Author>();
    const stories: Story[] = posts.filter(post => !post.content.protected).map(post => {
      const id = String(post.author);
      const embedded = post._embedded?.author?.map(value => authorSchema.safeParse(value)).find(value => value.success);
      const author = embedded?.success ? embedded.data : undefined;
      authors.set(id, { id, slug: author?.slug || `contributor-${id}`, name: author ? plainText(author.name) : "MotorHearts Editorial", role: (typeof author?.motorhearts?.role === "string" ? plainText(author.motorhearts.role) : "") || "Contributor", bio: (author ? plainText(author.description) : "") || "An independent voice from MotorHearts.", image: imageUrl(author?.motorhearts?.image || author?.avatar_urls?.[96], "") });
      const meta = post.motorhearts ?? {};
      const primary = Number(meta.primary_category);
      const categoryId = String(post.categories.includes(primary) ? primary : post.categories[0]);
      const text = plainText(post.content.rendered);
      const specs = z.array(z.object({ label: z.string(), value: z.string() })).safeParse(meta.specs);
      return {
        wordpressId: post.id, pluginFields: post.motorhearts !== undefined, slug: post.slug, title: plainText(post.title.rendered) || "Untitled story", dek: typeof meta.dek === "string" && meta.dek.trim() ? plainText(meta.dek) : plainText(post.excerpt.rendered) || text.slice(0, 220),
        categoryIds: post.categories.map(String), categoryId: categories.some(category => category.id === categoryId) ? categoryId : categories[0]?.id ?? "uncategorized",
        image: imageUrl(post._embedded?.["wp:featuredmedia"]?.[0]?.source_url, categories.find(category => category.id === categoryId)?.image ?? FALLBACK_IMAGE),
        authorId: id, date: post.date.slice(0, 10), readTime: Number(meta.read_time) > 0 ? Math.ceil(Number(meta.read_time)) : Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 220)),
        pullQuote: typeof meta.pull_quote === "string" ? plainText(meta.pull_quote) : "", body: [], bodyHtml: post.content.rendered,
        specs: specs.success ? specs.data.filter(spec => spec.label && spec.value) : [], guide: meta.guide === true, featured: meta.featured === true || post.sticky,
        hero: meta.hero === true, spotlight: meta.spotlight === true, featuredOrder: Number(meta.featured_order) || 0,
      };
    });
    return { categories, authors: [...authors.values()], articles: stories, signups: [] };
  } finally { window.clearTimeout(timer); signal.removeEventListener("abort", abort); }
}
