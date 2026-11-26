---
name: Intent
camp: verification
spans_camps: []
one_liner: "Mandatory preconditions, postconditions, and entity invariants. Z3 SMT verification via intentc verify. Natural-language intent blocks that resolve to specific contract references. One source file compiles to Rust, JavaScript, and WebAssembly, from a toolchain that self-hosts."
url: https://github.com/lhaig/intent
repo: lhaig/intent
paper: null
author: lhaig
implementation_language: Go
compilation_target: Native binaries (via Rust), JavaScript, WebAssembly (direct binary)
license: Apache-2.0
maturity: working_compiler
date_appeared: 2026-02
agent_tooling:
  - AGENTS.md
  - CLAUDE.md
  - INTENT.md
key_idea: |
  Every function carries `requires`/`ensures`; every entity carries an
  `invariant`; loops carry `invariant` and `decreases`. An `intent` block
  links natural-language goals to specific contract references via
  `verified_by`, and the compiler refuses to resolve a reference that has no
  matching contract. `intentc verify` discharges what it can to Z3; what
  remains runs as enforced runtime checks in Rust (panic), JavaScript
  (throw), or WebAssembly (trap), all from the same source file.
history:
  - when: "February 2026"
    what: "v0.1.0 and v0.2.0 released: contracts, Z3 verification, and Rust, JavaScript and WebAssembly backends from one IR."
  - when: "May 2026"
    what: "Language server shipped (diagnostics, hover, completion, go-to-definition, references), along with --strip-contracts for release builds."
  - when: "July 2026"
    what: "v0.3.0: the formatter, linter, checker and compiler are rewritten in Intent and reproduce the Go implementation byte for byte, proven by a stage1, stage2, stage3 bootstrap fixpoint."
  - when: "July 2026"
    what: "v0.4.0: module-qualified generic and variant construction across packages, carried through the self-hosted compiler."
crossrefs:
  - slug: vera
    name: Vera
    camp: verification
    relation: "Closest design relative. Both ship mandatory contracts on every function, both use Z3, both treat the agent as the primary author. Vera abolishes parameter names via typed DeBruijn slots and tracks LLM inference as a first-class <code>&lt;Inference&gt;</code> effect; Intent keeps names and concentrates its novelty in intent blocks that bind natural-language goals to verified contract references."
  - slug: aver
    name: Aver
    camp: verification
    relation: "Same camp, different proof story. Aver exports <code>verify</code> blocks as Lean 4 theorems or Dafny lemmas through <code>aver proof</code>, lifting effectful code into proof artefacts via Oracle; Intent commits to Z3 SMT with runtime enforcement on every backend. Same diagnosis, different upper-bound check."
  - slug: moonbit
    name: MoonBit
    camp: verification
    relation: "Closest sibling on compilation strategy. MoonBit ships four backends (WASM GC, JavaScript, native via C codegen, LLVM) on an OCaml-implemented compiler; Intent ships three (Rust, JavaScript, WASM) on a Go-implemented one. MoonBit's edge is years of training data; Intent's framing is auditability over breadth."
  - slug: prove
    name: Prove
    camp: verification
    relation: "Same contract machinery, opposite politics. Prove ships refinement types and verb-based IO under the Prove Source License v1.0, which prohibits use as AI training data; Intent ships under Apache-2.0 and addresses its agent-instruction documents to the model directly."
---

## The thesis.

Intent's premise is that humans audit contracts, not implementations. The repository's framing makes the position explicit: &ldquo;Humans audit contracts, not implementations. When you generate Intent code, the human reads your `requires`, `ensures`, `invariant`, and `intent` blocks to verify correctness.&rdquo; The compiler enforces structural consistency between the natural-language declarations and the machine-checkable ones &mdash; every `verified_by` reference must resolve to an actual `requires`, `ensures`, or `invariant` clause, or the program fails to compile.

<p class="pullquote">The contract system is the product. The implementation is secondary.</p>

The distinctive move is the **intent block** itself: a named natural-language goal paired with a list of `verified_by` references that name specific contracts in the codebase (`BankAccount.invariant`, `BankAccount.deposit.requires`, `BankAccount.withdraw.ensures`). The compiler resolves each reference during semantic analysis and emits an error on a dangling one; published intent blocks therefore cannot drift from the contracts they cite. Z3 discharges what it can statically via `intentc verify`; the rest becomes runtime enforcement that fires identically across all three targets &mdash; a `requires` failure panics the Rust binary, throws an `Error` in JavaScript, and traps in WebAssembly.

## What it looks like.

<div class="code-sample">
  <div class="code">
<pre><span class="kw">entity</span> <span class="ty">BankAccount</span> {
    <span class="kw">field</span> balance: <span class="ty">Int</span>;
<!-- -->
    <span class="ct">invariant</span> <span class="kw">self</span>.balance <span class="op">&gt;=</span> <span class="num">0</span>;
<!-- -->
    <span class="kw">method</span> deposit(amount: <span class="ty">Int</span>) <span class="kw">returns</span> <span class="ty">Void</span>
        <span class="ct">requires</span> amount <span class="op">&gt;</span> <span class="num">0</span>
        <span class="ct">ensures</span> <span class="kw">self</span>.balance <span class="op">==</span> <span class="kw">old</span>(<span class="kw">self</span>.balance) <span class="op">+</span> amount
    {
        <span class="kw">self</span>.balance <span class="op">=</span> <span class="kw">self</span>.balance <span class="op">+</span> amount;
    }
}
<!-- -->
<span class="kw">intent</span> <span class="str">"Safe withdrawal preserves non-negative balance"</span> {
    <span class="ct">goal</span> <span class="str">"BankAccount.withdraw never results in balance &lt; 0"</span>;
    <span class="ct">guarantee</span> <span class="str">"if withdraw returns false then balance is unchanged"</span>;
    <span class="ct">verified_by</span> <span class="ty">BankAccount</span>.invariant;
    <span class="ct">verified_by</span> <span class="ty">BankAccount</span>.withdraw.requires;
}</pre>
  </div>
  <p class="caption">An entity whose invariant and method contracts are machine-checkable, then an intent block naming the clauses that discharge a natural-language goal.</p>
</div>

`old(...)` captures pre-mutation state for `ensures` clauses. `forall i in 0..n: p` and `exists i in 0..n: p` quantify over integer ranges in contracts. Loops carry `invariant` and `decreases` clauses for inductive reasoning at verification time.

## Distinctive moves.

- **Mandatory contracts at three levels.** Functions carry `requires`/`ensures`; entities carry `invariant`; loops carry `invariant`/`decreases`. The grammar reserves the slots; the type checker enforces that `verified_by` references resolve.
- **Intent blocks as compiled artefacts.** A `verified_by` path (`Entity.member.clause` or `function.clause`) is resolved by the semantic checker, not by convention. Unresolved references are compile errors, which prevents prose-level drift between stated goals and machine-checkable contracts.
- **Z3 as an optional static layer, runtime checks as the floor.** `intentc verify` translates IR contracts to SMT-LIB and invokes Z3; results are reported per contract as `verified` / `unverified` / `error` / `timeout`. When Z3 is absent, the compiler degrades gracefully and the runtime asserts still run.
- **Rust as IR, not as the only backend.** An explicit IR layer (~30 node types, contracts as first-class IR nodes, `OldCapture`/`OldRef` as explicit pre-state) feeds three sibling backends: a Rust generator that hands off to `cargo`, a direct JavaScript emitter, and a direct WebAssembly binary emitter that does not require the Rust toolchain. Each enforces the same contracts at runtime.
- **Property-based test generation from contracts.** `intentc test-gen` derives property-based tests from `requires`/`ensures`, complementing &mdash; not replacing &mdash; the SMT discharge.
- **A self-hosting toolchain as the correctness check.** The formatter, linter, checker and compiler are each also written in Intent, and CI checks that the Intent versions produce output byte-identical to the Go originals. `make bootstrap-stage3` closes the loop: the Go compiler builds the Intent compiler, that builds itself again, and the third stage re-emits the whole toolchain unchanged.

## Maturity.

A Go workspace at v0.4.0 (released 16 July 2026). Milestones 1&ndash;9 in `docs/ROADMAP.md` are recorded as complete: the language surface (loops, arrays, enums, pattern matching, `Result`/`Option`, the try operator, multi-file imports), the Z3 verifier (`internal/verify/`), three backends (Rust via `internal/rustbe/`, JavaScript via `internal/jsbe/`, direct WASM via `internal/wasmbe/`), generics, traits, async/await, closures, `Map<K,V>`, and a package manager that resolves git and path dependencies with minimal version selection and an `intent.lock`. The CLI covers `intentc build / check / verify / test / test-gen / fmt / lint / lsp`, plus `intentc pkg init / add / remove / install / upgrade / vendor / list`, and `--strip-contracts` removes runtime assertions for release builds.

The largest change since v0.2.0 is self-hosting (v0.3.0, July 2026). Each tool has an Intent implementation selectable with `--self-hosted`, and differential gates compare it with the Go implementation across the examples and invalid fixtures; the self-hosted emitter matches on every Intent program in the repository. Design decisions are recorded as 60-plus ADRs in `docs/decisions/`. Open items the project lists itself: the self-hosted compiler emits the Rust target only (JS and WASM backends remain Go-only), dependencies are git or path rather than a versioned registry, the self-hosted checker has a documented tail of missed diagnostics that never fire on valid code, and verification-aware contract stripping (keep only the unverified checks) is planned but not built. There is no REPL.

## Agent tooling.

Three documents target agent authors directly. `AGENTS.md` (~25 KB) is the general agent orientation, and `CLAUDE.md` points to the same guide. `INTENT.md` (~39 KB) is the language reference written as agent instructions &mdash; it opens &ldquo;You are generating code in Intent&rdquo; and ends with explicit guidelines for AI code generation, including &ldquo;Write contracts first&rdquo; and &ldquo;Every function should have contracts.&rdquo; `docs/REPRODUCE.md` documents reproducing the compiler with the agent of the reader's choice. `intentc lsp` serves diagnostics (including per-contract Z3 results anchored at the clause), hover, completion, signature help, go-to-definition, references, document symbols and formatting, which gives agents in LSP-aware editors programmatic access to checker and verifier output. CLI diagnostics remain textual rather than structured JSON.
