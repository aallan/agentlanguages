// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

// We dropped @astrojs/sitemap and emit our own sitemap.xml from
// src/pages/sitemap.xml.ts — the integration ignores non-HTML routes,
// which would have hidden the markdown companions, llms.txt, and
// llms-full.txt from search and agent crawlers.
export default defineConfig({
  site: 'https://agentlanguages.dev',
  integrations: [mdx()],
});
