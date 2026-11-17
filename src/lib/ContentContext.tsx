import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { articles as seedArticles, categories as seedCategories } from "@/data/articles";

export type Category = { id: string; slug: string; name: string; blurb: string; image: string };
export type Author = { id: string; slug: string; name: string; role: string; bio: string; image: string };
export type Story = { slug: string; title: string; dek: string; categoryId: string; image: string; authorId: string; date: string; readTime: number; pullQuote: string; body: string[]; specs: { label: string; value: string }[]; guide: boolean; featured: boolean; hero: boolean; spotlight: boolean };
export type Signup = { email: string; consent: boolean; createdAt: string };
export type SiteContent = { categories: Category[]; authors: Author[]; articles: Story[]; signups: Signup[] };

const categoryImages = ["photo-1503376780353-7e6692767b70", "photo-1558981806-ec527fa84c39", "photo-1571068316344-75bc76f77890", "photo-1552519507-da3b142c6e3d", "photo-1486262715619-67b85e0b08d3", "photo-1523987355523-c7b5b0dd90a7"];
const imageUrl = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;
const roleBios: Record<string, string> = {
  Elena: "Road test editor, always looking for the long way around.",
  Tom: "Motorcycle editor with a soft spot for honest engineering.",
  Maya: "Writes about the changing shape of urban mobility.",
  James: "Classic car correspondent, drawn to the stories behind the metal.",
  Ravi: "Technical editor focused on the details that make a machine sing.",
  Sophie: "Travel and touring editor, happiest beyond the last turnoff.",
};
const seededCategories: Category[] = seedCategories.map((category, index) => ({
  id: category.slug,
  slug: category.slug,
  name: ["Cars", "Motorcycles", "Electric Bikes", "Classic Cars", "Performance & Tuning", "Trailers & Transport"][index],
  blurb: category.blurb,
  image: imageUrl(categoryImages[index]),
}));
const uniqueAuthors = Array.from(new Map(seedArticles.map(article => [article.author, article])).values());
const seededAuthors: Author[] = uniqueAuthors.map(article => ({
  id: article.author.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  slug: article.author.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name: article.author,
  role: article.authorRole,
  bio: roleBios[article.author.split(" ")[0]] ?? "An independent contributor to MotorHearts.",
  image: "",
}));
const seededStories: Story[] = seedArticles.map((article, index) => ({
  slug: article.slug,
  title: article.title,
  dek: article.dek,
  categoryId: article.category,
  image: article.image,
  authorId: article.author.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  date: article.date,
  readTime: article.readTime,
  pullQuote: article.pullQuote,
  body: [...article.body],
  specs: article.specs ? [...article.specs] : [],
  guide: ["first-big-ride-touring-on-two-wheels", "the-science-of-the-perfect-setup", "the-city-commuter-reinvented"].includes(article.slug),
  featured: index < 3,
  hero: index === 0,
  spotlight: index === 3,
}));
const seed: SiteContent = { categories: seededCategories, authors: seededAuthors, articles: seededStories, signups: [] };
const STORAGE_KEY = "motorhearts-content-v1";
const validText = (value: unknown) => typeof value === "string" && value.trim().length > 0;
const validSlug = (value: unknown) => typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

export function safeImage(value: unknown): value is string {
  if (typeof value !== "string" || !validText(value)) return false;
  try {
    const parsed = new URL(value, window.location.origin);
    return (parsed.protocol === "https:" && /^https:\/\//i.test(value)) ||
      (parsed.origin === window.location.origin && value.startsWith("/") && !value.startsWith("//"));
  } catch {
    return false;
  }
}

function validContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== "object") return false;
  const data = value as SiteContent;
  if (!Array.isArray(data.categories) || !Array.isArray(data.authors) || !Array.isArray(data.articles) || !Array.isArray(data.signups)) return false;
  const { categories, authors, articles } = data;
  if (!categories.every(category => category && validText(category.id) && validSlug(category.slug) && validText(category.name) && validText(category.blurb) && safeImage(category.image))) return false;
  if (!authors.every(author => author && validText(author.id) && validSlug(author.slug) && validText(author.name) && validText(author.role) && validText(author.bio) && (author.image === "" || safeImage(author.image)))) return false;
  if (!articles.every(story => story && validSlug(story.slug) && validText(story.title) && validText(story.dek) && validText(story.categoryId) && validText(story.authorId) && typeof story.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(story.date) && Number.isFinite(Date.parse(story.date)) && Number.isInteger(story.readTime) && story.readTime > 0 && validText(story.pullQuote) && Array.isArray(story.body) && story.body.length > 0 && story.body.every(validText) && Array.isArray(story.specs) && story.specs.every(spec => spec && validText(spec.label) && validText(spec.value)) && typeof story.guide === "boolean" && typeof story.featured === "boolean" && typeof story.hero === "boolean" && typeof story.spotlight === "boolean" && safeImage(story.image))) return false;
  if (!data.signups.every(signup => signup && typeof signup.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signup.email) && signup.consent === true && validText(signup.createdAt) && Number.isFinite(Date.parse(signup.createdAt)))) return false;
  const unique = (values: string[]) => new Set(values).size === values.length;
  return unique(categories.map(category => category.id)) && unique(categories.map(category => category.slug)) && unique(authors.map(author => author.id)) && unique(authors.map(author => author.slug)) && unique(articles.map(story => story.slug)) &&
    articles.length >= 4 && categories.length > 0 && authors.length > 0 && articles.every(story => categories.some(category => category.id === story.categoryId) && authors.some(author => author.id === story.authorId)) &&
    articles.filter(story => story.hero).length === 1 && articles.filter(story => story.spotlight).length === 1 && articles.filter(story => story.featured).length >= 3;
}

function loadContent(): SiteContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (validContent(parsed)) return parsed;
    }
  } catch {
    // Use the bundled seed when local storage is unavailable.
  }
  return seed;
}

type ContextValue = { content: SiteContent; save: (next: SiteContent) => void; storageError: string };
const ContentContext = createContext<ContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(loadContent);
  const [storageError, setStorageError] = useState("");
  useEffect(() => {
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (!existing) localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch {
      setStorageError("Browser storage is unavailable. Changes cannot be saved in this session.");
    }
  }, []);
  const save = (next: SiteContent) => {
    if (!validContent(next)) throw new Error("Please complete all required fields and keep slugs, stories, and references valid.");
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setContent(next);
      setStorageError("");
    } catch {
      setStorageError("Could not save to browser storage. Your changes were not saved; check available storage and try again.");
      throw new Error("Browser storage save failed.");
    }
  };
  const value = useMemo(() => ({ content, save, storageError }), [content, storageError]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const value = useContext(ContentContext);
  if (!value) throw new Error("useContent must be used inside ContentProvider");
  return value;
}

export const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const dateLabel = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
export function freshSeedArticle(): Story {
  return { slug: "", title: "", dek: "", categoryId: seed.categories[0].id, image: seed.articles[0].image, authorId: seed.authors[0].id, date: new Date().toISOString().slice(0, 10), readTime: 6, pullQuote: "", body: [""], specs: [], guide: false, featured: false, hero: false, spotlight: false };
}
