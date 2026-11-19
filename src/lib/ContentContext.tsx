import { createContext, useContext, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { articles as samples, categories as categoryDefaults } from "@/data/articles";
import { FALLBACK_IMAGE, loadWordPress } from "./wordpress";

export type Category = { id: string; slug: string; name: string; blurb: string; image: string };
export type Author = { id: string; slug: string; name: string; role: string; bio: string; image: string };
export type Story = { slug: string; title: string; dek: string; categoryId: string; categoryIds?: string[]; image: string; authorId: string; date: string; readTime: number; pullQuote: string; body: string[]; bodyHtml?: string; wordpressId?: number; pluginFields?: boolean; featuredOrder?: number; specs: { label: string; value: string }[]; guide: boolean; featured: boolean; hero: boolean; spotlight: boolean };
export type Signup = { email: string; consent: boolean; createdAt: string };
export type SiteContent = { categories: Category[]; authors: Author[]; articles: Story[]; signups: Signup[] };

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const fallback: SiteContent = {
  categories: categoryDefaults.map(category => ({ ...category, name: category.slug === "performance-tuning" ? "Performance & Tuning" : category.slug === "trailers" ? "Trailers & Transport" : category.name, id: category.slug, image: samples.find(story => story.category === category.slug)?.image ?? FALLBACK_IMAGE })),
  authors: Array.from(new Map(samples.map(story => [story.author, { id: slugify(story.author), slug: slugify(story.author), name: story.author, role: story.authorRole, bio: "A sample MotorHearts contributor.", image: "" }])).values()),
  articles: samples.map((story, index) => ({ ...story, categoryId: story.category, authorId: slugify(story.author), specs: story.specs ?? [], guide: [2, 4, 7].includes(index), featured: index < 3, hero: index === 0, spotlight: index === 3 })),
  signups: [],
};
const SIGNUPS_KEY = "motorhearts-local-signups-v1";
function loadSignups(): Signup[] {
  try {
    const entries: unknown = JSON.parse(localStorage.getItem(SIGNUPS_KEY) ?? localStorage.getItem("motorhearts-content-v1") ?? "[]");
    const values = Array.isArray(entries) ? entries : (entries as SiteContent)?.signups;
    return Array.isArray(values) ? values.filter((entry): entry is Signup => Boolean(entry && typeof entry.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry.email) && entry.consent === true && typeof entry.createdAt === "string" && Number.isFinite(Date.parse(entry.createdAt)))) : [];
  } catch { return []; }
}
type ContextValue = { content: SiteContent; save: (next: SiteContent) => void; loading: boolean; error: string; isFallback: boolean; refresh: () => void; refreshing: boolean; storageError: string };
const ContentContext = createContext<ContextValue | null>(null);
export function ContentProvider({ children }: { children: ReactNode }) {
  const [signups, setSignups] = useState(loadSignups);
  const [storageError, setStorageError] = useState("");
  const query = useQuery({ queryKey: ["motorhearts-wordpress"], queryFn: ({ signal }) => loadWordPress(signal), staleTime: 60000, refetchInterval: 300000, retry: 1, retryDelay: 1000 });
  const save = (next: SiteContent) => {
    // Editorial writes belong to WordPress. Only the existing local newsletter demo is stored here.
    if (!next.signups.every(entry => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry.email) && entry.consent === true && Number.isFinite(Date.parse(entry.createdAt)))) throw new Error("Invalid local newsletter entry.");
    try { localStorage.setItem(SIGNUPS_KEY, JSON.stringify(next.signups)); setSignups(next.signups); setStorageError(""); }
    catch { setStorageError("Browser storage is unavailable."); throw new Error("Browser storage save failed."); }
  };
  return <ContentContext.Provider value={{ content: { ...(query.data ?? fallback), signups }, save, loading: query.isPending, error: query.isError ? "WordPress is temporarily unavailable. Check that its REST API allows this website, then retry." : "", isFallback: !query.data && query.isError, refresh: () => { void query.refetch(); }, refreshing: query.isFetching, storageError }}>{children}</ContentContext.Provider>;
}
export function useContent() {
  const context = useContext(ContentContext);
  if (!context) throw new Error("useContent must be used inside ContentProvider");
  return context;
}
export const dateLabel = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
