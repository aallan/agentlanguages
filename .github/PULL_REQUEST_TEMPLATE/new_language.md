<!--
Use this template only for "add a new language" PRs.
For corrections to existing entries or other changes, open a regular PR.
-->

## New language submission

### Inclusion checklist

- [ ] The project is designed for **LLMs or agents to author code** (not a tool that uses LLMs at runtime — chatbots, autocomplete plug-ins, code-completion models are out of scope)
- [ ] One Markdown file added at `src/content/languages/<slug>.md` (the filename is the URL slug — lowercase, hyphen-separated, no spaces)
- [ ] Frontmatter validates against the Zod schema in `src/content.config.ts` (the build will fail if it doesn't)
- [ ] One-liner is descriptive and neutral, not promotional
- [ ] No star counts, fork counts, version numbers, or commit counts hardcoded (these are refreshed weekly by GitHub Action)
- [ ] Self-classified camp with justification in the PR body below

### Project summary

- **Name:**
- **URL:**
- **Repo:** (GitHub `owner/name` if applicable, otherwise "n/a")
- **Camp:** syntactic / verification / orchestration / adjacent / unclassified

### Justification

Why does this project meet the inclusion bar? What public evidence (repo activity, paper, agent tooling, design intent) supports the camp classification? Two or three sentences is enough.

### Frontmatter template

```yaml
---
name: Example
camp: verification                 # syntactic | verification | orchestration | adjacent | unclassified
spans_camps: []                    # optional secondary camp(s)
one_liner: "One-sentence neutral description."
url: https://example.org
repo: owner/name                   # GitHub owner/name; null if no public repo
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
crossrefs:                         # optional but worth including; 2-4 is the sweet spot
  - slug: vera                     # must match a filename in src/content/languages/
    name: Vera
    camp: verification
    relation: "What is the same, and where the two part company."
history:                           # optional; include if you can source the dates
  - when: "May 2026"
    what: "What happened, in one sentence."
---
```

`crossrefs` is the catalogue's main editorial device and appears on nearly every entry. See [CONTRIBUTING.md](../../CONTRIBUTING.md#frontmatter-schema) for `benchmark` and the rest.

### Detail page body

Add a Markdown body after the frontmatter: 200+ words with first-hand familiarity, covering the design DNA, how it compares to neighbours in the catalogue, and where it strains under real use. A non-empty body renders a detail page at `/languages/<slug>/`, and every entry in the catalogue has one.

**Code samples and pullquotes go inline in the body as raw HTML, not in frontmatter** — there is no frontmatter field for either, and anything placed there is silently dropped. Copy the `<div class="code-sample">` and `<p class="pullquote">` pattern from an existing entry; [CONTRIBUTING.md](../../CONTRIBUTING.md#detail-pages) documents the token classes and one Markdown parser quirk to avoid.
