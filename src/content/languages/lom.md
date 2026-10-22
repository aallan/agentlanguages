---
name: Lom
camp: unclassified
spans_camps: []
one_liner: "An LLM-repair-native dynamic language: stable diagnostic codes, a confidence-graded fix engine with a written auto-apply safety axiom, and a repair-loop benchmark are the language's reason to exist."
url: https://github.com/lom-lang/lom
repo: lom-lang/lom
paper: null
author: wytyKen (developed in LLM co-authorship throughout — a model-readability test is the repository's second commit, on day one)
implementation_language: Rust
compilation_target: tree-walking interpreter and WASM (dual backends, byte-identical output); self-hosted subset compiler bootstraps to a byte-identical quine
license: Apache-2.0
maturity: working_compiler
date_appeared: 2026-08
agent_tooling:
  - AGENTS.md
  - JSON diagnostics (lom-diag/v1)
  - fix-plan / fix-apply JSON (lom-fix/v1)
  - cross-compiler repair channel (l2-fix/v2, structured positions)
  - machine-readable code registry (lom codes --json, 46 codes, lom-codes/v1)
  - stable diagnostic codes across nine namespaces plus eight L2 families
  - LSP
  - browser playground (full toolchain compiled to WASM)
  - SPEC_FOR_AI.md (a full language spec written for LLM consumption)
  - ACRI v0.1 (an open agent-compiler repair-interface spec; this repo is the reference implementation)
key_idea: |
  Make the repair loop a language primitive rather than a toolchain feature.
  Every diagnostic carries a stable code; every code can carry a
  confidence-graded repair suggestion; auto-apply obeys a written safety
  axiom — only high-confidence non-hint actions are applied, and cognitive
  notices (deterministic name-collision and closure-capture warnings) are
  never auto-rewritten. The boundary is locked by an end-to-end fix corpus:
  thirteen pairs, five of which assert fixed == bad, including the two pairs
  that pin those cognitive warnings. The loop is measured by a purpose-built
  benchmark instead of asserted.
benchmark:
  label: RepairLoopBench
  url: https://github.com/lom-lang/lom/blob/main/eval/README.md
crossrefs:
  - slug: zero
    name: Zero
    camp: verification
    relation: "Zero frames its diagnostics as a repair contract and ships typed repair plans; Lom pushes the same idea into the language proper — suggestions are graded executable actions with an auto-apply safety axiom — and adds a published, contamination-safe benchmark for the loop."
  - slug: vera
    name: Vera
    camp: verification
    relation: "Vera attaches a fix hint and a spec reference to every diagnostic; Lom's suggestions are executable actions with confidence grades, and RepairLoopBench measures the loop end-to-end rather than asserting it."
  - slug: valea
    name: Valea
    camp: unclassified
    relation: "The closest blueprint on paper — structured JSON diagnostics plus an agent fix loop, written in Rust. Lom differs in shipping the loop with a safety axiom, a self-hosted byte-identical quine, and a reproducible benchmark."
  - slug: x07
    name: X07
    camp: syntactic
    relation: "X07 applies quickfixes deterministically at the toolchain level; Lom grades what may be auto-applied versus advised, and locks that boundary in a corpus of end-to-end fix pairs."
---

## The thesis.

Most agent languages optimize how agents write code. Lom optimizes what happens
when the agent gets it wrong: the repair loop. The language ships with stable
diagnostic codes across nine namespaces (plus an eight-family code space for its
self-hosted subset compiler), a fix engine whose suggestions are graded
high/medium/low, and a written safety axiom: auto-apply is restricted to
high-confidence non-hint actions, and cognitive notices are never auto-rewritten,
because rewriting them is a correctness regression, not a fix. That boundary is
locked by an end-to-end fix corpus — thirteen pairs, five asserting
<code>fixed == bad</code>, including the two pairs that pin the cognitive
warnings (a deterministic name-collision notice and a closure-capture notice).

## What it looks like.

A small dynamically typed language with a frozen surface (20 keywords, 43
builtins), run by a tree-walking interpreter and compiled to WASM, with both
backends required to agree byte-for-byte. A self-hosted subset compiler written
in the language itself (12,671 lines) regenerates itself as a byte-identical
272,925-byte quine — the repair-loop tooling it exercises is bootstrapped by
that compiler, in-language.

## Distinctive moves.

<p class="pullquote">The repair loop is not a toolchain afterthought here — it is the reason the language exists.</p>

Diagnostics are the deliverable: <code>--check --json</code> emits
machine-readable diagnostics, <code>fix --plan</code> grades suggestions,
<code>fix --apply</code> obeys the axiom, and <code>codes --json</code> exports
the full registry as an agent bootstrap file. The repo also maintains ACRI, a
small open specification for agent-compiler repair interfaces (object model,
CLI protocol, benchmark methodology), with Lom as its reference implementation
— and RepairLoopBench, whose repair tasks hand models verbatim diagnostics
captured from the real compiler, machine-checked against it in CI.

<div class="code-sample">
  <div class="code">
<pre>lom fix broken.lom --plan
共 1 个诊断（1 个有可应用修复，0 个仅提示）

--- 诊断 #1 [NAM003] (error) ---
  位置: broken.lom:3:13
  消息: 未定义变量 'y'
  修复 (1):
    [1] 将 'y' 替换为 'x' [medium]
      action: replace at 3:13..3:14 text="x"
  retry: true</pre>
  </div>
  <p class="caption">A real session, captured verbatim from the toolchain. The suggestion for the undefined-variable diagnostic is <em>medium</em> confidence, so <code>fix --apply</code> will skip it — the safety axiom grades what may be rewritten automatically versus advised. A wrong-variable rewrite that happens to compile is exactly the class of fix the axiom exists to refuse.</p>
</div>

## Maturity.

A working toolchain: dual backends, formatter, LSP, local package manifests,
CLI fix tooling, and a browser playground. CI runs the full self-hosting
regression on Linux and the build/test matrix on three platforms. The
dependency and claim surface is machine-checked — a zero-third-party-crate CI
gate, 368 self-compilation cases, a 14-case three-layer bootstrap check, 621
Rust tests — and the codebase contains no unsafe code.

## Agent tooling.

Beyond the JSON surfaces in the frontmatter: the repair tasks in
RepairLoopBench embed diagnostics captured verbatim from the live tool rather
than hand-written, with a CI gate re-checking the embedded code multiset
against live output — the same contamination discipline the benchmark card
states plainly, including what the suite is not (not repo-scale, not
comparable to SWE-bench-family leaderboards). The reported headline — full-set
pass@1 of 98.3% / 98.5% across two frontier models, ten samples each — carries
the qualification that raw model outputs are not archived in-repo; per-task
pass matrices and methodology are.
