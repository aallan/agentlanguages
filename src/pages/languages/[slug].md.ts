import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

// Markdown companion for every catalogue entry.
//
// Why a markdown alternate exists at all: large-language-model crawlers and
// agent SDKs prefer plain markdown over rendered HTML. The HTML detail pages
// carry layout cruft (nav, footer, breadcrumbs, theme toggle) that the model
// has to strip out before reading the substance; the .md companion gives them
// the substance directly. Discoverable through the `<link rel="alternate">`
// tag in Base.astro, the llms.txt index, and the sitemap.
//
// The output is *not* the raw source file (which would dump the YAML
// frontmatter at the top — readable, but ugly). Instead we render the
// frontmatter as a human-readable definition list so an agent can grok the
// metadata as prose.

export const getStaticPaths: GetStaticPaths = async () => {
  const languages = await getCollection('languages');
  return languages.map((language) => ({
    params: { slug: language.id },
    props: { language },
  }));
};

interface Props {
  language: CollectionEntry<'languages'>;
}

const campLabel: Record<string, string> = {
  syntactic: 'Syntactic',
  verification: 'Verification',
  orchestration: 'Orchestration',
  adjacent: 'Adjacent',
  unclassified: 'Unclassified',
};

const maturityLabel: Record<string, string> = {
  thought_experiment: 'thought experiment',
  research_paper: 'research paper',
  early_implementation: 'early implementation',
  working_compiler: 'working compiler',
  production_ready: 'production-ready',
};

const longMonths = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function firstSeen(date: string): string {
  const [year, month] = date.split('-');
  return `${longMonths[parseInt(month, 10) - 1]} ${year}`;
}

export const GET: APIRoute = ({ props, site }) => {
  const { language } = props as Props;
  const { data, body, id } = language;
  const base = (site ?? new URL('https://agentlanguages.dev')).toString().replace(/\/$/, '');

  const lines: string[] = [];
  lines.push(`# ${data.name}`);
  lines.push('');
  lines.push(`> ${data.one_liner}`);
  lines.push('');
  lines.push(`**Camp:** ${campLabel[data.camp]}`);
  if (data.spans_camps && data.spans_camps.length > 0) {
    lines.push(`**Also spans:** ${data.spans_camps.map((c) => campLabel[c]).join(', ')}`);
  }
  lines.push(`**Author:** ${data.author}`);
  lines.push(`**Implementation language:** ${data.implementation_language}`);
  lines.push(`**Compilation target:** ${data.compilation_target}`);
  lines.push(`**Licence:** ${data.license}`);
  lines.push(`**First seen:** ${firstSeen(data.date_appeared)}`);
  lines.push(`**Maturity:** ${maturityLabel[data.maturity]}`);
  lines.push(`**Site:** ${data.url}`);
  if (data.repo) lines.push(`**Repo:** https://github.com/${data.repo}`);
  if (data.paper) lines.push(`**Paper:** ${data.paper}`);
  if (data.benchmark) lines.push(`**${data.benchmark.label}:** ${data.benchmark.url}`);
  if (data.agent_tooling && data.agent_tooling.length > 0) {
    lines.push('');
    lines.push('**Agent tooling:**');
    for (const tool of data.agent_tooling) {
      lines.push(`- ${tool}`);
    }
  }
  lines.push('');
  lines.push('## Key idea');
  lines.push('');
  lines.push(data.key_idea.trim());
  lines.push('');

  // The body field contains the markdown body sans frontmatter. We keep its
  // inline HTML (<code>, <em>, <span>, <pre>) — markdown allows inline HTML,
  // and stripping it would lose the syntax-highlighted code samples.
  lines.push((body ?? '').trim());
  lines.push('');

  if (data.crossrefs && data.crossrefs.length > 0) {
    lines.push('## Design DNA');
    lines.push('');
    for (const ref of data.crossrefs) {
      lines.push(`- **[${ref.name}](${base}/languages/${ref.slug}.md)** *(${campLabel[ref.camp]})* — ${ref.relation}`);
    }
    lines.push('');
  }

  if (data.history && data.history.length > 0) {
    lines.push('## Timeline');
    lines.push('');
    for (const event of data.history) {
      lines.push(`- **${event.when}** — ${event.what}`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push(`HTML version: ${base}/languages/${id}/`);
  lines.push(`Catalogue index: ${base}/llms.txt`);
  lines.push(`Catalogue homepage: ${base}/index.md`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
