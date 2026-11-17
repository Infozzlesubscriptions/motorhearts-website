import { useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const sections: Record<string, { title: string; intro: string; body: string[] }> = {
  about: {
    title: "About MotorHearts",
    intro: "A publication for people who feel something when the road opens up.",
    body: [
      "MotorHearts explores automotive culture through thoughtful stories about cars, motorcycles, electric bikes, classic machines, performance and the journeys that connect us.",
      "This site is an independent editorial showcase. Its sample features, names and specifications are illustrative and may not describe real products or events.",
      "Our aim is simple: to make room for curiosity, craft and the human feeling behind the machine.",
    ],
  },
  editorial: {
    title: "Editorial policy",
    intro: "A clear point of view, with the limits of this showcase plainly stated.",
    body: [
      "MotorHearts is presented as an independent editorial publication. Sample stories on this site are illustrative showcase content, not verified reporting, product testing or professional advice.",
      "In a live editorial operation, factual claims, imagery rights, conflicts of interest and corrections would be reviewed through a documented editorial process. This demo does not make assurances that those processes have occurred.",
      "Descriptions and specifications in the sample stories should not be relied on for purchasing, safety, repair or other decisions.",
    ],
  },
  privacy: {
    title: "Privacy policy",
    intro: "This demonstration keeps its editable content in your browser.",
    body: [
      "The local editor and newsletter demo use browser localStorage on this device. Changes and signup entries are not sent to a server, shared CMS or email service. The newsletter form does not deliver email and does not create a real subscription.",
      "This is a browser-local demonstration, not a secure CMS. Anyone with access to this browser profile may view or change its local content. Do not enter secrets, confidential information or sensitive personal data. Clearing browser storage can remove saved content.",
      "Pages automatically load images hosted by Unsplash and fonts hosted by Google Fonts. When those resources load, your browser contacts the respective hosts, which may receive request and connection metadata. Navigation and optional share actions may also open third-party websites when you choose to use those links. This showcase policy is informational and is not legal assurance or legal advice.",
    ],
  },
};

export default function InfoPage({ kind }: { kind: "about" | "editorial" | "privacy" }) {
  const page = sections[kind];
  useEffect(() => {
    document.title = `${page.title} — MotorHearts`;
    window.scrollTo(0, 0);
  }, [page.title]);
  return <>
    <SiteHeader />
    <main className="mx-auto min-h-[70vh] max-w-4xl px-5 pb-20 pt-32 sm:px-8 sm:pt-40">
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">MotorHearts</p>
      <h1 className="font-display text-4xl font-bold sm:text-6xl">{page.title}</h1>
      <p className="mt-6 text-xl leading-relaxed text-muted-foreground">{page.intro}</p>
      <div className="mt-10 space-y-6 border-t border-border pt-8 text-base leading-8 text-foreground/85">{page.body.map(text => <p key={text}>{text}</p>)}</div>
    </main>
    <SiteFooter />
  </>;
}
