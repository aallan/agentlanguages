---
name: Flow
camp: adjacent
spans_camps:
  - orchestration
one_liner: >-
  A systems language with first-class typed effects and capabilities, a
  self-hosted compiler, C and MLIR backends, and a large real codebase (a Doom
  port) that agent tooling can be pointed at.
url: https://flooooooooooow.github.io/flow/
repo: flooooooooooow/flow
paper: null
author: Abhishek Shivakumar
implementation_language: Python
compilation_target: C
license: MIT
maturity: working_compiler
date_appeared: 2026-01
agent_tooling: [LSP]
key_idea: |
  Flow is not primarily a language for agents, but it is unusually amenable to
  them. Its headline mechanism is a first-class effect system: effects declare
  operations, capabilities provide them, and a function that needs a
  capability can only run where that capability is in scope. That gating is
  exactly the shape an AI author needs to trust that a piece of generated
  systems code cannot do I/O it was not given. On top of the compiler it ships
  a language server, a deterministic C backend, and a self-hosted compiler with
  a three-generation bootstrap proof, so agent-authored code has a stable,
  reproducible target to aim at.
history:
  - when: "January 2026"
    what: "First commit; language and Toolchain scaffolded."
  - when: "2026"
    what: "0.7 to 0.9 toolchain, self-hosted flowc bootstrap, CI on Linux/macOS/Windows."
---

## What it is.

FLOW is a statically typed, compiled systems language. It sits at the
intersection of systems programming, machine learning, audio and graphics. The
compiler is written in Python and emits a portable C backend as the default
CPU path, with MLIR, WebAssembly, SPIR-V and Metal as co-equal targets. It is
self-hosted too: a separate front end (`flowc`) is written in Flow and proved
byte-for-byte reproducible over three bootstrap generations.

The central semantic move is a typed effect system. `effect` declares an
operation, `capability` provides an implementation, and a function that needs
an effect carries it in its signature. This is capability gating in the sense
a verification-minded language cares about: a unit cannot reach an effect it
was not handed.

```html
<div class="code-sample">
  <div class="code">
<pre><span class="kw">effect</span> <span class="ty">Renderer</span> {
    <span class="kw">function</span> create_texture(<span class="ty">i32</span> w, <span class="ty">i32</span> h) -> <span class="ty">i32</span>
}
<span class="kw">function</span> game_head(renderer: <span class="ty">capability</span> <span class="ty">Renderer</span>) -> <span class="ty">i32</span> {
    <span class="kw">return</span> renderer.create_texture(<span class="num">1</span>, <span class="num">1</span>)
}</pre>
  </div>
  <p class="caption">A function that needs a capability declares it; the caller
must bind a real implementation before the call is legal.</p>
</div>
```

## Distinctive moves.

Effect capabilities as a first-class systems construct is the standout. The
value semantics with explicit `let mut`, lifetimes as span domains, and a
`capability` parameter type give a compiler-gated picture of what a code
passes and what it can touch. Compound assignment, variadic externs, and
autodiff in the standard library round it out. It is dense the way a systems
language needs to be, but the grammar is deliberately small and documented as
EBNF generated from the parser.

## Maturity.

Working compiler, not yet production ready. The repo that feels most
evidential is a Doom port, so the claim that the language can build a real
program is backed by a real codebase. The compiler is self-hosted and proven
by a three-generation bootstrap that compares stage A, B and C output
byte-for-byte. The test corpus is large (the numbers are in the repo), with
fuzzing, torture tests and a C/MLIR backend parity harness. The toolchain runs
on macOS and Linux on x86-64 and ARM64, with a partial Windows path.

## Agent tooling.

The compiler ships a language server (`flow-lsp`), a REPL, structured
JSON-RPC diagnostics, and a VS Code extension with a TextMate grammar. Agent
tooling is present but not yet a headline SKILL.md/AGENTS.md story. The
strongest agent-facing fact is the capability index: because effects and
capabilities are explicit types, a generated change that needs to touch
filesystem, network or input carries proof of that need in its signature.