---
name: Vera
camp: verification
spans_camps: [orchestration]
one_liner: "Mandatory contracts on every function. Z3 SMT verification with a runtime-check fallback. Typed slot references replace variable names. LLM inference is a first-class typed effect."
url: https://veralang.dev
repo: aallan/vera
paper: null
author: Alasdair Allan
implementation_language: Python
compilation_target: WebAssembly (core; browser bundle; experimental WASI Preview 2 component, including a wasi:http server world)
license: MIT
maturity: working_compiler
date_appeared: 2026-02
agent_tooling:
  - SKILL.md
  - AGENTS.md
  - CLAUDE.md
  - LLM-oriented diagnostics
  - stable error codes (E001–E702)
  - JSON diagnostic output
  - language server with agent proof-delta methods
  - JSON registry introspection (builtins, effects, errors)
  - llms.txt / llms-full.txt on veralang.dev
key_idea: |
  Mandatory requires/ensures/effects contracts on every function, sorted into
  a three-tier verification scheme and discharged by Z3 where the obligation
  lands in its decidable fragment, or compiled into a runtime check where it
  does not. Typed De Bruijn slot references (@T.n) instead of variable names
  — the grammar has no slot for a parameter name. LLM inference is a
  first-class typed effect. The thesis: the model doesn't need to be right,
  it needs to be checkable.
benchmark:
  label: vera-bench
  url: https://github.com/aallan/vera-bench
crossrefs:
  - slug: aver
    name: Aver
    camp: verification
    relation: "Closest design relative. Both make a verification artefact and an effect declaration mandatory on every function; Vera drops parameter names entirely (<code>@Int.0</code>), Aver keeps them and makes the surrounding metadata mandatory. Aver was the first third-party language integrated into VeraBench, joined by AILANG six weeks later."
  - slug: tacit
    name: Tacit
    camp: syntactic
    relation: "Cross-camp foil on names. Vera's grammar has no slot for a parameter name; Tacit keeps display names as sidecar metadata carrying no semantic weight, uses De Bruijn indices in canonical form, and content-addresses definitions by BLAKE3 hash rather than by name. Both treat names as a source of model error rather than a feature."
  - slug: thermite
    name: Thermite
    camp: verification
    relation: "Same camp, different epistemics. Vera sorts each obligation into a static Z3 proof or a runtime check; Thermite records a per-obligation assurance level alongside the engine that produced it, and takes its project headline as the minimum over functions in scope rather than an aggregate. Different answers to how much a partial proof should be allowed to claim."
  - slug: ailang
    name: AILANG
    camp: verification
    relation: "Capability-based effects with row polymorphism. Where Vera tracks <code>&lt;Inference&gt;</code> as one effect, AILANG carves authority into IO/FS/Net/Clock/AI, granted or refused separately per run at the CLI. AILANG is now the second zero-training-data comparison language in VeraBench."
history:
  - when: "Feb 2026"
    what: "First public release (v0.0.1, 23 Feb). Parser, AST, type checker, Z3 contract verifier and WebAssembly backend all land across v0.0.1&ndash;v0.0.9 on the first day of development."
  - when: "Mar 2026"
    what: "<code>&lt;Inference&gt;</code> ships in v0.0.101 (27 Mar): LLM calls as a typed algebraic effect that a pure function cannot invoke."
  - when: "Apr 2026"
    what: "VeraBench published. Aver joins as the first third-party comparison language (13 Apr); AILANG follows in May."
  - when: "Jun 2026"
    what: "Language server ships (v0.0.163): a warm incremental Z3 session between keystrokes, plus four proof-delta methods addressed at coding agents."
  - when: "Jul 2026"
    what: "v0.1.0 ships with an empty bug tracker after 37 bug-labelled issues close on one branch. The <code>&lt;DB&gt;</code> effect follows in v0.1.7, making SQL injection a compile error; the VS Code extension reaches the Marketplace in v0.1.8. VeraBench grades all 60 problems for the first time."
  - when: "Aug 2026"
    what: "v0.1.9. The project reports 9,382 tests, 196 conformance programs, 164 built-in functions and a 14-chapter draft specification."
---

## The thesis.

Vera takes the verification camp's diagnosis literally. If LLMs make semantic errors faster than humans can catch them by reading code, the compiler has to do the catching. Every function declares preconditions, postconditions and an effect row, and the compiler sorts each resulting obligation into a three-tier scheme: Z3's decidable fragment, Z3 guided by hints, or a compiled runtime check. What can be proved statically is proved before anything runs; what cannot is checked as the program executes.

<p class="pullquote">The model doesn't need to be right. It needs to be checkable.</p>

The distinctive move is replacing variable names with typed slot references. A function `safe_divide(@Int, @Int -> @Int)` has no parameter names — its arguments are referred to as `@Int.0` (most recent) and `@Int.1` (next most recent) using De Bruijn indexing. The grammar has nowhere to put a parameter name at all, which is what separates Vera from the two catalogue entries that reached De Bruijn indices later: Tacit, in April, keeps display names in a sidecar, and LLMLang, in May, lets its parser accept them before resolving to indices.

The project grounds the choice in two papers. Wang et al. ([arXiv:2307.12488](https://arxiv.org/abs/2307.12488)) replaced identifiers in code-analysis tasks and found that good names help a model, but that *shuffled* names — `count` swapped with `result` — hurt it more than gibberish does. Le et al. ([arXiv:2510.03178](https://arxiv.org/abs/2510.03178)) describe identifier leakage, where a model appears to understand code while pattern-matching on familiar tokens. Vera's reading, set out in its FAQ, treats names as a crutch worth removing rather than an aid worth improving.

## What it looks like.

<div class="code-sample">
  <div class="code">
<pre><span class="kw">public</span> <span class="kw">fn</span> safe_divide(<span class="sl">@Int</span>, <span class="sl">@Int</span> -&gt; <span class="sl">@Int</span>)
  <span class="ct">requires</span>(<span class="sl">@Int.1</span> != <span class="num">0</span>)
  <span class="ct">ensures</span>(<span class="sl">@Int.result</span> == <span class="sl">@Int.0</span> / <span class="sl">@Int.1</span>)
  <span class="ct">effects</span>(pure)
{
  <span class="sl">@Int.0</span> / <span class="sl">@Int.1</span>
}</pre>
  </div>
  <p class="caption">A caller that cannot prove the denominator non-zero will not compile: the verifier synthesises the obligation itself and reports <code>E526</code> where it finds a zero. Where the divisor is opaque to the solver, the same obligation degrades to a runtime guard instead. <code>@Int.1</code> is the first parameter (next-most-recent binding); <code>@Int.0</code> is the second (most-recent).</p>
</div>

## Distinctive moves.

- **Mandatory contracts.** Every function carries requires/ensures/effects clauses. There's no opt-out; the grammar rejects functions without them. Nine catalogue entries now enforce something per function, so the live differentiator sits in what discharges the obligations rather than in their being compulsory.
- **De Bruijn slot references.** No variable names at the parameter level. `@T.n` denotes the *n*-th-most-recent binding of type `T`. `vera check --explain-slots` prints the resolution table when the indices stop being obvious.
- **Typed effects, including inference.** LLM calls are an `<Inference>` effect dispatching to Anthropic, OpenAI, Moonshot or Mistral. A function that doesn't declare it can't make model calls, and the effect system tracks model usage up the call graph. Ten effects ship in total, alongside four abilities.
- **Three-tier verification, two tiers shipped.** Tier 1 sends an obligation to Z3's decidable fragment on a ten-second budget; Tier 3 compiles it into a runtime check. Tier 2 — Z3 guided by `assert` and lemma hints — is specified in chapter 6 and not implemented, so contracts needing hints fall through to Tier 3. Obligations also degrade to Tier 3 on a solver timeout, an opaque effect result or a dynamic array length; `vera verify --json` reports the two live buckets, `tier1_verified` and `tier3_runtime`.
- **SQL injection as a compile error.** The `<DB>` effect requires literal provenance for query text: a query assembled from a runtime value is `E207` at check time. The guarantee needs no solver, which is why the project notes it holds inside handled code where solver-based claims cannot reach.
- **LLM-oriented diagnostics.** Every error code is stable (E001–E702); every diagnostic carries a rationale, a fix hint and a spec reference, gated in CI since v0.0.188. The CLI emits JSON for tooling.

## Maturity.

At v0.1.9 (5 August 2026) after 205 tagged releases and roughly 2,400 commits. The project reports 9,382 tests at 95% coverage, 196 conformance programs — which it describes as validating every language feature, across nine of the fourteen spec chapters — 42 examples, 164 built-in functions and a 14-chapter draft specification. The test count reproduces from a `pytest --collect-only` run; the enforced CI coverage floor is 80%, with 95% the project's own measurement. v0.1.0 shipped on 4 July with an empty bug tracker after 37 bug-labelled issues closed on a single branch. The reference compiler is Python; programs compile to WebAssembly and execute under wasmtime, in the browser via a self-contained bundle with mandatory parity tests, or on stock WASI Preview 2 hosts, where `--world server` packages a contract-verified `handle(Request -> Response)` as a `wasi:http` component that unmodified `wasmtime serve` will run.

VeraBench, which the project authors, runs and grades, published a fresh sweep on 28 July 2026: nine model configurations across three providers, all 60 problems graded for the first time. It reports Vera averaging 98.7% solved against Python's 96.7% and TypeScript's 99.7%, with two further zero-training-data languages, Aver and AILANG, as comparison baselines. The project publishes the caveats alongside the numbers: a single run per model and no pass@k, one problem worth 1.7 percentage points so that most gaps are one or two problems wide, an uncontrolled generation trend, and a benchmark it calls saturated, since TypeScript scores 100% for eight of the nine configurations and Vera for six. The framing to hold onto is the project's own — Vera earns close to TypeScript's score "from a single skill file in context", so the comparison sets a specification supplied at evaluation time against languages the models already know. Result files are not checked in, so the figures are not reproducible from the repository.

Current work runs dual-threaded: a verification-completeness sprint closing cases where an obligation goes unemitted or a guard unplanted, and a single-source sprint putting drift-prone facts behind one generator or gate. The most recent merge consolidated slot naming into a single renderer after six subsystems were found disagreeing about type aliases — a naming bug class inside a language that removed names. Open questions include Tier 2, postcondition and refinement facts lost through ADT fields, and production controls for the `<Http>` and `<Inference>` effects. The language server, a VS Code Marketplace extension, Vim and Neovim packages and a PyPI distribution all ship; a Vera package registry does not.

## Agent tooling.

Three documents target agent authors directly: `SKILL.md` (a ~119 KB language reference for agents writing Vera), `AGENTS.md` (setup for any agent system) and `CLAUDE.md` (orientation for Claude Code). veralang.dev carries the machine-readable companions — `llms.txt`, `llms-full.txt` (essentially SKILL.md, ~193 KB), a markdown companion to the landing page, and an `ai-plugin.json` manifest; `AGENTS.md` is linked from the index rather than inlined, and `CLAUDE.md` stays in the repository. Diagnostics emit JSON carrying `description`, `rationale`, `fix`, `spec_ref` and a stable `error_code`, alongside a per-obligation tier tally. `vera builtins`, `vera effects` and `vera errors` expose the compiler's own registries as JSON, so an agent can enumerate the language rather than infer it. The language server adds four methods addressed at agents rather than editors — `vera/speculativeEdit`, `vera/proposeEdit`, `vera/strengthenContract` and `vera/addEffect` — each answering whether an edit keeps, breaks or strengthens the program's proofs.
