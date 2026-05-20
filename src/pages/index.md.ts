import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Markdown companion to the homepage.
//
// Mirrors the prose on agentlanguages.dev (hero, camps narrative, three camp
// sections, full catalogue index, methodology) but as flat markdown — no
// component scaffolding, no theme toggle, no syntax-highlighted hand-tuned
// code samples. The HTML pages remain the primary surface; this exists so
// that an agent following `<link rel="alternate" type="text/markdown">` or
// scanning llms.txt can read the substance in one fetch.

const campLabel: Record<string, string> = {
  syntactic: 'Syntactic',
  verification: 'Verification',
  orchestration: 'Orchestration',
  adjacent: 'Adjacent',
  unclassified: 'Unclassified',
};

const campOrder: Record<string, number> = {
  syntactic: 0, verification: 1, orchestration: 2, adjacent: 3, unclassified: 4,
};

export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL('https://agentlanguages.dev')).toString().replace(/\/$/, '');
  const languages = await getCollection('languages');

  // Group by camp, alphabetical within each.
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

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const buildDate = new Date();
  const asOfLabel = `${buildDate.getDate()} ${monthNames[buildDate.getMonth()]} ${buildDate.getFullYear()}`;

  const lines: string[] = [];

  lines.push('# agentlanguages.dev');
  lines.push('');
  lines.push(`> A community-edited catalogue of programming languages designed for AI agents to author code. ${trackedCount} projects organised around three philosophical camps — syntactic, verification, orchestration — plus adjacent and unclassified buckets.`);
  lines.push('');
  lines.push(`As of ${asOfLabel}. ${trackedCount} languages tracked.`);
  lines.push('');
  lines.push('Originally catalogued in a post ["Three camps alike in dignity"](https://negroniventurestudios.com/2026/05/20/three-camps-alike-in-dignity/) written for the Negroni Venture Studios blog.');
  lines.push('');

  // The taxonomy.
  lines.push('## The taxonomy');
  lines.push('');
  lines.push('Three camps disagree on how to frame the problem. The **Syntactic** camp says it\'s representational — strip ambiguity at the token level. The **Verification** camp says it\'s semantic — make contracts mechanically checkable. The **Orchestration** camp says it isn\'t a language problem at all — constrain how agents coordinate. The catalogue below treats them as evidence that this disagreement is real.');
  lines.push('');

  // Syntactic camp.
  lines.push('## Syntactic');
  lines.push('');
  lines.push('> If the problem is that models trip on syntax, the fix is to strip ambiguity from the syntax itself.');
  lines.push('');
  lines.push('The syntactic camp treats the problem as one of representation. Models choke on tokens that mean different things in different positions, on operators that need disambiguation, on whitespace that might or might not be load-bearing. Their answer: build a syntax where every token has one job.');
  lines.push('');
  lines.push('The strongest entries replace text with structure (X07\'s JSON ASTs), eliminate operators in favour of keywords (NERD), or surface intermediate representations as the user-facing form (Magpie\'s SSA). The weakest are exercises in extreme density — one-character opcodes — that read more as conceptual art than as production languages.');
  lines.push('');
  lines.push('What unites them is a belief that the LLM\'s job is easier if the surface is simpler. What divides them from the verification camp is the absence of any mechanism for the compiler to catch what the model gets wrong.');
  lines.push('');

  // Verification camp.
  lines.push('## Verification');
  lines.push('');
  lines.push('> The model doesn\'t need to be right. It needs to be checkable.');
  lines.push('');
  lines.push('The verification camp accepts that LLMs will keep making semantic errors and asks a different question: can the compiler catch them? Their answer is mandatory contracts, refinement types, effect systems, and SMT-backed proofs — the machinery of formal methods, repurposed as a guardrail for generative code.');
  lines.push('');
  lines.push('This is the camp with the most established theoretical foundation (the work goes back to ML, Coq, Dafny, and Lean) and also the most mature implementations. MoonBit ships a full toolchain with ICSE-published research; Vera ships measured benchmark wins against Python on zero training data; AILANG claims to be written autonomously by its own coordinator.');
  lines.push('');
  lines.push('The provocative entry is Prove — same diagnosis, opposite conclusion. It uses verification to make the language *resistant* to AI generation. The licence explicitly prohibits training use. Same camp, opposite politics.');
  lines.push('');

  // Orchestration camp.
  lines.push('## Orchestration');
  lines.push('');
  lines.push('> It isn\'t a language problem. It\'s an agent-coordination problem.');
  lines.push('');
  lines.push('The orchestration camp re-frames the question. The trouble with LLM-authored code, they argue, isn\'t any specific defect in the code — it\'s that agents need to be sequenced, sandboxed, audited, and approved by humans at the right points. The language is just the substrate; the runtime is where the action is.');
  lines.push('');
  lines.push('Some entries here are academic (Pel from CMU, Quasar from Penn); some are infrastructure (Marsha treats the LLM as the compiler itself); one is a serious engineering effort aimed squarely at regulated industries (Boruna\'s hash-chained evidence bundles and deterministic replay).');
  lines.push('');
  lines.push('This camp overlaps the most with the others — Boruna includes a type checker and capability system; Quasar adds conformal prediction. The line between "language for agents" and "framework for agents" is genuinely blurry here, which is itself informative.');
  lines.push('');

  // Catalogue listing.
  const renderEntry = (l: typeof languages[number]) => {
    return `- **[${l.data.name}](${base}/languages/${l.id}.md)** — ${l.data.one_liner}`;
  };

  lines.push(`## The full catalogue (as of ${asOfLabel})`);
  lines.push('');
  lines.push('Every language designed for LLMs or agents to author code.');
  lines.push('');

  if (syntactic.length > 0) {
    lines.push('### Syntactic camp');
    lines.push('');
    syntactic.forEach((l) => lines.push(renderEntry(l)));
    lines.push('');
  }
  if (verification.length > 0) {
    lines.push('### Verification camp');
    lines.push('');
    verification.forEach((l) => lines.push(renderEntry(l)));
    lines.push('');
  }
  if (orchestration.length > 0) {
    lines.push('### Orchestration camp');
    lines.push('');
    orchestration.forEach((l) => lines.push(renderEntry(l)));
    lines.push('');
  }
  if (adjacent.length > 0 || unclassified.length > 0) {
    lines.push('### Adjacent & unclassified');
    lines.push('');
    lines.push('Infrastructure that operates around these languages, or candidates that haven\'t shipped enough to classify.');
    lines.push('');
    [...adjacent, ...unclassified].forEach((l) => lines.push(renderEntry(l)));
    lines.push('');
  }

  // Methodology.
  lines.push('## Methodology');
  lines.push('');
  lines.push('A community-edited catalogue of programming languages designed for AI agents to author code — not languages that *use* LLMs at runtime, but languages whose syntax, semantics, or runtime are deliberately shaped around an agent being the primary author.');
  lines.push('');
  lines.push('### What counts');
  lines.push('');
  lines.push('The bar is intent. A language is in scope if its designers explicitly target LLMs or agents as authors — through token-friendly syntax, mechanically checkable contracts, agent-coordination primitives, or first-class effect declarations for model calls.');
  lines.push('');
  lines.push('A tool that calls an LLM at runtime (chatbots, autocomplete plug-ins, IDE assistants) is not in scope. A language whose only innovation is "works with Copilot" is not in scope. The line is the design intent, not the tooling.');
  lines.push('');
  lines.push('### How to contribute');
  lines.push('');
  lines.push(`Open a pull request adding a Markdown file to \`src/content/languages/\` in the repository. The [contribution guide](https://github.com/aallan/agentlanguages/blob/main/CONTRIBUTING.md) asks for evidence the project meets the inclusion bar and a self-classified camp with justification.`);
  lines.push('');
  lines.push('The maintainer reviews each submission for fit, accuracy, and tone (the catalogue is descriptive, not promotional). Marginal cases get discussed in the PR thread. Edits to existing entries are welcome — especially corrections from the language\'s authors.');
  lines.push('');

  // Resources for agents.
  lines.push('## Agent-accessible resources');
  lines.push('');
  lines.push(`- [llms.txt](${base}/llms.txt) — index following the [llmstxt.org](https://llmstxt.org) spec`);
  lines.push(`- [llms-full.txt](${base}/llms-full.txt) — every entry concatenated in one file`);
  lines.push(`- [sitemap.xml](${base}/sitemap.xml) — XML sitemap (HTML and markdown surfaces)`);
  lines.push(`- [robots.txt](${base}/robots.txt) — crawler policy (all agents welcome)`);
  lines.push('');
  lines.push('Each entry above links to its individual markdown companion (`/languages/<slug>.md`).');
  lines.push('');

  lines.push('---');
  lines.push('');
  lines.push(`HTML version: ${base}/`);
  lines.push(`Maintained by Alasdair Allan · [github.com/aallan/agentlanguages](https://github.com/aallan/agentlanguages)`);
  lines.push('');

  // campOrder reserved for future stable ordering across heterogeneous lists.
  void campOrder;
  void campLabel;

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
