import { createElement, useMemo, type ReactNode } from "react";
import Reveal from "./Reveal";
import { imageUrl, WORDPRESS_URL } from "@/lib/wordpress";
import { useContent, type Story } from "@/lib/ContentContext";

const allowed = new Set(["p", "h2", "h3", "h4", "h5", "h6", "strong", "em", "b", "i", "u", "s", "a", "ul", "ol", "li", "blockquote", "figure", "figcaption", "img", "br", "hr", "div", "span", "table", "thead", "tbody", "tr", "th", "td", "pre", "code", "sup", "sub", "video", "audio", "source"]);
const omitted = new Set(["script", "style", "iframe", "object", "embed", "form", "input", "button", "svg", "math", "template"]);
function renderNode(node: Node, key: number, stories: Story[]): ReactNode {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent;
  if (!(node instanceof Element)) return null;
  const tag = node.tagName.toLowerCase();
  if (omitted.has(tag)) return null;
  const children = Array.from(node.childNodes).map((child, index) => renderNode(child, index, stories));
  if (!allowed.has(tag)) return children;
  const props: Record<string, unknown> = { key };
  if (node.id) props.id = node.id;
  if (tag === "a") {
    const href = node.getAttribute("href") ?? "";
    try {
      const backend = new URL(`${WORDPRESS_URL}/`);
      const url = new URL(href, backend);
      if (["https:", "mailto:", "tel:"].includes(url.protocol)) {
        const lastSegment = url.pathname.split("/").filter(Boolean).pop();
        const isBackend = url.origin === backend.origin && url.pathname.startsWith(backend.pathname);
        const story = isBackend ? stories.find(article => article.slug === lastSegment || (url.searchParams.has("p") && article.wordpressId === Number(url.searchParams.get("p")))) : undefined;
        props.href = href.startsWith("#") ? href : story ? `/article/${story.slug}${url.hash}` : url.href;
      }
    } catch { /* An unsafe or malformed link remains plain text. */ }
    props.className = "underline decoration-primary underline-offset-4 hover:text-primary";
  }
  if (["img", "source", "video", "audio"].includes(tag)) {
    const src = imageUrl(node.getAttribute("src"), "");
    if (src) props.src = src;
    if (tag === "img") { if (!src) return null; props.alt = node.getAttribute("alt") ?? ""; props.loading = "lazy"; props.className = "h-auto max-w-full rounded-2xl"; }
    else if (tag !== "source") { props.controls = true; props.preload = "metadata"; props.className = "w-full rounded-2xl"; }
  }
  if (/^h[2-6]$/.test(tag)) props.className = "font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl";
  if (tag === "blockquote") props.className = "my-12 border-l-2 border-primary py-2 pl-7 font-display text-2xl font-semibold leading-snug text-foreground sm:text-3xl";
  if (tag === "ul" || tag === "ol") props.className = `space-y-2 pl-7 ${tag === "ul" ? "list-disc" : "list-decimal"}`;
  if (tag === "div") props.className = "space-y-7";
  if (tag === "figure") props.className = "overflow-x-auto";
  if (tag === "figcaption") props.className = "mt-3 text-sm text-muted-foreground";
  if (tag === "pre") props.className = "overflow-x-auto rounded-xl bg-card p-5 text-sm";
  if (tag === "table") props.className = "w-full border-collapse text-base";
  if (tag === "th" || tag === "td") props.className = "border border-border p-3 text-left";
  return ["img", "br", "hr", "source"].includes(tag) ? createElement(tag, props) : createElement(tag, props, ...children);
}
export default function WordPressBody({ html, pullQuote }: { html: string; pullQuote: string }) {
  const { content } = useContent();
  const blocks = useMemo(() => {
    const document = new DOMParser().parseFromString(html, "text/html");
    return Array.from(document.body.childNodes).filter(node => node.nodeType !== Node.TEXT_NODE || node.textContent?.trim()).map((node, index) => renderNode(node, index, content.articles));
  }, [html, content.articles]);
  return <>{blocks.map((block, index) => <div key={index}><Reveal>{block}</Reveal>{index === 1 && pullQuote && <Reveal><blockquote className="my-12 border-l-2 border-primary py-2 pl-7 font-display text-2xl font-semibold leading-snug text-foreground sm:text-3xl">“{pullQuote}”</blockquote></Reveal>}</div>)}</>;
}
