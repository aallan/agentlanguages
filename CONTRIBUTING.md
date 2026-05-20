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
2. Add one MDX file under `src/content/languages/<slug>.md` matching the frontmatter schema below.
3. (Optional) Write a substantive body — this triggers a detail page at `/languages/<slug>/`. Card-only is the default and is fine for most entries.
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
---
```

**Camp classification.** Pick the closest fit and explain in the PR if the project spans camps (use `spans_camps:` for secondary camps). Marginal cases are discussed in the PR thread.

**What we never ask for.** Star counts, fork counts, commit counts — these are fetched weekly by a scheduled action and committed to `src/data/stars.json`. Do not hardcode them in the language entry.

## Detail pages

When a language's MDX file has a substantive body, the site renders a detail page at `/languages/<slug>/`. Use this when you can write 200+ words with first-hand familiarity — the design DNA, how the language compares to its neighbours in the catalogue, where it strains under real use. Card-only entries are the default and are not second-class; they exist when nobody has yet written that depth of analysis.

## Tone

Descriptive, not promotional. The catalogue is a reference, not advocacy. One-liners should read as observation, not pitch. The word "elegant" is almost always wrong; "explicit", "verified", "deterministic" are usually right.

## Review

The maintainer reviews each PR for:

- **Fit** — does this actually qualify as a language for AI agents?
- **Accuracy** — does the description match what the project does, verifiable against the repo, paper, or website?
- **Tone** — is the one-liner neutral rather than promotional?

PRs that pass merge. PRs that don't get either change requests or a polite close with an explanation. Marginal cases get discussed openly in the PR thread.

## Code of conduct

Be civil. Disagree on substance. The Three Camps disagree philosophically; we should be able to catalogue that disagreement without it becoming personal.
