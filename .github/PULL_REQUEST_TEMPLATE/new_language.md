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
---
```

### Optional detail page

If you can write 200+ words with first-hand familiarity (the design DNA, how it compares to neighbours in the catalogue, where it strains under real use), add a Markdown body after the frontmatter. A non-empty body triggers a detail page at `/languages/<slug>/`. Card-only is the default and is fine for most submissions.
