import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { freshSeedArticle, safeImage, slugify, useContent, type Story } from "@/lib/ContentContext";

const field = "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary";
const labelClass = "block text-xs font-medium text-muted-foreground";
type Tab = "articles" | "categories" | "authors" | "signups";
const initialStory = (content: ReturnType<typeof useContent>["content"]) => ({
  ...freshSeedArticle(),
  categoryId: content.categories[0].id,
  authorId: content.authors[0].id,
});
const formatSpecs = (specs: Story["specs"]) => specs.map(spec => `${spec.label} | ${spec.value}`).join("\n");

export default function Editor() {
  const { content, save, storageError } = useContent();
  const [tab, setTab] = useState<Tab>("articles");
  const [draft, setDraft] = useState<Story>(() => initialStory(content));
  const [specsText, setSpecsText] = useState("");
  const [editingSlug, setEditingSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryDraft, setCategoryDraft] = useState({ name: "", slug: "", blurb: "", image: "" });
  const [authorId, setAuthorId] = useState("");
  const [authorDraft, setAuthorDraft] = useState({ name: "", slug: "", role: "", bio: "", image: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "Local editor — MotorHearts";
    window.scrollTo(0, 0);
  }, []);

  const announce = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 4500);
  };
  const startNewStory = () => {
    setEditingSlug("");
    setDraft(initialStory(content));
    setSpecsText("");
    setMessage("");
  };
  const editStory = (story: Story) => {
    setEditingSlug(story.slug);
    setDraft({ ...story, body: [...story.body], specs: story.specs.map(spec => ({ ...spec })) });
    setSpecsText(formatSpecs(story.specs));
    setMessage("");
  };
  const setStory = <K extends keyof Story>(key: K, value: Story[K]) => setDraft(previous => ({ ...previous, [key]: value }));

  const submitStory = (event: FormEvent) => {
    event.preventDefault();
    const slug = (draft.slug || slugify(draft.title)).trim();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      announce("Use a URL-friendly slug with lowercase letters, numbers and hyphens.");
      return;
    }
    if (content.articles.some(article => article.slug === slug && article.slug !== editingSlug)) {
      announce("That article slug is already in use.");
      return;
    }
    if (!safeImage(draft.image)) {
      announce("Image must be an HTTPS URL or same-origin absolute path.");
      return;
    }

    const specLines = specsText.split(/\r?\n/).filter(line => line.trim());
    const parsedSpecs = specLines.map(line => {
      const [label, ...rest] = line.split("|");
      return { label: label.trim(), value: rest.join("|").trim() };
    });
    if (parsedSpecs.some(spec => !spec.label || !spec.value)) {
      announce("Each specification line needs a label and a value separated by |.");
      return;
    }

    const nextStory: Story = {
      ...draft,
      slug,
      title: draft.title.trim(),
      dek: draft.dek.trim(),
      pullQuote: draft.pullQuote.trim(),
      body: draft.body.map(paragraph => paragraph.trim()).filter(Boolean),
      specs: parsedSpecs,
    };
    let nextArticles = editingSlug
      ? content.articles.map(article => article.slug === editingSlug ? nextStory : article)
      : [...content.articles, nextStory];

    if (nextStory.hero) {
      nextArticles = nextArticles.map(article => article.slug === slug ? article : { ...article, hero: false });
    }
    if (nextStory.spotlight) {
      nextArticles = nextArticles.map(article => article.slug === slug ? article : { ...article, spotlight: false });
    }
    if (nextArticles.filter(article => article.hero).length !== 1) {
      announce("Keep exactly one homepage hero selected. Check the flag on another story to transfer it.");
      return;
    }
    if (nextArticles.filter(article => article.spotlight).length !== 1) {
      announce("Keep exactly one homepage spotlight selected. Check the flag on another story to transfer it.");
      return;
    }

    try {
      save({ ...content, articles: nextArticles });
      setEditingSlug(slug);
      setDraft(nextStory);
      setSpecsText(formatSpecs(nextStory.specs));
      announce("Story saved to this browser.");
    } catch (error) {
      announce(error instanceof Error ? error.message : "Could not save changes.");
    }
  };

  const deleteStory = (slug: string) => {
    if (!window.confirm(`Delete “${slug}” from this browser?`)) return;
    try {
      save({ ...content, articles: content.articles.filter(article => article.slug !== slug) });
      startNewStory();
      announce("Story removed from this browser.");
    } catch (error) {
      announce(error instanceof Error ? error.message : "Could not delete this story.");
    }
  };

  const submitCategory = (event: FormEvent) => {
    event.preventDefault();
    const slug = categoryDraft.slug || slugify(categoryDraft.name);
    const id = categoryId || slug;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !safeImage(categoryDraft.image)) {
      announce("Check the category slug and use a valid HTTPS or same-origin image URL.");
      return;
    }
    if (content.categories.some(category => (category.slug === slug || category.id === id) && category.id !== categoryId)) {
      announce("That category slug is already in use.");
      return;
    }
    const nextCategory = { id, name: categoryDraft.name.trim(), slug, blurb: categoryDraft.blurb.trim(), image: categoryDraft.image };
    try {
      save({ ...content, categories: categoryId ? content.categories.map(category => category.id === categoryId ? nextCategory : category) : [...content.categories, nextCategory] });
      setCategoryId(id);
      announce("Category saved to this browser.");
    } catch (error) {
      announce(error instanceof Error ? error.message : "Could not save category.");
    }
  };

  const deleteCategory = (id: string) => {
    const category = content.categories.find(item => item.id === id);
    if (content.articles.some(article => article.categoryId === id)) {
      announce("This category is referenced by stories and cannot be deleted.");
      return;
    }
    if (!category || !window.confirm(`Delete ${category.name}?`)) return;
    try {
      save({ ...content, categories: content.categories.filter(item => item.id !== id) });
      setCategoryId("");
      setCategoryDraft({ name: "", slug: "", blurb: "", image: "" });
      announce("Category deleted.");
    } catch (error) {
      announce(error instanceof Error ? error.message : "Could not delete category.");
    }
  };

  const submitAuthor = (event: FormEvent) => {
    event.preventDefault();
    const slug = authorDraft.slug || slugify(authorDraft.name);
    const id = authorId || slug;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || (authorDraft.image && !safeImage(authorDraft.image))) {
      announce("Check the author slug and image URL.");
      return;
    }
    if (content.authors.some(author => (author.slug === slug || author.id === id) && author.id !== authorId)) {
      announce("That author slug is already in use.");
      return;
    }
    const nextAuthor = { id, ...authorDraft, slug, name: authorDraft.name.trim(), role: authorDraft.role.trim(), bio: authorDraft.bio.trim() };
    try {
      save({ ...content, authors: authorId ? content.authors.map(author => author.id === authorId ? nextAuthor : author) : [...content.authors, nextAuthor] });
      setAuthorId(id);
      announce("Author saved to this browser.");
    } catch (error) {
      announce(error instanceof Error ? error.message : "Could not save author.");
    }
  };

  const deleteAuthor = (id: string) => {
    const author = content.authors.find(item => item.id === id);
    if (content.articles.some(article => article.authorId === id)) {
      announce("This author is referenced by stories and cannot be deleted.");
      return;
    }
    if (!author || !window.confirm(`Delete ${author.name}?`)) return;
    try {
      save({ ...content, authors: content.authors.filter(item => item.id !== id) });
      setAuthorId("");
      setAuthorDraft({ name: "", slug: "", role: "", bio: "", image: "" });
      announce("Author deleted.");
    } catch (error) {
      announce(error instanceof Error ? error.message : "Could not delete author.");
    }
  };

  const tabs: Tab[] = ["articles", "categories", "authors", "signups"];
  return <>
    <SiteHeader />
    <main className="mx-auto max-w-7xl px-5 pb-20 pt-28 sm:px-8 sm:pt-36">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">Browser-local CMS demo</p>
      <h1 className="font-display text-4xl font-bold sm:text-5xl">MotorHearts editor</h1>
      <div className="mt-6 rounded-xl border border-primary/40 bg-card p-5 text-sm leading-6">
        <strong className="text-primary">Not protected or shared.</strong> This editor stores content and newsletter entries only in localStorage in this browser. It has no authentication, database, server, or email delivery. Anyone using this browser profile may view or edit it. Do not enter secrets, confidential information, or sensitive personal data. Browser storage can be cleared; consider keeping your own backup of important writing.
      </div>
      {storageError && <p role="alert" className="mt-4 rounded-lg border border-destructive/60 bg-card p-4 text-sm text-destructive">{storageError}</p>}
      <div className="mt-8 flex flex-wrap gap-2 border-b border-border pb-4">
        {tabs.map(name => <button key={name} onClick={() => { setTab(name); setMessage(""); }} className={`rounded-full px-4 py-2 text-sm capitalize ${tab === name ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"}`}>{name === "signups" ? "Local signups" : name}</button>)}
      </div>
      {message && <p aria-live="polite" className="mt-4 rounded-lg border border-border bg-card px-4 py-3 text-sm">{message}</p>}

      {tab === "articles" && <div className="mt-7 grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
        <aside>
          <div className="mb-4 flex items-center justify-between"><h2 className="font-display text-xl font-bold">Stories</h2><button onClick={startNewStory} className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white">New story</button></div>
          <div className="space-y-2">{content.articles.map(article => <div key={article.slug} className={`flex items-center gap-2 rounded-lg border p-3 ${editingSlug === article.slug ? "border-primary" : "border-border"}`}><button onClick={() => editStory(article)} className="min-w-0 flex-1 text-left"><span className="block truncate text-sm font-medium">{article.title}</span><span className="text-xs text-muted-foreground">/{article.slug}</span></button><button onClick={() => deleteStory(article.slug)} aria-label={`Delete ${article.title}`} className="text-xs text-muted-foreground hover:text-destructive">Delete</button></div>)}</div>
        </aside>
        <form onSubmit={submitStory} className="space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-7">
          <div className="flex items-center justify-between"><h2 className="font-display text-xl font-bold">{editingSlug ? "Edit story" : "Create story"}</h2>{editingSlug && <Link to={`/article/${editingSlug}`} className="text-xs text-primary">View story ↗</Link>}</div>
          <div className="grid gap-4 sm:grid-cols-2"><label className={labelClass}>Title<input required value={draft.title} onChange={event => setStory("title", event.target.value)} className={field} /></label><label className={labelClass}>Stable URL slug<input required value={draft.slug} onChange={event => setStory("slug", event.target.value)} placeholder={slugify(draft.title)} className={field} /></label></div>
          <label className={labelClass}>Dek / summary<textarea required rows={2} value={draft.dek} onChange={event => setStory("dek", event.target.value)} className={field} /></label>
          <label className={labelClass}>Image URL (HTTPS or same-origin absolute path)<input required value={draft.image} onChange={event => setStory("image", event.target.value)} className={field} /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>Category<select value={draft.categoryId} onChange={event => setStory("categoryId", event.target.value)} className={field}>{content.categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
            <label className={labelClass}>Author<select value={draft.authorId} onChange={event => setStory("authorId", event.target.value)} className={field}>{content.authors.map(author => <option key={author.id} value={author.id}>{author.name}</option>)}</select></label>
            <label className={labelClass}>Publication date<input type="date" required value={draft.date} onChange={event => setStory("date", event.target.value)} className={field} /></label>
            <label className={labelClass}>Read time (minutes)<input type="number" min="1" required value={draft.readTime} onChange={event => setStory("readTime", Number(event.target.value))} className={field} /></label>
          </div>
          <label className={labelClass}>Pull quote<input required value={draft.pullQuote} onChange={event => setStory("pullQuote", event.target.value)} className={field} /></label>
          <label className={labelClass}>Body paragraphs (separate paragraphs with a blank line)<textarea required rows={8} value={draft.body.join("\n\n")} onChange={event => setStory("body", event.target.value.split(/\n\s*\n/))} className={field} /></label>
          <label className={labelClass}>Specifications (one per line: label | value)<textarea rows={4} value={specsText} onChange={event => setSpecsText(event.target.value)} className={field} /></label>
          <div className="grid gap-3 sm:grid-cols-2">{([["guide", "Popular guide"], ["featured", "Featured story"], ["hero", "Homepage hero"], ["spotlight", "Homepage spotlight"]] as const).map(([key, title]) => <label key={key} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm"><input type="checkbox" checked={draft[key]} onChange={event => setStory(key, event.target.checked)} className="accent-[hsl(var(--primary))]" />{title}</label>)}</div>
          <p className="text-xs leading-5 text-muted-foreground">Checking Homepage hero or Homepage spotlight transfers that selection from the current story. Keep one hero, one spotlight and at least three featured stories. Existing article slugs are stable unless explicitly changed.</p>
          <button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">Save story locally</button>
        </form>
      </div>}

      {tab === "categories" && <div className="mt-7 grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
        <aside className="space-y-2">{content.categories.map(category => <button key={category.id} onClick={() => { setCategoryId(category.id); setCategoryDraft({ name: category.name, slug: category.slug, blurb: category.blurb, image: category.image }); }} className="block w-full rounded-lg border border-border p-4 text-left">{category.name}<span className="block text-xs text-muted-foreground">/{category.slug}</span></button>)}</aside>
        <form onSubmit={submitCategory} className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-bold">{categoryId ? "Edit category" : "New category"}</h2>
          <label className={labelClass}>Name<input required value={categoryDraft.name} onChange={event => setCategoryDraft({ ...categoryDraft, name: event.target.value })} className={field} /></label>
          <label className={labelClass}>Slug<input required value={categoryDraft.slug} onChange={event => setCategoryDraft({ ...categoryDraft, slug: event.target.value })} className={field} /></label>
          <label className={labelClass}>Description<textarea required value={categoryDraft.blurb} onChange={event => setCategoryDraft({ ...categoryDraft, blurb: event.target.value })} className={field} /></label>
          <label className={labelClass}>Tile image<input required value={categoryDraft.image} onChange={event => setCategoryDraft({ ...categoryDraft, image: event.target.value })} className={field} /></label>
          <div className="flex gap-3"><button className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white">Save category locally</button>{categoryId && <button type="button" onClick={() => deleteCategory(categoryId)} className="rounded-full border border-border px-5 py-2.5 text-sm">Delete</button>}<button type="button" onClick={() => { setCategoryId(""); setCategoryDraft({ name: "", slug: "", blurb: "", image: "" }); }} className="text-sm text-muted-foreground">New</button></div>
        </form>
      </div>}

      {tab === "authors" && <div className="mt-7 grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
        <aside className="space-y-2">{content.authors.map(author => <button key={author.id} onClick={() => { setAuthorId(author.id); setAuthorDraft({ name: author.name, slug: author.slug, role: author.role, bio: author.bio, image: author.image }); }} className="block w-full rounded-lg border border-border p-4 text-left">{author.name}<span className="block text-xs text-muted-foreground">{author.role}</span></button>)}</aside>
        <form onSubmit={submitAuthor} className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-bold">{authorId ? "Edit author" : "New author"}</h2>
          <label className={labelClass}>Name<input required value={authorDraft.name} onChange={event => setAuthorDraft({ ...authorDraft, name: event.target.value })} className={field} /></label>
          <label className={labelClass}>Slug<input required value={authorDraft.slug} onChange={event => setAuthorDraft({ ...authorDraft, slug: event.target.value })} className={field} /></label>
          <label className={labelClass}>Role<input required value={authorDraft.role} onChange={event => setAuthorDraft({ ...authorDraft, role: event.target.value })} className={field} /></label>
          <label className={labelClass}>Biography<textarea required value={authorDraft.bio} onChange={event => setAuthorDraft({ ...authorDraft, bio: event.target.value })} className={field} /></label>
          <label className={labelClass}>Portrait URL (optional)<input value={authorDraft.image} onChange={event => setAuthorDraft({ ...authorDraft, image: event.target.value })} className={field} /></label>
          <div className="flex gap-3"><button className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white">Save author locally</button>{authorId && <button type="button" onClick={() => deleteAuthor(authorId)} className="rounded-full border border-border px-5 py-2.5 text-sm">Delete</button>}<button type="button" onClick={() => { setAuthorId(""); setAuthorDraft({ name: "", slug: "", role: "", bio: "", image: "" }); }} className="text-sm text-muted-foreground">New</button></div>
        </form>
      </div>}

      {tab === "signups" && <section className="mt-7">
        <p className="mb-5 text-sm leading-6 text-muted-foreground">Local demo entries only. These addresses were not delivered to an email service and are not real subscriptions.</p>
        {content.signups.length ? <div className="space-y-2">{content.signups.map(entry => <div key={entry.email} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card p-4"><div><p className="font-medium">{entry.email}</p><p className="mt-1 text-xs text-muted-foreground">Consent recorded · {new Date(entry.createdAt).toLocaleString()}</p></div><button onClick={() => { try { save({ ...content, signups: content.signups.filter(signup => signup.email !== entry.email) }); announce("Local signup removed."); } catch { announce("Could not remove this entry."); } }} className="text-xs text-muted-foreground hover:text-destructive">Remove</button></div>)}</div> : <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">No local demo entries yet.</p>}
      </section>}
      <div className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground"><Link to="/" className="hover:text-primary">← Return to the public site</Link></div>
    </main>
    <SiteFooter />
  </>;
}
