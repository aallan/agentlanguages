# agentlanguages.dev

A community-edited catalogue of programming languages designed for AI agents to author code.

The site catalogues an emerging field of language design that treats LLMs and autonomous agents — not humans — as the primary authors of code. As of May 2026, twenty projects qualify, organised around three philosophical camps that disagree about what the underlying problem actually is:

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

Requirements: Node ≥ 22.12 and npm.

```sh
npm install
npm run dev      # local dev server at http://localhost:4321
npm run build    # production build to ./dist/
npm run preview  # preview the production build locally
```

## Star refresh

A GitHub Action runs weekly (Monday 06:00 UTC) and refreshes `src/data/stars.json` from the GitHub API. The site does not make live API calls — stars are baked in at build time, and the footer surfaces the most recent refresh date. If the refresh fails for a given repo, the previous value is kept.

## Credits and licence

Maintained by [Alasdair Allan](https://github.com/aallan). The catalogue grew out of research first published in "Three camps alike in dignity" for Negroni Venture Studios; this site is community-maintained, not a Negroni product.

- Code (Astro components, scripts, configuration): [MIT](LICENSE)
- Content (language entries, prose, analysis): [CC BY 4.0](LICENSE)

See [LICENSE](LICENSE) for full text of both.
