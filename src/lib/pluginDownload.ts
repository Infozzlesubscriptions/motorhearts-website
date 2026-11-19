import plugin from "@/wordpress/motorhearts-content.php?raw";
import instructions from "@/wordpress/README.md?raw";

// A stored ZIP uses no compression, so the plugin can be downloaded without a build-time archive dependency.
function archive(files: Record<string, string>) {
  const encoder = new TextEncoder();
  const local: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;
  let centralSize = 0;
  const crc32 = (bytes: Uint8Array) => {
    let crc = 0xffffffff;
    for (const byte of bytes) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
    return (crc ^ 0xffffffff) >>> 0;
  };
  for (const [path, content] of Object.entries(files)) {
    const name = encoder.encode(path);
    const data = encoder.encode(content);
    const crc = crc32(data);
    const header = new Uint8Array(30 + name.length);
    const view = new DataView(header.buffer);
    view.setUint32(0, 0x04034b50, true); view.setUint16(4, 20, true); view.setUint16(6, 0x800, true);
    view.setUint16(12, 0x21, true); view.setUint32(14, crc, true); view.setUint32(18, data.length, true); view.setUint32(22, data.length, true); view.setUint16(26, name.length, true);
    header.set(name, 30);
    local.push(header, data);
    const directory = new Uint8Array(46 + name.length);
    const index = new DataView(directory.buffer);
    index.setUint32(0, 0x02014b50, true); index.setUint16(4, 20, true); index.setUint16(6, 20, true); index.setUint16(8, 0x800, true);
    index.setUint16(14, 0x21, true); index.setUint32(16, crc, true); index.setUint32(20, data.length, true); index.setUint32(24, data.length, true); index.setUint16(28, name.length, true); index.setUint32(42, offset, true);
    directory.set(name, 46);
    central.push(directory); centralSize += directory.length; offset += header.length + data.length;
  }
  const end = new Uint8Array(22);
  const view = new DataView(end.buffer);
  view.setUint32(0, 0x06054b50, true); view.setUint16(8, central.length, true); view.setUint16(10, central.length, true); view.setUint32(12, centralSize, true); view.setUint32(16, offset, true);
  const output = new Uint8Array(offset + centralSize + end.length);
  let position = 0;
  for (const part of [...local, ...central, end]) { output.set(part, position); position += part.length; }
  return new Blob([output.buffer], { type: "application/zip" });
}
export function downloadPlugin() {
  const url = URL.createObjectURL(archive({ "motorhearts-content/motorhearts-content.php": plugin, "motorhearts-content/README.md": instructions }));
  const link = document.createElement("a");
  link.href = url; link.download = "motorhearts-content.zip";
  document.body.appendChild(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10000);
}
