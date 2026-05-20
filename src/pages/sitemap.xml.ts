import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Hand-rolled sitemap.
//
// We replaced @astrojs/sitemap with this endpoint because the integration
// only emits HTML routes — it doesn't see the .md companions, /llms.txt,
// /llms-full.txt, or /index.md. Those *are* the agent-accessibility
// surface, so omitting them from the sitemap would defeat the point.
//
// Every URL gets lastmod set to today's build date and a coarse changefreq.
// Priority tracks editorial importance: homepage > camp anchors > other
// entries > markdown alternates.

const ANCHOR_SLUGS = new Set(['magpie', 'vera', 'boruna']); // The three camp anchors.

export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL('https://agentlanguages.dev')).toString().replace(/\/$/, '');
  const today = new Date().toISOString().slice(0, 10);

  type Entry = { loc: string; priority: string; changefreq: string };
  const urls: Entry[] = [];

  // Homepage.
  urls.push({ loc: `${base}/`, priority: '1.0', changefreq: 'weekly' });
  urls.push({ loc: `${base}/index.md`, priority: '0.9', changefreq: 'weekly' });

  // Agent-discovery files. llms.txt is the index that agents are most likely
  // to land on first, so it gets a higher priority than the full-text dump.
  urls.push({ loc: `${base}/llms.txt`, priority: '0.9', changefreq: 'weekly' });
  urls.push({ loc: `${base}/llms-full.txt`, priority: '0.8', changefreq: 'weekly' });

  // Per-language pages and their markdown companions.
  const languages = await getCollection('languages');
  const sorted = languages.sort((a, b) => a.id.localeCompare(b.id));
  for (const language of sorted) {
    const isAnchor = ANCHOR_SLUGS.has(language.id);
    const htmlPriority = isAnchor ? '0.9' : '0.7';
    const mdPriority = isAnchor ? '0.8' : '0.6';
    urls.push({ loc: `${base}/languages/${language.id}/`, priority: htmlPriority, changefreq: 'monthly' });
    urls.push({ loc: `${base}/languages/${language.id}.md`, priority: mdPriority, changefreq: 'monthly' });
  }

  const xmlEntries = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlEntries}\n</urlset>\n`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
