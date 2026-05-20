import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// llms-full.txt — every entry concatenated into one file.
//
// The convention (from llmstxt.org / Mintlify) is that llms.txt is a short
// index and llms-full.txt is the full text. Agents that want the entire
// catalogue in one fetch hit this URL; agents that want to navigate hit
// llms.txt and follow its links.
//
// Sectioned by camp; each entry rendered with the same shape the
// per-language .md companion uses, so the byte stream is internally
// consistent regardless of which surface a tool grabbed.

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

export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL('https://agentlanguages.dev')).toString().replace(/\/$/, '');
  const languages = await getCollection('languages');
  const trackedCount = languages.length;

  const byCamp = (camp: string) =>
    languages
      .filter((l) => l.data.camp === camp)
      .sort((a, b) => a.data.name.localeCompare(b.data.name));

  const camps: { key: string; label: string; intro: string }[] = [
    {
      key: 'syntactic',
      label: 'Syntactic camp',
      intro: 'If the problem is that models trip on syntax, the fix is to strip ambiguity from the syntax itself. The syntactic camp treats the problem as one of representation — models choke on tokens that mean different things in different positions, on operators that need disambiguation, on whitespace that might or might not be load-bearing. Their answer: build a syntax where every token has one job.',
    },
    {
      key: 'verification',
      label: 'Verification camp',
      intro: 'The model doesn\'t need to be right. It needs to be checkable. The verification camp accepts that LLMs will keep making semantic errors and asks a different question: can the compiler catch them? Their answer is mandatory contracts, refinement types, effect systems, and SMT-backed proofs — the machinery of formal methods, repurposed as a guardrail for generative code.',
    },
    {
      key: 'orchestration',
      label: 'Orchestration camp',
      intro: 'It isn\'t a language problem. It\'s an agent-coordination problem. The orchestration camp re-frames the question — the trouble with LLM-authored code, they argue, isn\'t any specific defect in the code; it\'s that agents need to be sequenced, sandboxed, audited, and approved by humans at the right points. The language is just the substrate; the runtime is where the action is.',
    },
    {
      key: 'adjacent',
      label: 'Adjacent',
      intro: 'Infrastructure that operates around agent-authored code rather than being authored by agents itself. These are wiring layers, runtime substrates, and tooling that the three-camp argument depends on but doesn\'t directly produce.',
    },
    {
      key: 'unclassified',
      label: 'Unclassified',
      intro: 'Candidates that haven\'t shipped enough machinery — or enough public evidence — to classify yet. Their presence in the catalogue is a marker of position rather than a placement claim.',
    },
  ];

  const lines: string[] = [];

  // Document header.
  lines.push('# agentlanguages.dev — full catalogue');
  lines.push('');
  lines.push(`> Complete machine-readable text of the agentlanguages.dev catalogue. ${trackedCount} languages designed for AI agents to author code, organised across five buckets: three philosophical camps (syntactic, verification, orchestration) plus adjacent and unclassified.`);
  lines.push('');
  lines.push('This file is the full-text companion to the short index at https://agentlanguages.dev/llms.txt — included here so that an agent that wants the entire catalogue can fetch it in one HTTP round-trip rather than 27 (homepage + one per entry).');
  lines.push('');
  lines.push('Each entry below carries a `## Name` heading and a metadata block (camp, author, implementation language, compilation target, licence, first seen, maturity, site, repo, paper, agent tooling) followed by the editorial prose and, where present, design-DNA cross-references and timeline events.');
  lines.push('');
  lines.push('Originally catalogued in a post "Three camps alike in dignity" (https://negroniventurestudios.com/2026/05/20/three-camps-alike-in-dignity/) written for the Negroni Venture Studios blog. Maintained by Alasdair Allan.');
  lines.push('');
  lines.push('Editorial principles: descriptive, not promotional. No ranking. Inclusion is based on whether a language\'s designers explicitly target LLMs or agents as authors. Tools that *use* an LLM at runtime are out of scope.');
  lines.push('');

  // Per-camp sections.
  for (const camp of camps) {
    const entries = byCamp(camp.key);
    if (entries.length === 0) continue;

    lines.push('---');
    lines.push('');
    lines.push(`# ${camp.label} (${entries.length})`);
    lines.push('');
    lines.push(`> ${camp.intro}`);
    lines.push('');

    for (const language of entries) {
      const { data, body, id } = language;

      lines.push(`## ${data.name}`);
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
        lines.push('**Agent tooling:**');
        for (const tool of data.agent_tooling) {
          lines.push(`- ${tool}`);
        }
      }
      lines.push('');
      lines.push('### Key idea');
      lines.push('');
      lines.push(data.key_idea.trim());
      lines.push('');

      lines.push((body ?? '').trim());
      lines.push('');

      if (data.crossrefs && data.crossrefs.length > 0) {
        lines.push('### Design DNA');
        lines.push('');
        for (const ref of data.crossrefs) {
          lines.push(`- **${ref.name}** *(${campLabel[ref.camp]})* — ${ref.relation}`);
        }
        lines.push('');
      }

      if (data.history && data.history.length > 0) {
        lines.push('### Timeline');
        lines.push('');
        for (const event of data.history) {
          lines.push(`- **${event.when}** — ${event.what}`);
        }
        lines.push('');
      }

      lines.push(`*Detail page: ${base}/languages/${id}/  ·  Markdown companion: ${base}/languages/${id}.md*`);
      lines.push('');
    }
  }

  lines.push('---');
  lines.push('');
  lines.push('## See also');
  lines.push('');
  lines.push(`- Homepage (HTML): ${base}/`);
  lines.push(`- Homepage (markdown): ${base}/index.md`);
  lines.push(`- Short index: ${base}/llms.txt`);
  lines.push(`- Sitemap: ${base}/sitemap.xml`);
  lines.push(`- Source repository: https://github.com/aallan/agentlanguages`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
