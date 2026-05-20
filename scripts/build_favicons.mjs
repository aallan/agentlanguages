#!/usr/bin/env node
/**
 * Render public/favicon.svg into a set of PNG variants so that the
 * default URLs browsers and crawlers silently request (/favicon.png,
 * /apple-touch-icon.png, /icon-192.png) all resolve.
 *
 * Why these specific sizes:
 *   - 32×32  →  /favicon.png        — common browser tab default
 *   - 180×180 → /apple-touch-icon.png — iOS home-screen icon
 *   - 192×192 → /icon-192.png        — Android home screen + Google Search
 *
 * Run: node scripts/build_favicons.mjs
 */
import sharp from 'sharp';
import { readFile, mkdir } from 'node:fs/promises';
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

for (const { name, size } of targets) {
  const out = join(OUT_DIR, name);
  await sharp(svg)
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(out);
  const stats = await sharp(out).metadata();
  console.log(`  ✓ ${name}  ${stats.width}×${stats.height}  ${stats.size} bytes`);
}
