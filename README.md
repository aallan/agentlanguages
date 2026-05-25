# agentlanguages.dev

![agentlanguages.dev — programming languages designed for AI agents to write](https://agentlanguages.dev/og-image.png)

A community-edited catalogue of programming languages designed for AI agents to author code, the site is live at [agentlanguages.dev](https://agentlanguages.dev).

The site catalogues an emerging field of language design that treats LLMs and autonomous agents — not humans — as the primary authors of code. As of May 2026, the catalogue tracks projects across three philosophical camps that disagree on how to frame the underlying problem:

- **Syntactic** — Strip ambiguity at the token level. Make syntax easier for LLMs to parse and generate.
- **Verification** — Make contracts mechanically checkable. The model doesn't need to be right; it needs to be checkable.
- **Orchestration** — Reframe the problem as agent coordination, not language design. Constrain how agents are composed rather than the code they produce.

Plus an *Adjacent* category for infrastructure that supports the field but isn't itself a language agents write (currently: Plumbing), and *Unclassified* for projects with insufficient public information to place.

The taxonomy originates in ["Three camps alike in dignity"](https://negroniventurestudios.com/2026/05/20/three-camps-alike-in-dignity/) (Negroni Venture Studios, May 2026). This site is a community resource for tracking the field as it evolves — not a Negroni product.

## Contributing

The catalogue accepts pull requests for new languages, corrections, and substantive analysis. See [CONTRIBUTING.md](CONTRIBUTING.md) for the submission criteria, frontmatter schema, and review process.

The bar for inclusion: the project must be designed for LLMs/agents to *author* code — through token-friendly syntax, mechanically checkable contracts, agent-coordination primitives, first-class effect declarations for model calls, or similar. Tools that *use* LLMs at runtime (chatbots, autocomplete, code-completion plugins) are out of scope.

PRs are reviewed editorially by the maintainer. Not every submission is merged, but every submission gets a response.

## Local development

### Site (Astro)

Requirements: Node ≥ 22.12 and npm.

```sh
npm install
npm run dev      # local dev server at http://localhost:4321
npm run build    # production build to ./dist/
npm run preview  # preview the production build locally
```

### Star refresh (Python)

A GitHub Action runs weekly (Monday 06:00 UTC) and refreshes `src/data/stars.json` from the GitHub API. The site does not make live API calls — stars are baked in at build time, and the footer surfaces the most recent refresh date. If the refresh fails for a given repo, the previous value is kept.

To refresh manually (e.g. after adding a new language entry and not wanting to wait until Monday):

```sh
./scripts/setup.sh                                                       # creates .venv/, installs scripts/requirements.txt
GITHUB_TOKEN=$(gh auth token) .venv/bin/python scripts/refresh_stars.py  # writes src/data/stars.json
```

Then commit `src/data/stars.json`. Homebrew Python on macOS refuses system-level pip installs (PEP 668), so the script's `pyyaml` dependency lives in a project-local `.venv/` that `scripts/setup.sh` creates (and `.gitignore` ignores). The setup script is idempotent — safe to re-run.

`GITHUB_TOKEN` is optional; without it the script falls back to unauthenticated requests with a 60/hour rate limit, fine for the catalogue's size but easy to exhaust on repeated runs.

## Credits and licence

Maintained by [Alasdair Allan](https://github.com/aallan). The catalogue grew out of research first published in "Three camps alike in dignity" for Negroni Venture Studios; this site is community-maintained, not a Negroni product.

- Code (Astro components, scripts, configuration): [MIT](LICENSE)
- Content (language entries, prose, analysis): [CC BY 4.0](LICENSE)

See [LICENSE](LICENSE) for full text of both.
