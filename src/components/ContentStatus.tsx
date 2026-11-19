import { useContent } from "@/lib/ContentContext";
import { Skeleton } from "@/components/ui/skeleton";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
export function ContentStatus() {
  const { loading, error, isFallback, refresh, refreshing } = useContent();
  if (loading) return <div role="status" aria-label="Loading WordPress stories" className="space-y-7"><Skeleton className="h-8 w-48 rounded-full bg-muted" /><Skeleton className="h-16 w-3/4 rounded-xl bg-muted" /><Skeleton className="h-[350px] w-full rounded-2xl bg-muted" /><span className="sr-only">Loading stories from WordPress…</span></div>;
  if (!error) return null;
  return <div role="alert" className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-primary/40 bg-card p-5 text-sm"><p className="max-w-3xl text-muted-foreground">{error} {isFallback ? "Showing clearly marked sample stories, not published WordPress content." : "Showing the last successfully loaded stories."}</p><button disabled={refreshing} onClick={refresh} className="rounded-full bg-primary px-5 py-2 font-semibold text-white disabled:opacity-60">{refreshing ? "Retrying…" : "Retry connection"}</button></div>;
}
export function ContentLoadingPage() {
  return <><SiteHeader /><main className="mx-auto min-h-[70vh] max-w-7xl px-5 pb-20 pt-32 sm:px-8 sm:pt-40"><ContentStatus /></main><SiteFooter /></>;
}
