---
name: Gooo
camp: verification
spans_camps: []
one_liner: "An experimental metaprogramming language with source-declared construction choices, Go generation, finite behaviour checks and saved-program replay."
url: https://github.com/kimjooyoon/meta-ontology-go
repo: kimjooyoon/meta-ontology-go
paper: null
author: asketeddy
implementation_language: Go
compilation_target: Go; native binaries and WebAssembly through the Go toolchain
license: MIT
maturity: working_compiler
date_appeared: 2026-08
agent_tooling:
  - AGENTS.md
  - JSON package interfaces
  - source-bound construction and completeness reports
  - saved package execution and replay receipts
key_idea: |
  Program construction is an operation declared in the language. Typed choices,
  intent, finite examples and an attempt budget constrain what an optional local
  model may rank. The compiler retains selected source, generated Go and scoped
  observations; saved-program replay does not require new model predictions.
crossrefs:
  - slug: vera
    name: Vera
    camp: verification
    relation: "Both expose machine-readable checks to a code-authoring agent. Vera turns mandatory function contracts into SMT obligations and runtime checks; Gooo binds a declared construction search to finite examples and retains unresolved claims separately. Its case results are not SMT proofs."
  - slug: ailang
    name: AILANG
    camp: verification
    relation: "Both have Go implementations and replay-oriented agent tooling. AILANG checks capability-based effects in a functional language; Gooo concentrates on source-owned construction choices and saved generated programs. Gooo's execution receipts do not grant host authority."
---

## The thesis.

Gooo, short for Go Of Ontology, treats program construction as an inspectable
language operation. Source files declare entities and activities with stable
semantic identities. An `assembling` block adds the permitted typed changes,
their intent, expected examples and a search budget. An agent can work with
that explicit construction space rather than produce an unrestricted replacement
body. A compatible local model can rank declared alternatives; the same route
also works with deterministic ordering and no model.

The verification-camp connection is the compiler's feedback and evidence
interface. Gooo records what was selected, what was generated, what matched
the supplied cases and what remains unobserved. These are scoped observations,
not a proof that the examples exhaust the input domain or capture the author's
natural-language intent.

## What it looks like.

<div class="code-sample">
  <div class="code">
<pre><span class="kw">activity</span> Clamp(<span class="ty">Integer</span>) <span class="op">-&gt;</span> <span class="ty">Integer</span>
  <span class="kw">computes</span> <span class="str">"if input &lt; 0 { return 0 } else if input &lt; 10 { return input } else { return 10 }"</span>
  <span class="kw">assembling</span> {
    <span class="kw">choice</span> <span class="str">"upper-comparison"</span> <span class="ct">operand_order</span> <span class="kw">at</span> <span class="str">"1"</span>
      <span class="kw">intent</span> <span class="str">"Check input below ten."</span>
    <span class="kw">case</span> <span class="str">"-1"</span> <span class="op">-&gt;</span> <span class="str">"0"</span>
    <span class="kw">case</span> <span class="str">"5"</span> <span class="op">-&gt;</span> <span class="str">"5"</span>
    <span class="kw">case</span> <span class="str">"11"</span> <span class="op">-&gt;</span> <span class="str">"10"</span>
    <span class="kw">attempts</span> <span class="str">"8"</span>
}</pre>
  </div>
  <p class="caption">An abbreviated activity from the project's <a href="https://github.com/kimjooyoon/meta-ontology-go/blob/83928fa4538245abe33b08549da47f8cbdc50ed2/examples/body-codegen/source-assembly.gooo.fixture">source-assembly example</a>. Its package, Integer declaration and two other choices are omitted here. The cases constrain construction; running the generated package is a separate observation.</p>
</div>

## Distinctive moves.

- **Source owns the search space.** Alternatives and budgets live beside the
  activity, rather than only in an agent's prompt. Model ranking cannot add a
  choice outside that declared route.
- **Selection and execution have different records.** Body generation retains
  source and case-scoring evidence. Package execution builds and runs the
  projection; saved replay reuses the selected program without new inference.
- **Identity survives projection.** Stable entity and activity identifiers link
  declarations, package interfaces and generated Go boundaries. Display names
  and semantic identity are separate concerns.
- **Partial observations remain visible.** Completeness reports retain failures,
  unattempted choices and unresolved execution obligations. A passing finite
  suite does not erase those other dimensions.

## Maturity.

The repository ships an experimental Go compiler, project starters and runnable
package examples. Its [getting-started guide](https://github.com/kimjooyoon/meta-ontology-go/blob/dev/docs/getting-started.md)
pins an installation route and explains execution and replay. The separate
[Go ports lab](https://github.com/kimjooyoon/gooo-go-ports) exercises generated
programs against independent Go references and publishes browser examples.

Support is profile-specific: declaration checking, body generation and actual
execution establish different claims. The examples document bounded syntax and
input domains. Broader language coverage and independently sourced workflows
remain development areas; construction receipts do not authenticate a caller
or authorise external effects.

## Agent tooling.

`AGENTS.md` defines source, generated-code and evidence ownership. The compiler
exports JSON package interfaces and construction/context reports, while package
execution and replay expose structured results for subsequent agent work.
The workflow is described in the project's [source-assembly guide](https://github.com/kimjooyoon/meta-ontology-go/blob/83928fa4538245abe33b08549da47f8cbdc50ed2/docs/source-assembly.md).
The project and this submission use AI assistance; that attribution does not
substitute for execution evidence.
