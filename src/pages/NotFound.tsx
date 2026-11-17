import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const NotFound = () => {
  useEffect(() => {
    document.title = "Page not found — MotorHearts";
    window.scrollTo(0, 0);
  }, []);

  return <><SiteHeader /><main className="mx-auto flex min-h-[75vh] max-w-7xl flex-col justify-center px-5 pb-20 pt-32 sm:px-8"><p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">404 · A wrong turn</p><h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">The road ends here.</h1><p className="mt-5 text-muted-foreground">The page you're looking for doesn't exist. Let's get you back on track.</p><Link to="/" className="mt-8 inline-flex w-fit items-center gap-3 rounded-full border border-border px-6 py-3 text-sm transition-colors hover:border-primary hover:text-primary"><ArrowLeft className="h-4 w-4" /> Back to the journal</Link></main><SiteFooter /></>;
};

export default NotFound;
