#!/usr/bin/env node
/**
 * Render public/favicon.svg into the set of PNG and ICO variants so that
 * the default URLs browsers and crawlers silently request all resolve.
 *
 * Why these specific files:
 *   - /favicon.png         32×32   — common browser tab default
 *   - /apple-touch-icon.png 180×180 — iOS home-screen icon
 *   - /icon-192.png         192×192 — Android home screen + Google Search
 *   - /favicon.ico        16/32/48  — legacy browsers and crawlers; multi-size
 *                                      ICO so the OS picks the closest sharp
 *                                      variant for whatever it's rendering
 *
 * Run: node scripts/build_favicons.mjs
 */
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { crc32 } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SVG = join(ROOT, 'public', 'favicon.svg');
const OUT_DIR = join(ROOT, 'public');

const targets = [
  { name: 'favicon.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
];

/**
 * Pin the deflate window declared in a PNG's zlib header to 32K.
 *
 * libvips sizes the deflate window to the input, so images whose raw
 * scanlines fit under 8K (favicon.png, at 4128 bytes, is the only one here)
 * get a 8K window declared instead of 32K. The compressed payload is
 * byte-identical either way — the window only bounds how far back a
 * decoder may need to look, and declaring a larger one is always safe —
 * but the two bytes of header differ, and the IDAT CRC differs with them.
 *
 * That made the committed PNGs drift on a libvips upgrade for no visible
 * reason: same pixels, six different bytes. Normalising the header here
 * keeps the output stable across sharp versions, and reproduces the
 * originally committed bytes exactly.
 *
 * Only the first IDAT is touched: the zlib stream spans all IDAT chunks,
 * so its two header bytes are always at the start of the first one.
 */
function pinDeflateWindow(png) {
  const out = Buffer.from(png);
  let i = 8; // past the 8-byte PNG signature
  while (i < out.length) {
    const length = out.readUInt32BE(i);
    if (out.toString('latin1', i + 4, i + 8) === 'IDAT') {
      const cmf = i + 8;
      // CMF low nibble is the compression method (8 = deflate); the high
      // nibble is log2(window) - 8, so 7 means 32K. FLG carries FLEVEL and
      // FDICT, then five check bits chosen so the pair is a multiple of 31.
      if ((out[cmf] & 0x0f) === 8 && out[cmf] >> 4 !== 7) {
        out[cmf] = 0x78;
        const flagsWithoutCheck = out[cmf + 1] & 0xe0;
        const remainder = ((out[cmf] << 8) | flagsWithoutCheck) % 31;
        out[cmf + 1] = flagsWithoutCheck | (remainder === 0 ? 0 : 31 - remainder);
        out.writeUInt32BE(crc32(out.subarray(i + 4, i + 8 + length)), i + 8 + length);
      }
      return out;
    }
    i += 8 + length + 4;
  }
  return out;
}

const svg = await readFile(SVG);
await mkdir(OUT_DIR, { recursive: true });

// PNG variants
for (const { name, size } of targets) {
  const out = join(OUT_DIR, name);
  const png = pinDeflateWindow(
    await sharp(svg).resize(size, size).png({ compressionLevel: 9 }).toBuffer()
  );
  await writeFile(out, png);
  console.log(`  ✓ ${name}  ${size}×${size}  ${png.length} bytes`);
}

// Multi-size ICO. Bundle 16, 32, and 48 into one /favicon.ico so older
// browsers can pick the closest variant at whatever size they render.
const icoBuffers = await Promise.all(
  [16, 32, 48].map((size) => sharp(svg).resize(size, size).png().toBuffer())
);
const icoOut = join(OUT_DIR, 'favicon.ico');
await writeFile(icoOut, await pngToIco(icoBuffers));
const icoStats = await stat(icoOut);
console.log(`  ✓ favicon.ico  multi-size (16, 32, 48)  ${icoStats.size} bytes`);
