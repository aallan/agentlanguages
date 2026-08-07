# Contributing

Thank you for proposing a language for the catalogue. PRs are reviewed editorially by the maintainer — not every submission is merged, but every submission gets a response.

## Inclusion criteria

A project qualifies if it is **designed for LLMs/agents to author code**. Concrete signals of fit include:

- **Token-friendly syntax** — operator words, explicit ownership transitions, single-character density, JSON-as-AST.
- **Mechanically checkable contracts** — refinement types, requires/ensures clauses, SMT verification, theorem-prover export.
- **Agent-coordination primitives** — capability-gated effects, deterministic replay, approval gates, hash-chained evidence bundles.
- **First-class effect declarations for model calls** — typed `Inference`/`AI` effects, structured prompt boundaries.
- **Agent-facing tooling shipped with the compiler** — SKILL.md, AGENTS.md, CLAUDE.md, structured-JSON diagnostics, MCP servers, token-budgeted context export.

A tool that *uses* an LLM at runtime — a chatbot, an autocomplete plugin, a code-completion model — is **out of scope**, even when the project is impressive on its own terms. The catalogue is about language design that treats agents as authors, not products that embed agents.

Academic papers without a downloadable implementation are accepted if the paper proposes a *language* (rather than reporting empirically on an existing one).

## How to submit

1. Fork the repository.
2. Add one Markdown file under `src/content/languages/<slug>.md` matching the frontmatter schema below. The filename is the URL slug: lowercase, hyphen-separated, no spaces.
3. Write a body. A non-empty body renders a detail page at `/languages/<slug>/`, and in practice every entry in the catalogue has one — see [Detail pages](#detail-pages) for what goes in it.
4. Open a pull request using the new-language template.

## Frontmatter schema

```yaml
---
name: Example
camp: verification                 # syntactic | verification | orchestration | adjacent | unclassified
spans_camps: []                    # optional secondary camp(s)
one_liner: "One-sentence neutral description."
url: https://example.org
repo: owner/name                   # GitHub owner/name; null if not on GitHub
paper: null                        # arXiv URL for paper-only entries
author: Author Name
implementation_language: Rust
compilation_target: WebAssembly
license: MIT
maturity: working_compiler         # thought_experiment | research_paper | early_implementation | working_compiler | production_ready
date_appeared: 2026-05             # YYYY-MM
agent_tooling: [SKILL.md, AGENTS.md]
key_idea: |
  Two to four sentences explaining the central design move.
  Focus on what is distinctive, not what is shared with the camp.

# Optional, and worth including. See "Optional fields" below.
crossrefs:
  - slug: vera                     # must match an existing filename in src/content/languages/
    name: Vera
    camp: verification
    relation: "One or two sentences on what is the same and what differs."
history:
  - when: "May 2026"
    what: "What happened, in one sentence."
benchmark:
  label: "name of the suite"
  url: https://github.com/owner/bench
---
```

**Camp classification.** Pick the closest fit and explain in the PR if the project spans camps (use `spans_camps:` for secondary camps). Marginal cases are discussed in the PR thread, and the maintainer makes the final call — several entries have been merged with a different secondary camp from the one submitted, with the reasoning given in the thread.

**Optional fields.**

- **`crossrefs`** is the one to bother with. Nearly every entry carries it, and it is the catalogue's main editorial device: two to four comparisons that say what this language shares with a neighbour and where the two part company. They render as the "design DNA" block on the detail page. Write them contrastively (`"Same diagnosis, different lever. X does A; this does B."`) rather than as a list of related projects, and check the `slug` against the filenames in `src/content/languages/`.
- **`history`** is a dated timeline. Include it if you can source the dates; a minority of entries do.
- **`benchmark`** is a single label and URL for a companion benchmark suite. Only include it if the project publishes numbers.

**What we never ask for.** Star counts, fork counts, commit counts — these are fetched weekly by a scheduled action and committed to `src/data/stars.json`. Do not hardcode them in the language entry.

## Detail pages

A non-empty body renders a detail page at `/languages/<slug>/`. Every entry in the catalogue currently has one, so treat a body as expected rather than optional: 200 or more words with first-hand familiarity, covering the design DNA, how the language compares to its neighbours here, and where it strains under real use. Most entries use these section headings, in this order: `## The thesis.` (or `## What it is.`), `## What it looks like.`, `## Distinctive moves.`, `## Maturity.`, `## Agent tooling.`

**Code samples and pullquotes go inline in the body, as raw HTML.** There is no frontmatter field for either, and the detail-page template renders only body content — a sample placed in frontmatter is silently dropped. Copy the pattern from an existing entry (`vera.md` and `codong.md` are good models):

```html
<p class="pullquote">A single sentence the project is willing to defend.</p>

<div class="code-sample">
  <div class="code">
<pre><span class="kw">keyword</span> name(<span class="ty">Type</span>) {
    <span class="ct">contract</span>(x)
}</pre>
  </div>
  <p class="caption">One or two sentences on what the snippet demonstrates.</p>
</div>
```

Token classes are `kw` (keyword), `ty` (type), `ct` (contract or attribute), `str` (string), `num` (number), `op` (operator), `sl` (slot or interpolation), `cm` (comment). Escape `<`, `>` and `&` as `&lt;`, `&gt;` and `&amp;` inside the `<pre>`.

One parser quirk to avoid: **do not leave a blank line inside the `<pre>`** if the following line is indented four or more spaces. A blank line closes the surrounding HTML block, and Markdown then treats the indented remainder as a code block and escapes your `<span>` tags, so half the sample renders as visible tag text. Use a comment line in the language's own syntax for visual grouping instead.

## Tone

Descriptive, not promotional. The catalogue is a reference, not advocacy. One-liners should read as observation, not pitch. The word "elegant" is almost always wrong; "explicit", "verified", "deterministic" are usually right.

## Review

The maintainer reviews each PR for:

- **Fit** — does this actually qualify as a language for AI agents?
- **Accuracy** — does the description match what the project does, verifiable against the repo, paper, or website?
- **Tone** — is the one-liner neutral rather than promotional?

Accuracy review means the claims in a submission get checked against the source, not taken on trust. This applies equally to entries written by the maintainer. It is not adversarial, and it cuts both ways: past reviews have corrected a figure a submitter had overstated, and also corrected one a submitter had understated to their own project's disadvantage.

**Expect an editorial pass.** Most merged submissions get a commit from the maintainer either before or shortly after merge. Typical edits: adding or changing `spans_camps`, attributing project-measured benchmark numbers to the project rather than stating them flat, British-English and house-style corrections, and scoping a claim to what the code supports. The substance stays yours — thesis, structure, voice, crossref choices — and every edit is explained in the PR thread. If a pass reads wrong, say so and it gets revisited.

PRs that pass merge. PRs that don't get either change requests or a polite close with an explanation. Marginal cases get discussed openly in the PR thread.

## Licence for contributions

Content in this repository, which includes language entries, is licensed [CC BY 4.0](LICENSE); code is [MIT](LICENSE). By opening a pull request you agree to your contribution being published under those terms. You keep the copyright in what you write.

## Code of conduct

Be civil. Disagree on substance. The Three Camps disagree philosophically; we should be able to catalogue that disagreement without it becoming personal.
