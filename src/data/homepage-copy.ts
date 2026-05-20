// Shared editorial copy for the homepage.
//
// Imported by both src/pages/index.astro (rendered HTML) and
// src/pages/index.md.ts (markdown companion) so that an editorial reword
// lands in one place and propagates to both surfaces. Before this module
// existed, the same prose lived in both files — see commit 15f0716 for
// the smoking-gun two-edit reword that motivated the extraction.
//
// Prose is stored as plain text with markdown-style inline emphasis
// (`code`, [link](url), *italic*). Each consumer applies its own
// rendering:
//
//   HTML: inlineMarkdownToHtml(...) converts the inline syntax, and
//         withCampSpans(...) wraps the three camp names with camp-coloured
//         <span> tags on the camps-intro paragraph specifically.
//   MD:   strings are emitted verbatim — markdown consumers handle the
//         inline syntax natively — with withCampBold(...) wrapping the
//         three camp names in **bold** on the camps-intro paragraph.
//
// Unicode em-dash (—) and curly quotes (' " ") are stored as the actual
// Unicode characters rather than HTML entities, so the markdown surface
// reads cleanly. Browsers render the Unicode bytes identically to the
// equivalent entities in the HTML surface.

export const campsIntro = {
  heading: 'Three camps disagree on how to frame the problem.',
  body: "The Syntactic camp says the problem is representational — strip ambiguity at the token level. The Verification camp says it's semantic — make contracts mechanically checkable. The Orchestration camp says it isn't a language problem at all — constrain how agents coordinate. The catalogue below treats them as evidence that this disagreement is real.",
};

export const camps = {
  syntactic: {
    thesis: 'If the problem is that models trip on syntax, the fix is to strip ambiguity from the syntax itself.',
    paragraphs: [
      'The syntactic camp treats the problem as one of representation. Models choke on tokens that mean different things in different positions, on operators that need disambiguation, on whitespace that might or might not be load-bearing. Their answer: build a syntax where every token has one job.',
      "The strongest entries replace text with structure (X07's JSON ASTs), eliminate operators in favour of keywords (NERD), or surface intermediate representations as the user-facing form (Magpie's SSA). The weakest are exercises in extreme density — one-character opcodes — that read more as conceptual art than as production languages.",
      "What unites them is a belief that the LLM's job is easier if the surface is simpler. What divides them from the verification camp is the absence of any mechanism for the compiler to catch what the model gets wrong.",
    ],
  },
  verification: {
    thesis: "The model doesn't need to be right. It needs to be checkable.",
    paragraphs: [
      'The verification camp accepts that LLMs will keep making semantic errors and asks a different question: can the compiler catch them? Their answer is mandatory contracts, refinement types, effect systems, and SMT-backed proofs — the machinery of formal methods, repurposed as a guardrail for generative code.',
      'This is the camp with the most established theoretical foundation (the work goes back to ML, Coq, Dafny, and Lean) and also the most mature implementations. MoonBit ships a full toolchain with ICSE-published research; Vera ships measured benchmark wins against Python on zero training data; AILANG claims to be written autonomously by its own coordinator.',
      'The provocative entry is Prove — same diagnosis, opposite conclusion. It uses verification to make the language *resistant* to AI generation. The licence explicitly prohibits training use. Same camp, opposite politics.',
    ],
  },
  orchestration: {
    thesis: "It isn't a language problem. It's an agent-coordination problem.",
    paragraphs: [
      "The orchestration camp re-frames the question. The trouble with LLM-authored code, they argue, isn't any specific defect in the code — it's that agents need to be sequenced, sandboxed, audited, and approved by humans at the right points. The language is just the substrate; the runtime is where the action is.",
      "Some entries here are academic (Pel from CMU, Quasar from Penn); some are infrastructure (Marsha treats the LLM as the compiler itself); one is a serious engineering effort aimed squarely at regulated industries (Boruna's hash-chained evidence bundles and deterministic replay).",
      'This camp overlaps the most with the others — Boruna includes a type checker and capability system; Quasar adds conformal prediction. The line between “language for agents” and “framework for agents” is genuinely blurry here, which is itself informative.',
    ],
  },
} as const;

export const methodology = {
  lead: 'A community-edited catalogue of programming languages designed for AI agents to author code — not languages that *use* LLMs at runtime, but languages whose syntax, semantics, or runtime are deliberately shaped around an agent being the primary author.',
  whatCounts: {
    heading: 'What counts',
    paragraphs: [
      'The bar is intent. A language is in scope if its designers explicitly target LLMs or agents as authors — through token-friendly syntax, mechanically checkable contracts, agent-coordination primitives, or first-class effect declarations for model calls.',
      'A tool that calls an LLM at runtime (chatbots, autocomplete plug-ins, IDE assistants) is not in scope. A language whose only innovation is “works with Copilot” is not in scope. The line is the design intent, not the tooling.',
    ],
  },
  howToContribute: {
    heading: 'How to contribute',
    paragraphs: [
      'Open a pull request adding a Markdown file to `src/content/languages/`. The [contribution guide](https://github.com/aallan/agentlanguages/blob/main/CONTRIBUTING.md) asks for evidence the project meets the inclusion bar and a self-classified camp with justification.',
      "The maintainer reviews each submission for fit, accuracy, and tone (the catalogue is descriptive, not promotional). Marginal cases get discussed in the PR thread. Edits to existing entries are welcome — especially corrections from the language's authors.",
    ],
  },
  forMachines: {
    heading: 'For machines',
    paragraphs: [
      'The catalogue is itself a machine-readable specification. Every detail page has a markdown companion at the same path with a `.md` extension, discoverable through `<link rel="alternate">` and the [llmstxt.org](https://llmstxt.org) conventions.',
      'Use [/llms.txt](/llms.txt) for the short index, [/llms-full.txt](/llms-full.txt) for every entry in one file, or [/sitemap.xml](/sitemap.xml) for the full URL set. Agents and crawlers are explicitly welcome.',
    ],
  },
} as const;

// Camp-name styling helpers — only applied to the camps-intro paragraph,
// which names each camp once. The .replace() call (singular, not replaceAll)
// matches only the first occurrence so we don't accidentally wrap the same
// name twice in nested HTML or markdown.
const CAMP_NAMES: ReadonlyArray<readonly [string, string]> = [
  ['Syntactic', 'syn'],
  ['Verification', 'ver'],
  ['Orchestration', 'orc'],
];

export function withCampSpans(text: string): string {
  let result = text;
  for (const [name, klass] of CAMP_NAMES) {
    result = result.replace(name, `<span class="camp-name ${klass}">${name}</span>`);
  }
  return result;
}

export function withCampBold(text: string): string {
  let result = text;
  for (const [name] of CAMP_NAMES) {
    result = result.replace(name, `**${name}**`);
  }
  return result;
}

// Minimal inline-markdown → HTML transform.
//
// Handles only the inline syntax the homepage prose uses:
//   `code`        → <code>code</code>      (contents are HTML-escaped)
//   [text](url)   → <a href="url">text</a>
//   *italic*      → <em>italic</em>
//
// This is not a general-purpose markdown renderer — Astro's MDX integration
// does that for content collections. This is a small helper so the homepage
// prose can live in one place and render correctly on both surfaces without
// pulling in a markdown library for three inline forms.
//
// Two correctness moves worth flagging:
//   1. Contents of `code` spans are HTML-escaped — so `<link rel="alt">`
//      inside backticks renders as literal text, not as an actual <link> tag.
//   2. Code spans are extracted first to sentinel placeholders before the
//      *italic* and [link](url) transforms run, so a `*` or `[` inside
//      backticks doesn't get re-interpreted as markdown emphasis.
export function inlineMarkdownToHtml(text: string): string {
  const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const codeSpans: string[] = [];
  let result = text.replace(/`([^`]+)`/g, (_, code) => {
    const idx = codeSpans.length;
    codeSpans.push(`<code>${escapeHtml(code)}</code>`);
    // Null-byte sentinel — safe because normal prose never contains  .
    return ` CODE${idx} `;
  });

  result = result
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');

  return result.replace(/ CODE(\d+) /g, (_, i) => codeSpans[parseInt(i, 10)]);
}
