---
name: SEMAPRAX
camp: verification
spans_camps: [orchestration]
one_liner: "Graph-native systems language with persistent declaration identities, runtime contracts, explicit capabilities and ownership, revision-bound semantic patches, and native C11 and Core WebAssembly backends."
url: https://wavect.io/semaprax/
repo: wavect/semaprax
paper: null
author: Wavect GmbH
implementation_language: Rust
compilation_target: Native executables via C11; Core WebAssembly and browser packages
license: Apache-2.0
maturity: working_compiler
date_appeared: 2026-08
agent_tooling:
  - AGENTS.md
  - CLAUDE.md
  - compiler-checked agent quick reference
  - stable JSON diagnostics
  - deterministic semantic graph JSON
  - token- and node-budgeted context export
  - semantic query, impact, review, and patch commands
  - MCP workspace adapter
key_idea: |
  Keep readable source as the canonical Git projection while exposing a
  deterministic, versioned semantic graph as the preferred agent interface.
  Persistent IDs separate declaration identity from display names, and
  revision-bound semantic patches fail closed on stale source. Types, effects,
  contracts, ownership, cleanup plans, and call relationships are resolved
  before native and WebAssembly lowering from shared validated HIR.
crossrefs:
  - slug: vera
    name: Vera
    camp: verification
    relation: "Both put contracts and machine-oriented diagnostics in the compiler loop. Vera removes parameter names and asks Z3 to discharge obligations where possible; SEMAPRAX keeps human-readable names, gives public declarations persistent IDs, and currently enforces contracts at run time rather than claiming SMT proof."
  - slug: ailang
    name: AILANG
    camp: verification
    relation: "Both make authority visible and ship bounded agent-facing tooling. AILANG infers row-polymorphic effects and grants broad capability categories per run; SEMAPRAX uses explicit module permits and function-level uses clauses, alongside ownership and cleanup semantics shared by its native and Wasm backends."
  - slug: boruna
    name: Boruna
    camp: orchestration
    relation: "Both treat replay, evidence, and authority boundaries as first-class concerns. Boruna records and replays executed agent workflows in a policy-gated VM; SEMAPRAX binds read-only evidence and semantic source transactions to exact revisions, with evidence deliberately carrying no commit or publication authority."
history:
  - when: "Aug 2026"
    what: "The public repository launches with a Rust compiler, persistent semantic identities, ownership checks, and native and WebAssembly lowering."
  - when: "Sep 2026"
    what: "Public prereleases publish checksummed archives and expand the graph, bounded context, semantic-change, workspace, and host-integration surfaces."
---

## The thesis.

SEMAPRAX treats source text as necessary for review and version control, but insufficient as the primary interface for an agent. Its `.spx` files remain canonical in Git; beside them, the compiler emits a deterministic semantic graph containing resolved types, effects, contracts, ownership, call relationships, expression trees, and cleanup plans. Agents can query a bounded neighbourhood of that graph, address declarations by persistent ID, and propose revision-bound changes without reconstructing the program's meaning from text alone.

<p class="pullquote">Readable source is the projection; checked meaning is the interface.</p>

The persistent identity is the distinctive move. A public declaration carries an `@id` whose value survives a supported display-name change. Semantic tools therefore refer to `math.add`, not to a byte offset or a name that may be rewritten in the same operation. A patch is bound to exact source and graph revisions; stale input, failed replay, or failed validation leaves authoritative source unchanged. The project separates that correctness property from authority: a graph or evidence capsule describes meaning, but does not by itself grant filesystem, build, signing, or publication access.

## What it looks like.

<div class="code-sample">
  <div class="code">
<pre><span class="kw">module</span> examples.meaning;
<!-- -->
<span class="ct">@id</span>(<span class="str">"math.add"</span>)
<span class="kw">fn</span> add(left: <span class="ty">i64</span>, right: <span class="ty">i64</span>) -&gt; <span class="ty">i64</span>
    <span class="ct">requires</span> left &gt;= <span class="num">0</span>
    <span class="ct">requires</span> right &gt;= <span class="num">0</span>
    <span class="ct">ensures</span> result == left + right
{
    left + right
}
<!-- -->
<span class="ct">@id</span>(<span class="str">"app.main"</span>)
<span class="kw">fn</span> main() -&gt; <span class="ty">i64</span>
    <span class="ct">ensures</span> result == <span class="num">42</span>
{
    add(<span class="num">19</span>, <span class="num">23</span>)
}</pre>
  </div>
  <p class="caption"><code>math.add</code> is the declaration's persistent semantic identity; <code>add</code> is its human-facing name. The contracts are part of the checked program and remain active as runtime guards.</p>
</div>

## Distinctive moves.

- **Two projections, one authority.** Canonically formatted `.spx` is the reviewable Git representation. The versioned graph is deterministic machine-readable output, not a second source of truth.
- **Persistent declaration identity.** Public declarations, record fields, and other public items carry stable `@id` values. Query, context, generated bindings, and supported rename operations use those identities rather than display names.
- **Stale-safe semantic changes.** `impact` and `review` are read-only. `patch` and managed-workspace transactions bind to exact source and patch bytes, replay before staging, and fail closed on drift. Successful managed transactions publish one immutable generation through an `ACTIVE` pointer rather than rewriting the original sources.
- **Explicit authority and effects.** Modules declare `permit { ... }`; effectful functions declare `uses { ... }`. The compiler and generated code receive no ambient filesystem, process, network, secret, wallet, signing, or publication authority.
- **Ownership with canonical cleanup meaning.** Ownership failures are compiler diagnostics. Owned calls stage arguments left to right and transfer them at a declared commit boundary; cleanup-plan vectors are canonical runtime order and feed both backends without downstream repair or sorting.
- **Shared checked lowering.** Native C11 and Core WebAssembly lanes start from the same validated HIR and cleanup plans. The project's governing invariant is equivalent checked behaviour on every backend that claims a feature, with executable completion gates rather than documentation status alone.

## Maturity.

The public prerelease is a working Rust compiler and CLI, not a production-ready systems language. It can parse, format, check, run, and test admitted files and multi-file projects; emit semantic graph JSON and bounded context; apply supported semantic patches; and build admitted native, Core WebAssembly, browser, npm, and Rust artefacts. The repository includes a VS Code extension, generated client surfaces, a workspace MCP adapter, cross-platform CI, and a full quality script that ties product claims to executable completion-matrix rows.

The repository lists the limitations explicitly. The language remains pre-alpha and does not claim a general ownership/lifetime system, a package ecosystem, stable public ABIs, a production application toolchain, or complete cross-platform validation. Some host-integration and package routes are narrow developer previews with exact-tag evidence rather than promoted support. Contracts are runtime checks today, not SMT proofs. The semantic protocol surface is also large: the graph and workspace machinery reduce ambiguity for agents, but impose more concepts and versioned schemas than a text-only language, and full graph output can be far larger than source. The compiler's own guidance therefore tells agents to read source when it fits and use `context` or `query` for bounded questions.

## Agent tooling.

The repository ships `AGENTS.md` and `CLAUDE.md`, and every generated project receives its own `AGENTS.md`. A compiler-checked quick reference is available both as documentation and through `semaprax help language`; topic selectors and compiler-verified shape examples let an agent request only the relevant fragment. `check --json` emits stable `SPX-...` codes with locations and repair help. `query` locates declarations and callers, while `context` exports a declaration's typed neighbourhood under explicit byte and node budgets. `graph` emits the complete versioned semantic document when a tool really needs expression trees or cleanup plans.

The mutation loop is similarly structured. `impact` and `review` preview the consequences of supported changes without writing; `patch` applies a revision-bound single-file transaction; managed workspace commands extend the same stale-safe model across files. Generated TypeScript, Python, and Rust clients and the workspace MCP adapter expose selected protocol surfaces without turning context, evidence, or a model response into ambient authority.
