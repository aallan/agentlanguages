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

const svg = await readFile(SVG);
await mkdir(OUT_DIR, { recursive: true });

// PNG variants
for (const { name, size } of targets) {
  const out = join(OUT_DIR, name);
  await sharp(svg)
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(out);
  const stats = await sharp(out).metadata();
  console.log(`  ✓ ${name}  ${stats.width}×${stats.height}  ${stats.size} bytes`);
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
