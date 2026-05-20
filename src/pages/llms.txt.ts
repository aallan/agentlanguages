import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// llms.txt index following https://llmstxt.org
//
// Structure: H1 title, blockquote summary, optional intro prose, then H2
// sections of bulleted `[Name](URL): description` entries. This is the
// short, human-curated map of the site — distinct from llms-full.txt which
// is a machine-friendly concatenation of every entry's full text.

export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL('https://agentlanguages.dev')).toString().replace(/\/$/, '');
  const languages = await getCollection('languages');

  const byCamp = (camp: string) =>
    languages
      .filter((l) => l.data.camp === camp)
      .sort((a, b) => a.data.name.localeCompare(b.data.name));

  const syntactic = byCamp('syntactic');
  const verification = byCamp('verification');
  const orchestration = byCamp('orchestration');
  const adjacent = byCamp('adjacent');
  const unclassified = byCamp('unclassified');
  const trackedCount = languages.length;

  const lines: string[] = [];

  lines.push('# agentlanguages.dev');
  lines.push('');
  lines.push(`> A community-edited catalogue of programming languages designed for AI agents to author code. ${trackedCount} projects organised around three philosophical camps: syntactic (strip ambiguity from the surface), verification (make contracts mechanically checkable), orchestration (constrain how agents coordinate), plus adjacent and unclassified buckets.`);
  lines.push('');
  lines.push('The catalogue is descriptive, not promotional. Inclusion is based on whether a language\'s designers explicitly target LLMs or agents as authors — through token-friendly syntax, mechanically checkable contracts, agent-coordination primitives, or first-class effect declarations for model calls. Tools that *use* an LLM at runtime (chatbots, autocomplete plug-ins, IDE assistants) are out of scope.');
  lines.push('');
  lines.push('Originally catalogued in a post ["Three camps alike in dignity"](https://negroniventurestudios.com/2026/05/20/three-camps-alike-in-dignity/) written for the Negroni Venture Studios blog. Maintained by Alasdair Allan.');
  lines.push('');

  lines.push('## Homepage');
  lines.push('');
  lines.push(`- [agentlanguages.dev](${base}/index.md): Markdown companion to the homepage — Three Camps narrative, full catalogue, methodology.`);
  lines.push('');

  lines.push('## Catalogue (full text)');
  lines.push('');
  lines.push(`- [llms-full.txt](${base}/llms-full.txt): Every entry concatenated into one machine-readable file. ${trackedCount} languages, full prose, design DNA cross-references, and timeline events.`);
  lines.push('');

  const renderEntry = (l: typeof languages[number]) => {
    return `- [${l.data.name}](${base}/languages/${l.id}.md): ${l.data.one_liner}`;
  };

  if (syntactic.length > 0) {
    lines.push(`## Syntactic camp (${syntactic.length})`);
    lines.push('');
    lines.push('Languages whose distinctive move is at the level of syntax — token-friendly surfaces, structural representations, IR-as-source.');
    lines.push('');
    syntactic.forEach((l) => lines.push(renderEntry(l)));
    lines.push('');
  }
  if (verification.length > 0) {
    lines.push(`## Verification camp (${verification.length})`);
    lines.push('');
    lines.push('Languages whose distinctive move is mechanical contract-checking — refinement types, mandatory contracts, effect systems, SMT-backed proofs.');
    lines.push('');
    verification.forEach((l) => lines.push(renderEntry(l)));
    lines.push('');
  }
  if (orchestration.length > 0) {
    lines.push(`## Orchestration camp (${orchestration.length})`);
    lines.push('');
    lines.push('Languages whose distinctive move is agent-coordination — sandboxing, replay, audit trails, deterministic workflows, capability systems.');
    lines.push('');
    orchestration.forEach((l) => lines.push(renderEntry(l)));
    lines.push('');
  }
  if (adjacent.length > 0) {
    lines.push(`## Adjacent (${adjacent.length})`);
    lines.push('');
    lines.push('Infrastructure that operates around agent-authored code rather than being authored by agents itself.');
    lines.push('');
    adjacent.forEach((l) => lines.push(renderEntry(l)));
    lines.push('');
  }
  if (unclassified.length > 0) {
    lines.push(`## Unclassified (${unclassified.length})`);
    lines.push('');
    lines.push('Candidates that haven\'t shipped enough machinery — or enough public evidence — to classify yet.');
    lines.push('');
    unclassified.forEach((l) => lines.push(renderEntry(l)));
    lines.push('');
  }

  lines.push('## Optional');
  lines.push('');
  lines.push(`- [robots.txt](${base}/robots.txt): Crawler policy. All agents welcome.`);
  lines.push(`- [sitemap.xml](${base}/sitemap.xml): XML sitemap of every URL (HTML pages and markdown companions).`);
  lines.push(`- [Source repository](https://github.com/aallan/agentlanguages): MIT-licensed code, CC BY 4.0 content. Pull requests welcome.`);
  lines.push(`- [Genesis essay](https://negroniventurestudios.com/2026/05/20/three-camps-alike-in-dignity/): "Three camps alike in dignity" — the originating taxonomy argument.`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
