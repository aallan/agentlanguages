---
name: With
camp: adjacent
spans_camps: [verification]
one_liner: "A self-hosted, LLVM-native systems language with ownership-based memory safety, first-class C import and migration, and agent guidance generated into every new project."
url: https://withlang.org
repo: withlang-dev/with
paper: null
author: Eric Hartford
implementation_language: With (self-hosted)
compilation_target: Native code via LLVM
license: MIT
maturity: working_compiler
date_appeared: 2026-02
agent_tooling: [AGENTS.md, CLAUDE.md]
key_idea: |
  With pursues ownership-based memory safety without lifetime annotations:
  references are second-class and local, and long-lived relationships use
  handles rather than stored pointers. Its design rule is that the compiler
  supplies whatever the program has already determined, and the programmer
  spells a choice only where two meanings remain, so explicit spellings
  cluster at mutation sites, module boundaries and C interop rather than
  being spread uniformly. `with init` writes an AGENTS.md and CLAUDE.md
  primer into every new project.

crossrefs:
  - slug: zero
    name: Zero
    camp: verification
    relation: "Both are native systems languages that speak to agents directly. Zero puts the agent interface in the compiler, with structured JSON diagnostics and typed repair plans; With puts it in the project, generating an AGENTS.md and CLAUDE.md primer at init and keeping the language itself human-first."
  - slug: vera
    name: Vera
    camp: verification
    relation: "Both check more than types, but different things. Vera makes every function declare contracts and discharges them with Z3; With checks ownership and resource release, and asks for no functional-correctness specification."
  - slug: ilo
    name: ilo
    camp: syntactic
    relation: "Opposite answers to ceremony. ilo removes characters to minimise the tokens a model spends; With removes only the characters the program already determines, and keeps an explicit spelling wherever two meanings remain."
---

## The thesis.

With is a systems language whose safety model is Rust-like in outcome and different in mechanism. Ownership is persistent and single; borrowing is ephemeral and never stored; relationships that must outlive a scope are expressed as typed handles. That trade removes lifetime annotations from the language at the cost of forbidding references inside long-lived data structures. The compiler is written in With and rebuilds itself to a byte-identical fixpoint.

It is not designed as a language for agents in the sense of the syntactic camp. It is designed for human ergonomics, and it treats agents as first-class authors of the projects written in it.

<p class="pullquote">If the creators of the language can leak by accident, the design is wrong, not the programmer.</p>

## What it looks like.

<div class="code-sample">
  <div class="code">
<pre><span class="kw">fn</span> handle(req: <span class="ty">Request</span>) -&gt; <span class="ty">Response</span>:
    <span class="kw">let</span> user = db.find_user(req.params.id) <span class="kw">else</span>:
        <span class="kw">return</span> <span class="ty">Response</span>.not_found()
    <span class="ty">Response</span>.json(user)
<span class="cm">// scoped mutation: the value is mutable only inside the block</span>
<span class="kw">let</span> config = <span class="kw">with</span> <span class="ty">Config</span>.default() <span class="kw">as mut</span> c:
    c.timeout = <span class="num">30</span>
    c.retries = <span class="num">3</span></pre>
  </div>
  <p class="caption">Indentation-scoped, inferred where the type is forced, with <code>let … else</code> for early exit and a <code>with</code> block that confines mutation to a scope.</p>
</div>

## Distinctive moves.

- **Explicitness where meaning is not forced.** The project's written design rule is that a character the program already determines should not have to be written, and a choice between two meanings must be. In practice this means less ceremony than Rust for inference and scoping, and deliberate spellings at the points where an author, human or agent, is most likely to be silently wrong.
- **C as a first-class neighbour.** `c_import` reads C headers directly, and `with migrate` translates C source into With.
- **Leaks are defects.** The language treats an accidental leak as a design error rather than as safe behaviour.
- **Decisions are recorded.** Language changes go through numbered, dated rulings with alternatives weighed, kept in the repository alongside a versioned specification.

## Maturity.

A working, self-hosting compiler with CI on Linux (x86_64, aarch64), macOS (arm64) and Windows (x86_64, aarch64), nightly releases and an LSP. The specification is versioned and ahead of the implementation in places; the repository marks compiler behaviour that does not yet match a ruling as non-compliant rather than as precedent.

## Agent tooling.

`with init` generates an `AGENTS.md` and `CLAUDE.md` in every new project, containing a compact primer on With's syntax, ownership model, idioms and common mistakes, written for an AI assistant working in that project. The compiler itself is developed largely by agents under a human maintainer who rules on language design, and its own repository carries the same kind of guidance.
