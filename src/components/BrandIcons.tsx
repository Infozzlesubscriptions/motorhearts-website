import { useEffect } from "react";

// Raster fallbacks are rendered from the same local SVG, keeping every icon in sync.
export default function BrandIcons() {
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    const urls: string[] = [];
    const image = new Image();
    const svgIcon = document.querySelector<HTMLLinkElement>('link[rel="icon"][type="image/svg+xml"]');

    const addIcon = (rel: string, type: string, sizes: string, bytes: Uint8Array) => {
      const url = URL.createObjectURL(new Blob([bytes], { type }));
      urls.push(url);
      const link = document.createElement("link");
      link.rel = rel;
      link.type = type;
      link.sizes.value = sizes;
      link.href = url;
      if (rel === "icon" && svgIcon) document.head.insertBefore(link, svgIcon);
      else document.head.appendChild(link);
      links.push(link);
    };

    image.onload = () => {
      const pngs = new Map<number, Uint8Array>();
      for (const size of [16, 32, 180]) {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext("2d");
        if (!context) return;
        context.drawImage(image, 0, 0, size, size);
        const base64 = canvas.toDataURL("image/png").split(",")[1];
        const bytes = Uint8Array.from(atob(base64), character => character.charCodeAt(0));
        pngs.set(size, bytes);
        addIcon(size === 180 ? "apple-touch-icon" : "icon", "image/png", `${size}x${size}`, bytes);
      }

      // Standard ICO directory with 16px and 32px PNG-encoded image entries.
      const sizes = [16, 32];
      const headerSize = 6 + sizes.length * 16;
      const ico = new Uint8Array(headerSize + sizes.reduce((sum, size) => sum + pngs.get(size)!.length, 0));
      const directory = new DataView(ico.buffer);
      directory.setUint16(2, 1, true);
      directory.setUint16(4, sizes.length, true);
      let offset = headerSize;
      sizes.forEach((size, index) => {
        const entry = 6 + index * 16;
        const png = pngs.get(size)!;
        directory.setUint8(entry, size);
        directory.setUint8(entry + 1, size);
        directory.setUint16(entry + 4, 1, true);
        directory.setUint16(entry + 6, 32, true);
        directory.setUint32(entry + 8, png.length, true);
        directory.setUint32(entry + 12, offset, true);
        ico.set(png, offset);
        offset += png.length;
      });
      addIcon("icon", "image/x-icon", "16x16 32x32", ico);
    };
    image.src = "/favicon.svg";
    return () => {
      image.onload = null;
      links.forEach(link => link.remove());
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  return null;
}
