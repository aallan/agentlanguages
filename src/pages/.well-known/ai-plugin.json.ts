import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Agent-plugin manifest, served at /.well-known/ai-plugin.json.
//
// Was previously a static file in public/.well-known/. Moved here so the
// project count in description_for_model stays in sync with the content
// collection — adding a language MDX file now updates the manifest on the
// next build, no manual edit needed.

export const GET: APIRoute = async () => {
  const languages = await getCollection('languages');
  const trackedCount = languages.length;

  const manifest = {
    schema_version: 'v1',
    name_for_human: 'agentlanguages.dev',
    name_for_model: 'agentlanguages',
    description_for_human:
      'A community-edited catalogue of programming languages designed for AI agents to author code, organised around three philosophical camps: syntactic, verification, and orchestration.',
    description_for_model: `agentlanguages.dev is a curated catalogue of programming languages designed for LLMs and AI agents to write code. The catalogue organises ${trackedCount} projects into three philosophical camps — syntactic (strip ambiguity from the surface), verification (mechanically checkable contracts), orchestration (constrain agent coordination) — plus adjacent and unclassified buckets. Use /llms.txt for the short index and /llms-full.txt for the complete machine-readable text of every entry. Each language has a markdown companion at /languages/<slug>.md.`,
    auth: { type: 'none' },
    api: {
      type: 'none',
      url: 'https://agentlanguages.dev/llms.txt',
    },
    logo_url: 'https://agentlanguages.dev/icon-192.png',
    contact_email: 'alasdair@babilim.co.uk',
    legal_info_url: 'https://github.com/aallan/agentlanguages/blob/main/LICENSE',
  };

  return new Response(JSON.stringify(manifest, null, 2) + '\n', {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
