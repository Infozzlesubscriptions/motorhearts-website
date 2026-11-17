import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import LogoConcept, { type LogoConceptId } from "@/components/LogoConcept";

const concepts: { id: LogoConceptId; number: string; name: string; direction: string; description: string }[] = [
  {
    id: "precision", number: "01", name: "Precision", direction: "Modern international publication",
    description: "A balanced three-spoke steering wheel, a small red twelve-o’clock index and a confident, widely spaced sans-serif wordmark. Clean, instantly automotive and easy to use in a horizontal header.",
  },
  {
    id: "grand-tourer", number: "02", name: "Grand Tourer", direction: "Understated heritage luxury",
    description: "A softly sculpted, flat-bottom wheel paired with a refined serif wordmark. A centred emblem-and-name composition inspired by the craftsmanship of grand touring, rather than motorsport graphics.",
  },
  {
    id: "apex", number: "03", name: "Apex", direction: "Architectural and contemporary",
    description: "An open steering-wheel rim, a discreet red lower signature and a compact two-line wordmark. More distinctive and graphic, with a recognisable symbol that works without the full name.",
  },
];

export default function BrandConcepts() {
  useEffect(() => {
    document.title = "Three new logo concepts — MotorHearts";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
    <Link to="/" className="inline-flex items-center gap-3 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Return to MotorHearts</Link>
    <header className="mb-12 mt-12 max-w-3xl">
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">Brand direction · concept studies</p>
      <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">Three ways to feel<br />the road.</h1>
      <p className="mt-5 text-base leading-7 text-muted-foreground">Three earlier steering-wheel identity studies, each with a different typographic character and a matching favicon. The site now uses your uploaded MotorHearts artwork as its logo.</p>
    </header>
    <div className="space-y-12">
      {concepts.map(concept => <section key={concept.id} aria-labelledby={`concept-${concept.id}`} className="overflow-hidden rounded-2xl border border-border">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border bg-card px-6 py-5 sm:px-8">
          <h2 id={`concept-${concept.id}`} className="font-display text-2xl font-semibold"><span className="mr-3 text-sm font-medium text-primary">{concept.number}</span>{concept.name}</h2>
          <p className="text-xs text-muted-foreground">{concept.direction}</p>
        </div>
        <div className="grid sm:grid-cols-2">
          <figure className="bg-background px-4 py-9 text-[#DFE2E5] sm:px-7 sm:py-12">
            <LogoConcept concept={concept.id} />
            <figcaption className="mt-4 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Silver on charcoal</figcaption>
          </figure>
          <figure className="editorial-light px-4 py-9 sm:px-7 sm:py-12">
            <LogoConcept concept={concept.id} />
            <figcaption className="mt-4 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Ink on warm white</figcaption>
          </figure>
        </div>
        <div className="grid gap-8 border-t border-border bg-card px-6 py-7 sm:px-8 md:grid-cols-[1fr_0.7fr]">
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">{concept.description}</p>
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Matching favicon · actual sizes</p>
            <div className="flex items-end gap-7">
              {[16, 32, 64].map(size => <figure key={size} className="flex flex-col items-center gap-3">
                <LogoConcept concept={concept.id} iconOnly size={size} />
                <figcaption className="text-[10px] text-muted-foreground">{size} px</figcaption>
              </figure>)}
            </div>
          </div>
        </div>
      </section>)}
    </div>
    <aside className="mt-12 rounded-2xl border border-border bg-card p-7 sm:p-9">
      <h2 className="font-display text-2xl font-semibold">Current logo: your uploaded artwork</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">Your uploaded artwork is used in the header, footer and mobile navigation. These earlier concepts remain here for reference. The existing Apex favicon is unchanged.</p>
    </aside>
  </main>;
}
