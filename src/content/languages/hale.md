---
name: Hale
camp: verification
spans_camps: [orchestration]
one_liner: "Compiled general-purpose language built on a recursive hypergraph model: components (loci) own their state and never reference their peers directly, so the compiler can check architectural rules over the whole program graph, out to a fleet of binaries."
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
  - "AGENTS.md (the design model's encoding plus a seven-shape pattern catalogue), with role guides in agents/"
  - "MCP server shipped inside the compiler binary (check, verify, build, run, test, bench, fmt, doc, bus graph, placement, spec search)"
  - "LSP with contract-surfacing hover and bus-graph, placement and allocation queries"
  - "JSON diagnostics and API reference (hale check --json, hale doc --json)"
  - "machine-readable topology artefact with countermodel witnesses (--dump-topology)"
  - "served api surfaces exported as MCP tools; outside MCP and OpenAPI endpoints imported as typed surfaces (hale api import)"
key_idea: |
  Hale is organised around a recursive hypergraph design model that the
  project publishes as %DESIGN v1 and maps each construct onto. The
  locus is its recursive unit: it stands in for class, actor and
  service, holds references only to its own children, and coordinates
  with its siblings through their parent or a typed topic bus. That
  shape lets the compiler check rules at every scale, from per-function
  effect certificates (@no_syscall, @effects(only:)) to program-wide
  claims (forbid reaches(A, B)) answered with minimal countermodel
  witnesses, constitutions shared across entrypoints and environments,
  and signed composition of separately compiled binaries into a fleet.
  The project's case for model authorship is subtractive: with no async
  functions to colour, no lifetimes and no lock to pick, the shapes a
  model tends to hallucinate are not in the language.
benchmark:
  label: "hale bench (vs Go, Node, Python)"
  url: https://github.com/hale-lang/bench
crossrefs:
  - slug: vera
    name: Vera
    camp: verification
    relation: "Same camp, different scale of contract. Vera discharges per-function requires/ensures with an SMT solver; Hale checks whole-program sentences — reachability, publisher counts, effect bounds along paths — over the assembled locus graph, without a solver."
  - slug: boruna
    name: Boruna
    camp: orchestration
    relation: "Both hold a program to its effects and replay a run deterministically. Boruna requires each workflow step to declare its effects, gates them at the VM and hash-chains the evidence; Hale infers every function's effects, certifies the ones a contract names at compile time across the whole call graph, and admits a recording to hale replay only when it can establish its coverage."
  - slug: cohesive
    name: Cohesive
    camp: verification
    relation: "Same aim of raising the unit of authoring from computations to systems. Cohesive lowers embedded C# declarations into a portable IR that compilers and interpreters consume, so one model can carry several interpretations; in Hale the declaration is itself the program, and its deployment shape is an edit to the main locus."
history:
  - when: "May 2026"
    what: "v0.8.0, the first public release, with the locus/bus core and an arena-per-locus runtime."
  - when: "Jun 2026"
    what: "v0.8.3–v0.9.0: GenMC model checking of the runtime's concurrent primitives in CI — against hand-written transcriptions of the primitives rather than the shipping C, a limitation the project's own verification notes tabulate; native codegen with static devirtualisation and a lock-free bus."
  - when: "Jul 2026"
    what: "v0.10.0: NUMA-aware placement and macOS support, with the LSP, formatter and doc generator following in point releases."
  - when: "Jul–Aug 2026"
    what: "v0.12–v0.15: effect certificates made fail-closed end to end; claims land as architectural rules (forbid reaches, only edges, bound, cover) evaluated by hale check as errors at no runtime cost, and a library's claims travel with its imports."
  - when: "Aug 2026"
    what: "v0.16–v0.17: constitutions share one claimset across entrypoints and environments; fleet plans compose per-binary topology artefacts with cross-process witnesses, gated by ES256 signatures and binary attestation; hale replay re-runs a recorded execution behind a fail-closed coverage boundary."
  - when: "Sep 2026"
    what: "v0.20–v0.22: DNA, a library written in Hale for building governed organisations, in which a model-backed Leader acts within its grant and escalates the rest to a human Board, and whose structure hale check verifies before any process starts."
  - when: "Oct 2026"
    what: "v0.24–v0.28: served surfaces, in which an api declaration is served over Unix sockets, HTTP, gRPC and MCP with OpenAPI, JSON Schema and protobuf descriptions and typed clients generated from it, and outside OpenAPI and MCP endpoints import as typed surfaces."
  - when: "Nov 2026"
    what: "v0.33–v0.36: a written stability policy and a parity gate that builds every program hale check accepts, followed by the removal of perspectives (with the reperspective hot-swap the project says was never completed) and of in-file module declarations."
---

## The thesis.

Hale's position is that the distance between how you describe a system out loud and what you type should be near zero — and that the same property that helps a human helps a model. One primitive, the locus, stands in for class, actor and service, and a seed, a directory whose files share one scope, takes the place of a module or package. Loci own their state and never reach sideways into each other: siblings coordinate through their parent or over a typed topic bus. A `main` locus declares placement (threads, cores, NUMA nodes) and bindings (in-process queue, Unix socket, shared-memory ring), so deployment shape is an edit to the main locus, not a rewrite.

The [README](https://github.com/hale-lang/hale#built-for-humans-and-models) argues the case for model authorship by subtraction: there are no async functions to colour, no lifetimes to get wrong and no lock to pick, so the shapes a model tends to hallucinate are not in the language.

The project publishes the design model behind this as `%DESIGN v1`, a recursive hypergraph with numbered nodes, hyperedges and invariants, and its documentation maps each construct onto it; AGENTS.md asks for the IDs to be cited when a rule is justified. Two of the model's rules carry most of the weight. Ownership edges run only between parent and child (`H9`), which is what lets a locus's arena be freed wholesale, with no garbage collector and no borrow checker. And every graph the compiler derives closes at a named boundary (`I8`), past which anything unresolved is recorded as a hole.

The verification story is what earns the camp placement. Per-function effect certificates (`@no_syscall`, `@deterministic`, `@budget`, `@effects(only: …)`) are proven transitively through helpers and imported libraries. Above them sit claims: named rules over the assembled program graph — `forbid reaches(A, B)`, `only edges A -> B { publish T; }`, `count publishers(topic T) <= 1`, `bound llm <= N on paths from G` over a user-declared effect class — declared in the main locus, evaluated by `hale check` as errors, and compiled to no runtime code. A constitution is a set of claims written once and proven separately in every entrypoint and deployment environment that adopts it; composition is union-only, so a constitution cannot be weakened. A hole counts against the program: where the graph cannot be resolved, the checker refuses rather than guesses.

<p class="pullquote">Unknown means violation.</p>

## What it looks like.

<div class="code-sample">
  <div class="code">
<pre><span class="kw">role</span> operator;
<!-- -->
<span class="kw">type</span> Metric {
    n: Int;
}
<!-- -->
<span class="kw">topic</span> Metrics {
    payload: Metric;
}
<!-- -->
<span class="kw">locus</span> Triage {
    <span class="kw">bus</span> {
        <span class="kw">publish</span> Metrics;
    }
<!-- -->
    <span class="kw">fn</span> submit(id: Int) -&gt; Int {
        Metrics &lt;- Metric { n: id };
        <span class="kw">return</span> id;
    }
}
<!-- -->
<span class="kw">locus</span> Research {
    <span class="kw">bus</span> {
        <span class="kw">subscribe</span> Metrics <span class="kw">as</span> on_metric;
    }
<!-- -->
    <span class="kw">fn</span> on_metric(m: Metric) {
        println(<span class="str">"metric "</span> + to_string(m.n));
    }
}
<!-- -->
<span class="kw">api</span> Intake {
    <span class="kw">rpc</span> Triage::submit <span class="ct">requires</span>: [operator];
}
<!-- -->
<span class="kw">group</span> operators = { <span class="kw">role</span> operator };
<span class="kw">group</span> research_wing = { Research };
<!-- -->
<span class="kw">main locus</span> Org {
    <span class="kw">params</span> {
        triage: Triage = Triage { };
        research: Research = Research { };
    }
    <span class="ct">claims</span> {
        operators_never_reach_research: <span class="ct">forbid reaches</span>(operators, research_wing);
    }
}
<!-- -->
<span class="kw">fn</span> main() {
    Org { };
}</pre>
  </div>
  <p class="caption"><code>Intake</code> is the program's API surface, and <code>role operator</code> in a group selects every handler an operator may call through it.</p>
</div>

This program fails to check, and the diagnostic, lightly reformatted, returns the route:

<div class="code-sample">
  <div class="code">
<pre>claim `operators_never_reach_research` violated: `operators` reaches `research_wing` —
witness: `Triage::submit` -(publishes "Metrics")-&gt; `Research::on_metric`</pre>
  </div>
</div>

The witness is a minimal countermodel in the program's own vocabulary, with secondary diagnostics at the publish site, the subscription and the destination: the three places an edit would resolve it.

The surface and the claim answer different questions. `requires: [operator]` is checked at the transport boundary, when a request arrives; the claim proves where an operator's request can go once it is inside, which no role guard can see.

Serving the surface is an edit to the main locus alone. This version serves `Intake` over HTTP, and the program still fails on the same claim:

<div class="code-sample">
  <div class="code">
<pre><span class="kw">locus</span> Tokens {
    <span class="kw">fn</span> principal(token: String) -&gt; std::api::Principal {
        <span class="kw">if</span> token == <span class="str">"t-ops"</span> {
            <span class="kw">return</span> std::api::Principal { mode: <span class="str">"bearer"</span>, name: <span class="str">"ops"</span> };
        }
        <span class="kw">return</span> std::api::Principal { mode: <span class="str">"bearer"</span>, name: <span class="str">""</span> };
    }
<!-- -->
    <span class="kw">fn</span> refused() -&gt; String {
        <span class="kw">return</span> <span class="str">"unknown token"</span>;
    }
}
<!-- -->
<span class="kw">main locus</span> Org {
    <span class="kw">params</span> {
        triage: Triage = Triage { };
        research: Research = Research { };
        tokens: Tokens = Tokens { };
        roles: std::api::StaticRoles = std::api::StaticRoles {
            table: <span class="str">"operator=bearer:ops"</span>,
            known: <span class="str">"operator"</span>,
        };
        web: api::Exposure = api::serve(
            Intake,
            http::Rpc {
                bind: <span class="str">"127.0.0.1:8080"</span>,
                principals: self.tokens,
                roles: self.roles,
            },
            as: <span class="str">"intake"</span>,
            bound: <span class="num">64</span>,
            on_full: refuse
        );
    }
    <span class="ct">claims</span> {
        operators_never_reach_research: <span class="ct">forbid reaches</span>(operators, research_wing);
    }
}</pre>
  </div>
  <p class="caption">The main locus lends its <code>tokens</code> and <code>roles</code> children to the exposure. <code>Tokens</code> stands in for a real bearer source.</p>
</div>

Swapping `http::Rpc` for `grpc::Rpc` or `mcp::Rpc` serves the same rpc another way without touching the loci, and `hale api export` writes OpenAPI, JSON Schema, protobuf and MCP descriptions from the declaration, so the MCP tool (`Triage__submit`) carries the schema the compiler checked.

## Distinctive moves.

The same shape of answer comes back one scale further out. A fleet seed declares separately compiled binaries as instances of a `fleet locus`, with the bindings that wire them and claims across them; `hale fleet check` composes each binary's topology artefact, never merged source, and returns a cross-process witness when two components that each check clean are deployed wrongly together. Only a fleet binding creates a fleet edge, so matching topic names in two programs connect nothing. The project states that signing the deployment rows ties the running fleet to the checked one, and that this certifies provenance and integrity, not behaviour.

DNA, the largest body of Hale in the repository, is in the project's words not a program but a library from which programs emerge: a governed organisation whose positions, autonomy grants and spend budget are locus construction, checked like any other program. A model-backed Leader acts within its grant and escalates the rest to a human Board. It is where the orchestration reading of the language is most visible.

## Maturity.

Hale is pre-1.0, and breaks have been frequent. Its stability policy allows any release to change the language or the standard library with no deprecation window: a removed form is refused in the release that removes it, with an error that points at the replacement. Every release's changelog opens with a Breaking heading listing each break with a one-line migration, and a break migrates the project's own Hale code in the same change. A tier file marks what is settled, and the api binding, roles, fleet composition, the unit dialect, the canonical model and DNA are all marked experimental, so much of what this page shows is still moving. The compiler, LSP, formatter and MCP server ship together as prebuilt Linux and macOS binaries, and the playground runs precompiled examples in the browser via WebAssembly.

On performance, the project's cross-language grid, run on a single machine at v0.22.0 and tracked in [hale-lang/bench](https://github.com/hale-lang/bench), reports Hale faster than Go at message dispatch, JSON parsing and `@form` collections, and slower at raw function calls (1.5×) and at locus creation and churn (9.9–17.5×).

## Agent tooling.

The compiler binary carries its own agent interfaces. `hale mcp` exposes check, verify, build, run, test, bench, fmt and doc as typed tools, alongside the bus graph, placement, and a search over the specification embedded in the binary. AGENTS.md describes itself as the load-bearing prompt: it opens with the `%DESIGN v1` encoding and a mapping from each construct to its graph, then a catalogue of seven program shapes. The topology the claims are checked against can be dumped as a versioned JSON artefact and re-checked in CI, so an agent or a reviewer can diff the architecture as well as the text. Surfaces also work inward: `hale api import` turns an outside MCP or OpenAPI endpoint into a typed surface the checker can see, and `hale api drift` reports when the source has moved.
