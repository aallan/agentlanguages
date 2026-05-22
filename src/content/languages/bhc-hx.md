---
name: BHC/hx
camp: verification
spans_camps: []
one_liner: "Not a new language. The bet is that Haskell's purity and semantic density already make AI-written, verifiable compute feel natural — once toolchain friction is removed. hx wraps cabal/stack/ghcup/HLS in Rust; BHC is a clean-slate Haskell 2026 compiler with per-profile runtimes."
url: https://raskell.io
repo: arcanist-sh/hx
paper: null
author: Raffael Schneider
implementation_language: Rust
compilation_target: GHC/Cabal/HLS (hx, wrapping); LLVM, WebAssembly, GPU (BHC, in development)
license: MIT (hx); BSD-3-Clause (BHC)
maturity: early_implementation
date_appeared: 2026-04
agent_tooling: []
key_idea: |
  BHC and hx are a single editorial position more than two projects.
  Schneider argues, across a public trilogy on his blog raskell.io, that
  Haskell's types-as-proofs and pure-by-default already give LLMs the
  formal scaffolding they need; the reason Haskell loses to procedural
  languages in agent benchmarks is the surrounding toolchain — fragmented
  build tools, slow compiles, one-size-fits-all runtime. The work under
  the arcanist.sh organisation is the engineering response: hx (a Rust
  binary wrapping GHC, Cabal, GHCup, and HLS behind one interface) and
  BHC (an in-development Haskell 2026 compiler with multiple runtime
  profiles).
crossrefs:
  - slug: ailang
    name: AILANG
    camp: verification
    relation: "Closest design relative. Both bet on purely functional, effect-typed code as the right shape for agents to author. AILANG designed a new language; BHC/hx argues the language is already fine and rebuilds the tooling around Haskell."
  - slug: moonbit
    name: MoonBit
    camp: verification
    relation: "Industrial-backing foil. MoonBit pairs a sampler-level verification story with three years of training data and a Shenzhen-funded team; BHC/hx is a one-person Swiss effort betting that better tooling around an established language beats a new language with a new ecosystem."
  - slug: vera
    name: Vera
    camp: verification
    relation: "Adjacent rather than competing. Vera is the bespoke agent-native route; BHC/hx bets that Haskell's purity and semantic density make AI-written, verifiable compute feel natural once toolchain friction is removed. Schneider's essays cite Vera by name as the canonical example of the language-design route, and frame BHC/hx as a complementary route through tooling."
---

## The thesis.

The thesis is that the verification camp has the right diagnosis but the wrong locus of intervention. In Schneider's public writing, declarative languages with strong type systems already play to what LLMs are good at: generating expressions that satisfy formal constraints, rather than simulating execution across many mutable steps. Type-checked Haskell looks like a proof; the compiler is the proof checker; once the types align, large classes of error are eliminated by construction. The reason this is not the dominant agent-coding stack today, Schneider argues, is friction outside the language &mdash; three overlapping build tools, slow cold builds, a runtime that assumes one performance profile fits every use case.

<p class="pullquote">The language was right. The surrounding infrastructure was not.</p>

The distinctive move is the refusal to design a new language at all. Where AILANG, Vera, and Aver each ship a fresh syntax with effect typing built in, BHC and hx extend Haskell. The engineering lives under the arcanist-sh GitHub organisation: hx, a Rust binary that wraps GHC, Cabal, GHCup, and HLS behind one interface; and BHC, an in-development clean-slate compiler targeting the Haskell 2026 specification with profile-specific runtimes selected at compile time. The bet is that the typed substrate is already correct and the missing layer is operational, not linguistic.

## Distinctive moves.

- **The position, stated.** A trilogy on the author's blog at raskell.io (&ldquo;The Last Programming Language Might Not Be for Humans&rdquo;, &ldquo;What Comes After the Last Programming Language&rdquo;, &ldquo;Source Code Is the New Assembly&rdquo;) makes the case that the medium-term winner is declarative-plus-typed, not procedural-plus-checked.
- **hx wraps before it replaces.** Cargo-workspace Rust binary built from ~14 crates (`hx-cli`, `hx-core`, `hx-toolchain`, `hx-cabal`, `hx-solver`, `hx-lsp`, `hx-plugins`, …); commands cover `build`, `run`, `test`, `lock`, `sync`, `watch`, `fmt`, `lint`, `docs`, `publish`; lockfile is `hx.lock`. The repo describes the strategy as wrap GHC/Cabal/GHCup/HLS first, replace last.
- **BHC targets multiple runtime profiles.** The BHC repository README lists four profiles today &mdash; default, server, numeric, edge &mdash; selected at compile time. Schneider's essays and the arcanist-sh organisation profile describe a planned six (adding `realtime` and `embedded`); the catalogue treats the four shipped in the repo as ground truth and the additional two as stated intent.
- **Conservative scope per release.** Both projects are pre-1.0. The arcanist-sh org profile advertises a 5.6× cold-build speedup over Cabal, but no methodology, benchmark suite, GHC/Cabal versions, or hardware are published anywhere reachable; treat the number as a stated marketing claim, not a verified measurement.
- **No agent-specific surface yet.** No SKILL.md, AGENTS.md, MCP server, or `llms.txt` in either repo. The argument is that a well-typed Haskell program already gives an agent what it needs; tooling for agents is downstream.

## Maturity.

Early. hx is MIT-licensed Rust, at v0.6.0 (Feb 2026), with 12 tagged releases, 129 commits, and 23 stars; it currently orchestrates GHC/Cabal/GHCup/HLS rather than replacing them. BHC is BSD-3-Clause, at v0.2.1 (Jan 2026), with 389 commits, 3 releases, 11 stars, and a single contributor. The roadmap in the BHC README marks the parser, type checker, Core IR, and one codegen path as substantially complete and WASM/GPU lowerings as in progress; no conformance suite or benchmark numbers ship in the repository today. The bet is on a multi-year arc, and the public surface reflects that &mdash; essays and infrastructure now, language-level claims later.

## Agent tooling.

None shipped at present. The position Schneider defends is that the right intervention is upstream of agent-specific files: a faster, more coherent build, a compiler whose error messages and runtime profile match the deployment target, and a type system the agent can already use as a proof obligation. Whether that bet pays off depends on whether the medium-term arc Schneider describes &mdash; declarative-plus-typed beats procedural-plus-checked once the tooling friction is gone &mdash; actually materialises before agent-native languages with built-in MCP surfaces lock in a different shape.
