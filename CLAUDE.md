# CLAUDE.md — agentlanguages.dev

Project orientation for AI agents working on this repository. If you're a
human contributor, [README.md](README.md) is the front door and
[CONTRIBUTING.md](CONTRIBUTING.md) covers PR mechanics; you may still find
this document useful as a map of how things fit together.

---

## What this repo is

A community-edited catalogue of programming languages designed for AI agents
to *author* code. It is **not** a Vera marketing site (`veralang.dev`) or a
Negroni Venture Studios product. It is a neutral directory that catalogues
Vera alongside ~30 other languages with the same metadata format, organised
around three philosophical camps (Syntactic, Verification, Orchestration)
plus Adjacent and Unclassified.

The taxonomy and editorial frame come from
["Three camps alike in dignity"](https://negroniventurestudios.com/2026/05/20/three-camps-alike-in-dignity/)
(Negroni Venture Studios blog, May 2026). The catalogue is descriptive, not
promotional; it does not rank entries.

Live at [agentlanguages.dev](https://agentlanguages.dev). MIT for code,
CC BY 4.0 for content.

---

## Architecture in one screen

- **Framework:** Astro 6.x, static-output. No JS framework. Vanilla JS only
  for the theme toggle.
- **Content:** A single content collection at `src/content/languages/*.md`,
  schema-validated by Zod in `src/content.config.ts`. Each MDX file is one
  language entry; frontmatter is required, body is optional.
- **Pages:**
  - `src/pages/index.astro` — homepage
  - `src/pages/languages/[slug].astro` — detail pages (only rendered for
    entries with a non-empty body)
  - `src/pages/languages/[slug].md.ts` — markdown companion per entry
  - `src/pages/{index.md,llms,llms-full,robots,sitemap}.ts` — agent-
    accessibility endpoints (see below)
  - `src/pages/.well-known/ai-plugin.json.ts` — agent plugin manifest
- **Styling:** One global stylesheet at `src/styles/global.css`. CSS custom
  properties for tokens; CSS `@media (prefers-color-scheme: dark)` for OS
  dark-mode detection, with `[data-theme]` attribute overrides for the
  user-facing toggle.
- **Shared editorial prose:** `src/data/homepage-copy.ts` exports the
  Three Camps narrative and methodology copy as a single source of truth;
  both the HTML page and the markdown companion import it.
- **Star counts:** Baked in at build time from `src/data/stars.json`,
  refreshed weekly by `.github/workflows/refresh-stars.yml`. **No** live
  GitHub API calls from the site.
- **Deploy:** GitHub Pages, served from the `gh-pages` branch. The
  `.github/workflows/deploy.yml` workflow runs on every push to `main` and
  also via `workflow_run` after the stars refresh completes (so weekly
  refreshes propagate without a separate human-driven deploy).

---

## Agent-accessibility surface

Every editorial surface has a machine-readable companion served on the same
origin. The pattern is modelled on
[veralang.dev/docs](https://github.com/aallan/vera/tree/main/docs) and the
[llmstxt.org](https://llmstxt.org) conventions.

- **`/robots.txt`** — All agents welcome. Points at `/sitemap.xml`.
- **`/llms.txt`** — Short index following the llmstxt.org spec. Grouped by
  camp; each entry has its one-liner and a link to its `.md` companion.
- **`/llms-full.txt`** — Every entry concatenated into one file (~150 KB).
  An agent that wants the entire catalogue can fetch it in one round-trip
  rather than once per entry.
- **`/index.md`** — Markdown companion to the homepage (Three Camps
  narrative + catalogue index + methodology).
- **`/languages/<slug>.md`** — Markdown companion for every detail page.
- **`/sitemap.xml`** — Hand-rolled (in `src/pages/sitemap.xml.ts`) because
  `@astrojs/sitemap` ignored non-HTML routes and would have hidden every
  markdown surface from crawlers.
- **`/.well-known/ai-plugin.json`** — Agent-plugin manifest with a dynamic
  count of catalogued projects in `description_for_model`.

Every HTML page advertises its companion via `<link rel="alternate"
type="text/markdown">`, and the homepage's methodology section has a
visible "For machines" column pointing at the same surfaces. Detail pages
expose the alternate in their `metaprops` block ("markdown: vera.md").

---

## Editorial conventions

Get these right and the maintainer's review pass is much faster.

- **British English in prose.** "Licence" (noun), "licensed" (verb),
  "catalogue", "organisation", "behaviour", "favour", "specialised". The
  Zod schema's field is named `license` (US) — that's a schema name, not
  prose, leave it alone.
- **No sentences ending in "is".** Reword: "what the problem is" →
  "how to frame the problem" / "the shape of the problem itself" /
  "what the problem amounts to." The pattern shows up surprisingly often;
  catch it on re-read.
- **"Distinctive move" not "provocative move."** Sitewide convention. The
  word "provocative" is reserved for the rare case where a project is
  taking a deliberately contrarian stance (Prove's anti-AI-training licence
  is the canonical example).
- **Descriptive, not promotional.** Verbs that locate authority in the
  project: "ships", "claims", "reports", "publishes", "states". Avoid:
  "elegant", "powerful", "next-generation", "best", "of course",
  "obviously", "simply", "just" (as in "just runs workflows"). The reader
  should not be able to tell whether the cataloguer likes the project.
- **No ranking.** The catalogue does not rate entries against each other.
  It compares (via `crossrefs`) and contrasts; it does not score.
- **Camp neutrality.** The Three Camps disagree philosophically; the
  catalogue describes the disagreement without taking sides.

---

## Camp colour palette

Camp coding ties content architecture to visual identity: 4px left border
on every card, badge text, section accents in the Three Camps narrative,
inline `<span class="camp-name">` styling in the camps-intro paragraph.

| Camp | Light | Dark |
|------|-------|------|
| Syntactic | `#3E5C76` slate blue | `#6188B8` |
| Verification | `#A1623B` burnt amber | `#C28055` |
| Orchestration | `#5A7A53` moss green | `#88AE7E` |
| Adjacent | `#707070` gray | `#909090` |
| Unclassified | `#B0B0B0` | `#606060` |

Tokens live in `src/styles/global.css`. The `--camp` custom property is
set per page on detail pages via inline style on `<body>`.

---

## Typography stack

Preserved from veralang.dev for visual lineage.

```css
--serif: 'DM Serif Display', Georgia, serif;
--sans:  'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--mono:  'JetBrains Mono', 'SF Mono', monospace;
```

---

## Workflows

### Adding a new language entry

1. Add `src/content/languages/<slug>.md` matching the schema in
   `src/content.config.ts`. Frontmatter is required; body is optional.
2. (Optional) Write a substantive body to produce a detail page. See
   `DETAIL_PAGE_BRIEF.md` for the working spec (gitignored — it's an
   internal brief, not committed user-facing documentation).
3. Open a PR. Merging to `main` triggers the deploy workflow.
4. Star counts populate on the next Monday cron, or trigger immediately
   via `gh workflow run "Refresh star counts"`.

### Refreshing stars manually

```sh
./scripts/setup.sh   # creates .venv/, installs scripts/requirements.txt
GITHUB_TOKEN=$(gh auth token) .venv/bin/python scripts/refresh_stars.py
```

Then commit `src/data/stars.json`. The push triggers a deploy. Homebrew
Python on macOS refuses system-level installs (PEP 668), hence the venv.
See `scripts/setup.sh` for details.

### Editorial reword

Most editorial copy is dynamic. A change to a language MDX cascades to
HTML detail page, markdown companion, llms.txt entry, llms-full.txt block,
homepage card, and sitemap automatically on the next build.

The Three Camps narrative and methodology copy live in
`src/data/homepage-copy.ts`. Edit there; both the HTML page and the
markdown companion pick it up. Per-page surface-specific framing (the
hero copy, the agent-accessible-resources block) lives directly in
`index.astro` and `index.md.ts` respectively — these are deliberately
not shared, because the two surfaces want different framing in those
spots.

### Counts in user-facing surfaces

Every count of "languages tracked" on the live site is derived from
`languages.length` at build time. The only hardcoded count is in
`README.md`, which is rendered by GitHub before the build runs — there
we keep the wording count-free rather than try to inject a number.

---

## Gotchas

Things that have bitten us and are worth flagging up front so the next
person doesn't repeat them.

### "Pages built" ≠ "languages tracked"

Astro's build output reports `X page(s) built`. That's the count of
*HTML routes*, which equals `languages.length + 1` (the `+1` is the
homepage). Endpoint routes — `llms.txt`, `llms-full.txt`, `sitemap.xml`,
`robots.txt`, per-entry `<slug>.md` companions, `ai-plugin.json`,
redirects — are *not* counted in that line, even though they're emitted
by the same build.

The number users see on the live site (e.g. "30 languages tracked" in
the hero, "30 projects" in the lead / `llms.txt` / `llms-full.txt` /
`ai-plugin.json`) comes from `languages.length` directly. It's always
one less than the Astro page count.

When reporting catalogue size in conversation, quote the site's number
(`languages.length`), not the build's `X page(s) built` line. The right
way to verify from the command line is:

```sh
curl -sS https://agentlanguages.dev/ | grep -oE '[0-9]+ languages tracked'
```

This bypasses any browser cache and reads straight from the deployed
HTML.

### Posting a welcome notice — wait for the deploy first

When a new catalogue entry is added and the workflow includes posting a
GitHub-issue notice on the project's own repo, the notice body links to
the entry's detail page (e.g. `https://agentlanguages.dev/languages/<slug>/`).
That URL only exists after the deploy workflow completes — typically ~90
seconds after the push.

Posting the notice before the deploy finishes means recipients clicking
the link immediately get a 404. Self-correcting (the page is live within
a minute or two) but a broken first impression on the issue thread.

The discipline:

1. Push the catalogue entry commit.
2. Wait for `deploy.yml` to complete: `gh run list --workflow=deploy.yml --limit 1 --json status,conclusion --jq '.[0] | "\(.status)/\(.conclusion // "—")"'` until it reads `completed/success`.
3. Verify the URL is live: `curl -sS -o /dev/null -w "%{http_code}\n" https://agentlanguages.dev/languages/<slug>/` should return `200`.
4. Then post the notice.

The same applies whenever a notice body links to a freshly-deployed
surface — not just per-entry detail pages, but also any new markdown
companions, llms.txt entries, or anything else that propagates through
the build pipeline rather than being live on push.

---

## Local development

See [README.md](README.md) for the npm commands. tl;dr:

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # ./dist/
npm run preview  # serves the built site
```

---

## Build pipeline

- **`deploy.yml`** triggers on `push` to `main` AND on `workflow_run`
  after `refresh-stars.yml` completes. The `workflow_run` cascade is
  necessary because commits made by `GITHUB_TOKEN` don't fire `push`
  triggers (GitHub's anti-recursion guard); without it, the weekly
  stars refresh would land but never deploy.
- **`refresh-stars.yml`** runs Mondays 06:00 UTC, or on
  `workflow_dispatch`. Reads `repo:` fields from MDX frontmatter, calls
  the GitHub REST API, writes `src/data/stars.json`. Commits the file
  as `github-actions[bot]` only if it changed.
- Both workflows opt into Node 24 via `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24`
  ahead of GitHub's deprecation timeline for Node 20.

---

## What's currently catalogued

A live list is at `/llms.txt`; this section is illustrative of the
balance across camps. As of the last refresh, the catalogue tracks
projects across Syntactic (largest), Verification (largest and most
mature implementations), Orchestration (smallest but most diverse),
Adjacent (single-entry — Plumbing) and Unclassified (two entries with
limited public evidence). Vera, MoonBit, and Boruna anchor each camp's
detail-page treatment.

---

## What this repo is NOT

- Not a Vera marketing site (that's veralang.dev).
- Not a Negroni Venture Studios product. Negroni is credited as the
  originator of the taxonomy; the catalogue is community-maintained.
- Not a benchmark suite (VeraBench is separate, linked from Vera's
  detail page).
- Not opinionated about which camp is right. The Three Camps frame
  describes a real disagreement; the catalogue is its neutral evidence.

---

## Reference

- Genesis essay: ["Three camps alike in dignity"](https://negroniventurestudios.com/2026/05/20/three-camps-alike-in-dignity/)
- Visual lineage: [veralang.dev](https://veralang.dev) (typography,
  three-band brand, machine-readable surface pattern)
- VeraBench: [github.com/aallan/vera-bench](https://github.com/aallan/vera-bench)
- Open work items: see GitHub Issues on this repo.

---

## Maintainer

Alasdair Allan · `alasdair@babilim.co.uk` · GitHub: [aallan](https://github.com/aallan)

When creating commits via an AI assistant, attribute with:

    Co-Authored-By: Claude <noreply@anthropic.invalid>
