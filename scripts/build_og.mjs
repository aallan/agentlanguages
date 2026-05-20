#!/usr/bin/env node
/**
 * Generate public/og-image.png — the social-share image rendered by Slack /
 * Twitter / Discord previews when agentlanguages.dev is linked.
 *
 * Run: node scripts/build_og.mjs
 *
 * The image uses system-font fallbacks (Georgia ≈ DM Serif Display,
 * Helvetica ≈ Inter, Menlo ≈ JetBrains Mono) because Sharp's SVG renderer
 * can't fetch the web fonts the live site loads from Google Fonts. The
 * substitutes are deliberately close in character; the result looks
 * intentional rather than fallback.
 */
import sharp from 'sharp';
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'og-image.png');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <!-- Warm off-white background, matches the site &#45;&#45;page token -->
  <rect width="1200" height="630" fill="#F7F6F2"/>

  <!-- Eyebrow -->
  <text x="80" y="130"
        font-family="Menlo, Monaco, monospace"
        font-size="22"
        fill="#707070"
        letter-spacing="3.5"
        font-weight="500">A COMMUNITY-EDITED CATALOGUE</text>

  <!-- Wordmark -->
  <text x="80" y="262"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="108"
        fill="#1A1A1A"
        font-weight="400">agentlanguages<tspan fill="#A1623B">.</tspan>dev</text>

  <!-- Tagline -->
  <text x="80" y="345"
        font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="38"
        fill="#404040"
        font-weight="400">Programming languages designed for AI agents to write.</text>

  <!-- Three camp bands fill the bottom 150px -->
  <rect x="0"   y="480" width="400" height="150" fill="#3E5C76"/>
  <rect x="400" y="480" width="400" height="150" fill="#A1623B"/>
  <rect x="800" y="480" width="400" height="150" fill="#5A7A53"/>

  <!-- Camp labels, centred in each band -->
  <text x="200"  y="568"
        font-family="Menlo, Monaco, monospace"
        font-size="22"
        fill="#F7F6F2"
        text-anchor="middle"
        letter-spacing="3.5"
        font-weight="500">SYNTACTIC</text>
  <text x="600"  y="568"
        font-family="Menlo, Monaco, monospace"
        font-size="22"
        fill="#F7F6F2"
        text-anchor="middle"
        letter-spacing="3.5"
        font-weight="500">VERIFICATION</text>
  <text x="1000" y="568"
        font-family="Menlo, Monaco, monospace"
        font-size="22"
        fill="#F7F6F2"
        text-anchor="middle"
        letter-spacing="3.5"
        font-weight="500">ORCHESTRATION</text>
</svg>
`;

await mkdir(dirname(OUT), { recursive: true });
await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toFile(OUT);

const stats = await sharp(OUT).metadata();
console.log(`Wrote ${OUT}`);
console.log(`  ${stats.width}×${stats.height} ${stats.format}, ${stats.size} bytes`);
