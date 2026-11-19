import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ContentStatus } from "@/components/ContentStatus";
import { useContent } from "@/lib/ContentContext";
import { WORDPRESS_ADMIN } from "@/lib/wordpress";
import { downloadPlugin } from "@/lib/pluginDownload";
import guide from "@/wordpress/README.md?raw";

type Tab = "articles" | "categories" | "authors" | "signups";
const buttonClass = "inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90";
function AdminLink({ path, children }: { path: string; children: ReactNode }) {
  return <a href={`${WORDPRESS_ADMIN}${path}`} target="_blank" rel="noopener noreferrer" className={buttonClass}>{children} ↗</a>;
}
export default function Editor() {
  const { content, save, loading, isFallback, refresh, refreshing, storageError } = useContent();
  const [tab, setTab] = useState<Tab>("articles");
  const [message, setMessage] = useState("");
  useEffect(() => { document.title = "WordPress editor — MotorHearts"; window.scrollTo(0, 0); }, []);
  const live = !loading && !isFallback;
  const pluginDetected = live && content.articles.some(article => article.pluginFields);
  return <>
    <SiteHeader />
    <main className="mx-auto max-w-7xl px-5 pb-20 pt-28 sm:px-8 sm:pt-36">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">WordPress content management</p>
      <h1 className="font-display text-4xl font-bold sm:text-5xl">MotorHearts editor</h1>
      <div className="mt-6 rounded-xl border border-primary/40 bg-card p-5 text-sm leading-6">
        <strong className="text-primary">WordPress is the editorial source.</strong> Manage published stories, images, categories and contributors in authenticated WordPress admin. This page does not request your admin password and cannot modify published content from the browser.
        <div className="mt-5 flex flex-wrap gap-3"><AdminLink path="">Open WordPress admin</AdminLink><button onClick={downloadPlugin} className="rounded-full border border-border px-5 py-2.5 text-sm hover:border-primary">Download WordPress plugin</button><button onClick={refresh} disabled={refreshing} className="rounded-full border border-border px-5 py-2.5 text-sm disabled:opacity-60">{refreshing ? "Refreshing…" : "Refresh WordPress content"}</button></div>
        <p className="mt-4 text-xs text-muted-foreground">{loading ? "Connecting to WordPress…" : isFallback ? "Offline fallback active — these are sample stories." : `WordPress connected · ${content.articles.length} published ${content.articles.length === 1 ? "story" : "stories"}.`} {pluginDetected ? "MotorHearts plugin fields detected." : live && content.articles.length ? "Custom plugin fields not detected yet. Install and activate the plugin below." : "Publish a post after activation to confirm plugin fields."}</p>
      </div>
      <div className="mt-6"><ContentStatus /></div>
      {storageError && <p role="alert" className="mt-4 rounded-lg border border-destructive/60 bg-card p-4 text-sm text-destructive">{storageError}</p>}
      <div className="mt-8 flex flex-wrap gap-2 border-b border-border pb-4">
        {(["articles", "categories", "authors", "signups"] as Tab[]).map(name => <button key={name} onClick={() => { setTab(name); setMessage(""); }} className={`rounded-full px-4 py-2 text-sm capitalize ${tab === name ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"}`}>{name === "signups" ? "Local signups" : name}</button>)}
      </div>
      {message && <p aria-live="polite" className="mt-4 rounded-lg border border-border bg-card px-4 py-3 text-sm">{message}</p>}
      {tab === "articles" && <div className="mt-7 grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
        <aside><div className="mb-4 flex items-center justify-between"><h2 className="font-display text-xl font-bold">Stories</h2><AdminLink path="post-new.php">New story</AdminLink></div><div className="space-y-2">{live && content.articles.map(article => <div key={article.slug} className="flex items-center gap-2 rounded-lg border border-border p-3"><Link to={`/article/${article.slug}`} className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{article.title}</span><span className="text-xs text-muted-foreground">/{article.slug}</span></Link><a target="_blank" rel="noopener noreferrer" href={`${WORDPRESS_ADMIN}post.php?post=${article.wordpressId}&action=edit`} className="text-xs text-primary">Edit ↗</a></div>)}{live && !content.articles.length && <p className="text-sm text-muted-foreground">No published stories yet. Create your first in WordPress.</p>}</div></aside>
        <section className="space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-7"><h2 className="font-display text-xl font-bold">Publish and select stories</h2><p className="text-sm leading-7 text-muted-foreground">In Posts → Add New, enter the title and body, set an excerpt, category, author and featured image, then Publish. The URL slug becomes the article URL here.</p><p className="text-sm leading-7 text-muted-foreground">The MotorHearts Editorial panel controls Homepage cover story, Editorial spotlight, Featured story and Popular guide. It also supports a custom dek, pull quote, reading time, primary category, featured ordering and specifications.</p><p className="text-sm leading-7 text-muted-foreground">Use one specification per line: <strong className="text-foreground">Power | 612 hp</strong>. Hero and spotlight selections transfer between published stories automatically. With no selections, the latest story is used. No minimum post count is required.</p><AdminLink path="edit.php">Manage WordPress posts</AdminLink></section>
      </div>}
      {tab === "categories" && <div className="mt-7 grid gap-8 lg:grid-cols-[0.7fr_1.3fr]"><aside className="space-y-2">{live && content.categories.map(category => <Link key={category.id} to={`/category/${category.slug}`} className="block w-full rounded-lg border border-border p-4 text-left">{category.name}<span className="block text-xs text-muted-foreground">/{category.slug}</span></Link>)}</aside><section className="space-y-4 rounded-2xl border border-border bg-card p-6"><h2 className="font-display text-xl font-bold">Edit categories in WordPress</h2><p className="text-sm leading-7 text-muted-foreground">Under Posts → Categories, set the name, slug and description. Use MotorHearts category image → Choose image to select artwork from the Media Library, then save. Plugin activation creates the six original categories without overwriting existing ones.</p><AdminLink path="edit-tags.php?taxonomy=category">Manage categories</AdminLink></section></div>}
      {tab === "authors" && <div className="mt-7 grid gap-8 lg:grid-cols-[0.7fr_1.3fr]"><aside className="space-y-2">{live && content.authors.map(author => <Link key={author.id} to={`/author/${author.slug}`} className="block w-full rounded-lg border border-border p-4 text-left">{author.name}<span className="block text-xs text-muted-foreground">{author.role}</span></Link>)}</aside><section className="space-y-4 rounded-2xl border border-border bg-card p-6"><h2 className="font-display text-xl font-bold">Manage contributors</h2><p className="text-sm leading-7 text-muted-foreground">Edit a WordPress user’s Display name publicly as and Biographical Info. The plugin adds Editorial role and Portrait. Assign that user as a post’s author. Only contributors with published posts appear here.</p><AdminLink path="users.php">Manage WordPress users</AdminLink></section></div>}
      {tab === "signups" && <section className="mt-7"><p className="mb-5 text-sm leading-6 text-muted-foreground">Existing local demo entries only. These are not sent to WordPress or an email provider and are not real subscriptions.</p>{content.signups.length ? <div className="space-y-2">{content.signups.map(entry => <div key={entry.email} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card p-4"><div><p className="font-medium">{entry.email}</p><p className="mt-1 text-xs text-muted-foreground">Consent recorded · {new Date(entry.createdAt).toLocaleString()}</p></div><button onClick={() => { try { save({ ...content, signups: content.signups.filter(signup => signup.email !== entry.email) }); setMessage("Local signup removed."); } catch { setMessage("Could not remove this entry."); } }} className="text-xs text-muted-foreground hover:text-destructive">Remove</button></div>)}</div> : <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">No local demo entries yet.</p>}</section>}
      <section className="mt-12 rounded-2xl border border-border bg-card p-6 sm:p-8"><h2 className="font-display text-2xl font-bold">Plugin installation</h2><ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-6 text-muted-foreground"><li>Download the WordPress plugin ZIP above.</li><li>In WordPress admin, open Plugins → Add New Plugin → Upload Plugin.</li><li>Select <strong className="text-foreground">motorhearts-content.zip</strong>, install it, then Activate.</li><li>Publish a story, set your category images, and refresh WordPress content here.</li></ol><details className="mt-6"><summary className="cursor-pointer text-sm font-semibold text-primary">Complete management and troubleshooting guide</summary><pre className="mt-5 whitespace-pre-wrap break-words font-sans text-sm leading-7 text-muted-foreground">{guide}</pre></details></section>
      <div className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground"><Link to="/" className="hover:text-primary">← Return to the public site</Link></div>
    </main><SiteFooter />
  </>;
}
