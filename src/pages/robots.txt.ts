import type { APIRoute } from 'astro';

// Agent-welcoming robots: allow everything, advertise the sitemap and the
// llms.txt index. The catalogue's whole point is that AI agents should read
// it — gating crawlers with restrictive rules would defeat the purpose.
export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL('https://agentlanguages.dev')).toString().replace(/\/$/, '');
  const body = `# agentlanguages.dev — AI agents welcome
User-agent: *
Allow: /

# AI-readable documentation
# See https://llmstxt.org for the llms.txt specification
Sitemap: ${base}/sitemap.xml
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
