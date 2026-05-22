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
  // Renamed entries land here so existing links keep working. Astro
  // emits a static HTML redirect page (meta-refresh + canonical link)
  // for each entry. Add new mappings as they happen; remove old ones
  // when you're confident nothing in the wild still references them.
  redirects: {
    // Was incorrectly catalogued as "Raskell" (the maintainer's blog
    // domain). Renamed to BHC/hx — the actual project names — after
    // feedback from the maintainer. Original URL existed for ~1 day.
    '/languages/raskell': '/languages/bhc-hx',
    '/languages/raskell.md': '/languages/bhc-hx.md',
  },
});
