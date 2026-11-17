import { useEffect, useRef, useState, type ReactNode } from "react";

// Share a single observer across the page; release each target after its entrance.
const callbacks = new WeakMap<Element, () => void>();
let observer: IntersectionObserver | undefined;
function observe(element: Element, reveal: () => void) {
  observer ??= new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callbacks.get(entry.target)?.();
        callbacks.delete(entry.target);
        observer?.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });
  callbacks.set(element, reveal);
  observer.observe(element);
  return () => {
    callbacks.delete(element);
    observer?.unobserve(element);
  };
}

type Props = {
  children: ReactNode;
  as?: "div" | "section" | "article";
  className?: string;
  id?: string;
  delay?: number;
};

export default function Reveal({ children, as: Tag = "div", className, id, delay = 0 }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element || preference.matches || !("IntersectionObserver" in window)) return;
    // Never hide above-the-fold content or delay the largest contentful paint.
    if (element.getBoundingClientRect().top < window.innerHeight) return;
    setVisible(false);
    const stop = observe(element, () => setVisible(true));
    const onPreference = () => { if (preference.matches) { setVisible(true); stop(); } };
    preference.addEventListener("change", onPreference);
    return () => { stop(); preference.removeEventListener("change", onPreference); };
  }, []);

  return <Tag
    ref={(element: HTMLElement | null) => { ref.current = element; }}
    id={id}
    className={className}
    data-reveal={visible ? "visible" : "pending"}
    style={{ transitionDelay: `${Math.min(Math.max(delay, 0), 240)}ms` }}
  >{children}</Tag>;
}
