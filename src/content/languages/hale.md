---
name: Hale
camp: verification
spans_camps: [syntactic]
one_liner: "Concurrent systems language where architecture is mechanically checked: compile-time effect certificates and reachability claims that fail closed on unresolvable indirection. Human-and-LLM authorship is one of four stated design pillars."
url: https://hale-lang.org
repo: hale-lang/hale
paper: null
author: Riley Rook
implementation_language: Rust
compilation_target: "Native via LLVM; WebAssembly"
license: Apache-2.0
maturity: working_compiler
date_appeared: 2026-05
agent_tooling:
  - AGENTS.md
  - "MCP server shipped inside the compiler binary (check, build, test, bus graph, placement, spec search)"
  - "LSP with contract-surfacing hover"
  - "machine-readable topology artifact with countermodel witnesses (--dump-topology)"
key_idea: |
  One primitive — the locus — replaces class, module, actor, and service;
  loci communicate over a typed topic bus, and the same source runs as a
  test, a single binary, or a mesh of binaries by editing only the main
  locus. Contracts scale from per-function effect certificates
  (@no_syscall, @effects(only:)) to program-wide claims (forbid
  reaches(A, B)) checked at compile time, with unknown call targets
  treated as violations and minimal countermodel witnesses on failure.
  The case for LLM authorship is subtractive: no async coloring, no
  lifetimes, no lock selection — the shapes models tend to hallucinate
  aren't in the language.
benchmark:
  label: "hale bench (vs Go, Node, Python)"
  url: https://github.com/hale-lang/bench
crossrefs:
  - slug: vera
    name: Vera
    camp: verification
    relation: "Same camp, different altitude of contract. Vera discharges per-function requires/ensures with an SMT solver; Hale checks whole-program sentences — reachability, publisher counts, allocation bounds — over the assembled locus graph, without a solver."
history:
  - when: "May 2026"
    what: "First public release. Locus/bus core, arena-per-locus runtime, GenMC model checking of the runtime's concurrent primitives in CI."
  - when: "Jun 2026"
    what: "v0.9.0: native codegen with static devirtualization, lock-free bus, cross-language benchmark grid."
  - when: "Jul 2026"
    what: "v0.10.0: last breaking surface change; NUMA-aware placement, live hot code-swap (reperspective), macOS support. LSP, formatter, and doc generator follow in point releases."
  - when: "Aug 2026"
    what: "v0.12–v0.13: effect certificates made fail-closed end to end; @effects(only:) closed-set contracts."
  - when: "Aug 2026"
    what: "v0.14–v0.15: claims land — architectural law (forbid reaches, only edges, bound, cover) evaluated by hale check as errors, zero runtime cost; library-tier claims travel with imports."
---

## The bet.

Hale's position is that the distance between how you describe a system out loud and what you type should be near zero — and that the same property that helps a human helps a model. One primitive, the locus, stands in for class, module, package, actor, and service. Loci communicate over a typed topic bus and never reach sideways into each other; a `main` locus declares placement (threads, cores, NUMA nodes) and bindings (in-process queue, Unix socket, shared-memory ring), so deployment shape is an edit to one block, not a rewrite.

LLM authorship is one of four stated design pillars, not the whole thesis, and the argument for it is subtractive rather than additive: there is no async coloring, no lifetime annotation, no lock vocabulary, no iterator/closure machinery. The constructs a model is most likely to hallucinate are absent, so a large class of plausible-looking wrong programs does not parse.

The verification story is what earns the camp placement. Per-function effect certificates (`@no_syscall`, `@deterministic`, `@budget`, `@effects(only: …)`) are proven transitively through helpers and imported libraries. Above them sit claims: named sentences over the assembled program graph — `forbid reaches(A, B)`, `only edges A -> B { publish T; }`, `count publishers(topic T) <= 1`, allocation bounds on paths — declared in the main locus, evaluated by `hale check` as errors, lowered to zero runtime code. Where the graph cannot be resolved, the checker refuses rather than guesses.

<p class="pullquote">Unknown means violation.</p>

## What it looks like.

<div class="code-sample">
  <div class="code">
<pre><span class="kw">topic</span> Metrics { payload: Metric; }

<span class="kw">locus</span> DeltaTriage {
    <span class="kw">bus</span> { <span class="kw">subscribe</span> Tasks <span class="kw">as</span> on_task; <span class="kw">publish</span> Metrics; }
    <span class="kw">fn</span> on_task(t: Task) {
        Metrics &lt;- Metric { n: t.id };
    }
}

<span class="kw">group</span> delta_wing = { DeltaTriage };
<span class="kw">group</span> gamma_wing = { GammaResearch };

<span class="kw">main locus</span> Org {
    <span class="ct">claims</span> {
        iso_dg: <span class="ct">forbid reaches</span>(delta_wing, gamma_wing);
    }
}</pre>
  </div>
</div>

This program fails to check, and the diagnostic returns the route:

<div class="code-sample">
  <div class="code">
<pre>claim `iso_dg` violated: `delta_wing` reaches `gamma_wing` —
witness: `DeltaTriage::on_task` -(publishes "Metrics")-&gt; `GammaResearch::on_metric`</pre>
  </div>
</div>

The witness is a minimal countermodel in the program's own vocabulary, with secondary diagnostics at the publish site, the subscription, and the destination — the compiler tells you where to edit, not just that you are wrong.

The agent tooling ships in the compiler binary itself: `hale mcp` exposes the checker, build, tests, the bus graph, placement, and spec search as MCP tools, and the checked-in AGENTS.md is treated as load-bearing surface rather than documentation garnish. The topology the claims are checked against can be dumped as a versioned JSON artifact and re-checked in CI, so an agent (or a reviewer) can diff the architecture, not just the text.

Certain workloads are still outperformed by mainstream languages; the cross-language comparison grid is tracked in [hale-lang/bench](https://github.com/hale-lang/bench).
