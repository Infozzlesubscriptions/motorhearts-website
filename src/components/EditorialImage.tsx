import { useEffect, useRef, type ImgHTMLAttributes } from "react";

const widths = [400, 640, 960, 1440, 1920];
function responsiveSource(src: string) {
  try {
    const url = new URL(src);
    if (url.hostname !== "images.unsplash.com") return undefined;
    return widths.map(width => {
      const candidate = new URL(url);
      candidate.searchParams.set("w", String(width));
      candidate.searchParams.set("q", "80");
      candidate.searchParams.set("auto", "format");
      return `${candidate.href} ${width}w`;
    }).join(", ");
  } catch { return undefined; }
}

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  src: string;
  alt: string;
  parallax?: boolean;
  priority?: boolean;
};

export default function EditorialImage({ src, alt, parallax = false, priority = false, className = "", sizes = "100vw", ...props }: Props) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = ref.current;
    if (!parallax || !image) return;
    const preference = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference) and (pointer: fine)");
    let frame = 0;
    let active = false;
    let enabled = false;
    const update = () => {
      frame = 0;
      const container = image.parentElement;
      if (!container || !active || !enabled) return;
      const offset = Math.max(-18, Math.min(18, -container.getBoundingClientRect().top * 0.035));
      image.style.setProperty("--parallax-y", `${offset.toFixed(1)}px`);
    };
    const onScroll = () => { if (enabled && active && !frame) frame = requestAnimationFrame(update); };
    const onPreference = () => {
      enabled = preference.matches;
      image.style.setProperty("--parallax-scale", enabled ? "1.07" : "1");
      if (!enabled) {
        cancelAnimationFrame(frame);
        frame = 0;
        image.style.setProperty("--parallax-y", "0px");
      } else onScroll();
    };
    const observer = "IntersectionObserver" in window ? new IntersectionObserver(([entry]) => { active = entry.isIntersecting; onScroll(); }) : undefined;
    if (observer && image.parentElement) observer.observe(image.parentElement);
    else active = true;
    onPreference();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    preference.addEventListener("change", onPreference);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      preference.removeEventListener("change", onPreference);
    };
  }, [parallax]);

  return <img
    {...props}
    ref={ref}
    src={src}
    alt={alt}
    srcSet={responsiveSource(src)}
    sizes={sizes}
    loading={priority ? "eager" : "lazy"}
    decoding="async"
    fetchPriority={priority ? "high" : "auto"}
    onError={event => {
      const image = event.currentTarget;
      if (image.getAttribute("src") !== "/motorhearts-logo.png") {
        image.removeAttribute("srcset");
        image.src = "/motorhearts-logo.png";
      }
      props.onError?.(event);
    }}
    className={`${parallax ? "editorial-parallax" : "editorial-image"} ${className}`}
  />;
}
