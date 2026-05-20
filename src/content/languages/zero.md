---
name: Zero
camp: verification
spans_camps:
  - syntactic
one_liner: "Vercel Labs' agent-first systems language. Sub-10 KiB native binaries. Structured JSON diagnostics with stable codes and typed repair plans. One obvious path."
url: https://zerolang.ai
repo: vercel-labs/zerolang
paper: null
author: Chris Tate and Matt Van Horn / Vercel Labs
implementation_language: C (zero-c bootstrap); self-hosted compiler-zero in progress
compilation_target: Native binaries (direct ELF/Mach-O/PE emitters, no LLVM), WebAssembly
license: Apache-2.0
maturity: early_implementation
date_appeared: 2026-05
agent_tooling:
  - structured JSON diagnostics
  - stable error codes
  - typed repair plans
  - zero skills (version-matched agent guidance)
  - zero explain
  - zero fix --plan --json
  - zero doctor
key_idea: |
  Zero is Vercel Labs' bet on agent-first systems programming. The compiler
  emits structured JSON diagnostics with stable error codes (NAM003 means
  "unknown identifier" and will keep meaning that), typed repair plans an
  agent can apply without parsing prose, and version-matched guidance served
  through the CLI itself rather than scraped from a docs site. The language
  is intentionally explicit: capability objects on main, no hidden allocator,
  no implicit async, one obvious path for most things.
crossrefs:
  - slug: moonbit
    name: MoonBit
    camp: verification
    relation: "Industrial backing parallel. Vercel Labs and IDEA Shenzhen are the two best-resourced bets in the catalogue; MoonBit invests in semantic-aware sampling, Zero invests in structured compiler output and version-matched skills."
  - slug: nerd
    name: NERD
    camp: syntactic
    relation: "Cross-camp foil. Both lean on a small keyword vocabulary and 'one obvious way' framing; NERD does it for syntactic legibility, Zero does it inside a verification project with capability-typed effects and a typed repair API."
  - slug: boruna
    name: Boruna
    camp: orchestration
    relation: "Structured-diagnostics parallel. Zero ships JSON diagnostics with typed repair IDs at the language level; Boruna ships hash-chained evidence bundles at the runtime level. Both reject prose as an interface for agents."
---

## The thesis.

Zero is Vercel Labs' bet that the bottleneck in agentic coding is not the language but the channel between the compiler and the agent. The standard loop is fragile: the compiler emits prose written for human engineers, the agent parses it as text, the agent guesses at a fix, the next compile produces a new prose error in a slightly different format. Zero's answer is to replace the prose channel with a structured one. `zero check --json` emits a stable error code (`NAM003`), a human-readable message, a line number, and a typed `repair` object an agent can act on. `zero fix --plan --json` returns a machine-readable edit plan. `zero explain` returns structured explanations against the installed compiler version.

<p class="pullquote">Humans read the message. Agents read the JSON.</p>

The distinctive move sits at the language level, not the toolchain level: Zero collapses the syntactic and verification camps into a single product decision. The language documents itself as preferring "one obvious way to express most things, even when that makes code more explicit than a human might choose," which is syntactic-camp framing; but the obviousness is bought with capability objects on `main`, explicit `raises` markers, and effect-visible signatures, which is verification-camp machinery. Where MoonBit, the catalogue's other industrially backed verification entry, invests in semantic-aware token sampling, Zero invests in making the surface area small enough that an agent doesn't need help generating it in the first place.

## What it looks like.

<div class="code-sample">
  <div class="code">
<pre><span class="kw">pub</span> <span class="kw">fun</span> <span class="ty">main</span>(world: <span class="ty">World</span>) <span class="op">-&gt;</span> <span class="ty">Void</span> <span class="kw">raises</span> {
  <span class="kw">check</span> world.out.write(<span class="str">"hello from zero\n"</span>)
}</pre>
  </div>
  <p class="caption">There is no hidden global process object. <code>world: World</code> is an explicit capability passed in by the runtime; <code>raises</code> declares the function can propagate errors; <code>check</code> handles a fallible operation. A function that doesn't ask for <code>World</code> cannot write to stdout.</p>
</div>

## Distinctive moves.

- **Stable diagnostic codes.** Errors carry codes (`NAM003` for unknown identifier) that are contractually stable across compiler versions. Agents can match on the code, not the prose.
- **Typed repair plans.** `zero fix --plan --json` returns a structured edit plan, not advice. The agent applies the plan rather than inferring it from the message.
- **Version-matched skills.** `zero skills get zero --full` returns syntax, diagnostics, build, package, stdlib, testing, and edit-loop guidance pinned to the installed compiler version. The guidance lives in the toolchain, not on a webpage that may have drifted.
- **No LLVM, sub-10 KiB binaries.** Direct emitters for ELF, Mach-O, PE, and WebAssembly. The size budget is a load-bearing design constraint, not a marketing claim.
- **One CLI surface.** `zero check`, `zero run`, `zero build`, `zero graph`, `zero size`, `zero routes`, `zero skills`, `zero explain`, `zero fix`, `zero doctor` &mdash; all subcommands of a single binary that all support `--json`.

## Maturity.

v0.1.1, Apache-2.0, released 15 May 2026, 3.3k stars on `vercel-labs/zerolang` at first cataloguing. The README and homepage are explicit that this is a "pre-1 experiment": syntax and APIs are not a contract, breaking changes are expected, and security vulnerabilities should be expected &mdash; Vercel Labs recommends running Zero only in isolated environments. The repo maintains two compilers: `zero-c`, the C bootstrap; and `compiler-zero`, a self-hosting compiler written in Zero. Cross-compilation is limited to a documented target subset; there is no package registry yet; VS Code syntax highlighting ships in-repo. Named contributors are Chris Tate and Matt Van Horn.

The bet is that structured agent-first compiler output becomes table stakes once developers see what it does for repair loops. Even if Zero itself doesn't win, the design pattern &mdash; stable codes, typed repairs, version-matched skills &mdash; is a concrete argument for what every other compiler should ship.

## Agent tooling.

The toolchain *is* the agent tooling. `zero check --json` returns diagnostics; `zero explain <code>` returns explanations; `zero fix --plan --json` returns edit plans; `zero skills get zero --full` returns version-matched workflows. `zero graph --json`, `zero size --json`, `zero routes --json`, and `zero doctor --json` round out the inspection surface. Vercel's separately released `skills.sh` ecosystem is consumable by Claude Code, Cursor, Codex, and other agent harnesses through the same Agent Skills spec that `zero skills` follows.
