---
name: Jacquard
camp: verification
spans_camps: [orchestration]
one_liner: "Effect rows on every arrow, checked and enforced as a runtime authority manifest. Content-addressed definitions, so a semantic diff and a reviewer's approval name exact canonical code. Handlers swap the world a program runs in, up to an exact probability model."
url: https://jacquardlang.org/
repo: jbwinters/jacquard-lang
paper: null
author: Josh Winters (FriendMachine)
implementation_language: OCaml
compilation_target: Native binaries via generated C; OCaml interpreter
license: Apache-2.0
maturity: working_compiler
date_appeared: 2026-07
agent_tooling:
  - SKILL.md
  - AGENTS.md
  - llms.txt
  - JSON diagnostics (--diagnostic-format json-v1)
  - stable error codes with cause and next step (docs/errors.md)
  - Warp test framework with exhaustive finite checking
key_idea: |
  Built for code that models write and people review. Every function arrow
  carries an effect row, and the inferred row of a runnable program is its
  authority manifest: the runtime refuses any world effect not granted with
  --allow, including effects reached through dynamically evaluated code.
  Handlers are deep and may resume a continuation once, never, or many
  times, so the same program runs against a fixed snapshot, a recorded
  trace, or a finite probability model whose outcomes enumerate exactly.
  Definitions are identified by the hash of their canonical structure,
  which covers everything they call, so a review can approve one exact
  version and tell when anything beneath it changes.
crossrefs:
  - slug: boruna
    name: Boruna
    camp: orchestration
    relation: "Shared audit instinct, different unit. Boruna gates effects at the VM level inside DAG workflows and bundles hash-chained evidence per run; Jacquard puts the gate in the type of every function and ships Audit and Approval as ordinary effects with canonical hash-chain carriers, so governance runs through the same handler mechanism as the rest of the program."
  - slug: ailang
    name: AILANG
    camp: verification
    relation: "Close on authority, apart on what a handler can do. Both type effects with row polymorphism and grant capabilities per run at the CLI (AILANG's --caps, Jacquard's --allow). Jacquard's handlers can also resume a continuation many times, which turns exact enumeration of a discrete model and exhaustive testing into library code."
  - slug: tacit
    name: Tacit
    camp: syntactic
    relation: "Same identity move, different source of truth. Both content-address definitions so that names and formatting stop mattering; Tacit makes the AST authoritative and hashes its canonical text with BLAKE3, while Jacquard keeps an ordinary surface syntax and hashes the canonical resolved kernel (SHA-256), erasing comments, spans and local names."
  - slug: semaprax
    name: SEMAPRAX
    camp: verification
    relation: "Both make a change's identity and authority reviewable, from opposite ends. SEMAPRAX gives each public declaration a persistent ID that survives edits and binds semantic patches to exact source revisions, so stale ones fail closed; Jacquard identifies a definition by the hash of its canonical structure, so any real edit, including one to a callee, yields a new identity that an earlier approval no longer matches."
history:
  - when: "Jul 2026"
    what: "First commit (3 July) and Jacquard Core 0.1 release candidates (11–12 July), with the public .jac surface syntax over the .jqd kernel notation."
  - when: "Aug 2026"
    what: "Jacquard Core 0.2.0 (15 August) adds structured concurrency, canonical Audit chains, proposal-bound Approval and checksum-verified binaries for Linux and macOS."
  - when: "Oct 2026"
    what: "Jacquard Core 0.3.0 (7 October) adds computation fuel, opaque types and observation policies; Linux and macOS binaries ship with an installer."
---

## The thesis.

Jacquard's README states the bet directly: when most code is written by machines, the people reviewing it need the language to answer what a change can touch and how sure anyone can be about what it does. The project's answer puts three things in the language rather than in comments or logs: the effects a function may perform, finite discrete uncertainty, and a program identity that survives renaming and reformatting.

<p class="pullquote">A reviewer reads the signature to learn what a change can touch; the checker guarantees the signature is complete.</p>

The effect row does double duty. A signature such as `(Text) ->{Net, Console} Int` tells a reviewer what the function may reach, and the inferred row of a runnable expression becomes the authority the runtime will ask for. Nothing outside the world is installed unless its grant appears on the command line, and code built at runtime with `eval` needs its own `eval` grant.

## What it looks like.

<div class="code-sample">
  <div class="code">
<pre><span class="kw">multi effect</span> <span class="ty">Telemetry</span> <span class="kw">where</span> {
  inventory-health : () -&gt; <span class="ty">Health</span>
  payments-health : () -&gt; <span class="ty">Health</span>
  error-spike? : () -&gt; <span class="ty">Bool</span>
}
<!-- -->
release-assessment : () -&gt;{<span class="ty">Telemetry</span>} <span class="ty">Assessment</span>
<!-- -->
<span class="cm">-- Deterministic interpretation: production snapshot, fixture, or replay.</span>
with-snapshot(inventory, payments, spike, body) =
  <span class="kw">handle</span> body() {
    | <span class="kw">return</span> value -&gt; value
    | inventory-health() <span class="kw">resume</span> continue -&gt; continue(inventory)
    | payments-health() <span class="kw">resume</span> continue -&gt; continue(payments)
    | error-spike?() <span class="kw">resume</span> continue -&gt; continue(spike)
  }
<!-- -->
<span class="cm">-- Probabilistic interpretation: uncertain telemetry becomes Dist choices.</span>
with-risk-model(body) =
  <span class="kw">handle</span> body() {
    | <span class="kw">return</span> value -&gt; value
    | inventory-health() <span class="kw">resume</span> continue -&gt;
        continue(<span class="ct">`op:sample`</span>(health-dist(<span class="num">0.85</span>, <span class="num">0.10</span>, <span class="num">0.05</span>)))
    ...
  }</pre>
  </div>
  <p class="caption">Abridged from <code>demos/case-studies/release-risk/model.jac</code> at <code>2d4afab</code>. The release policy is written once against <code>Telemetry</code>; one handler answers from a fixed snapshot, the other turns each reading into a weighted choice, so exact enumeration reports the probability of each release decision.</p>
</div>

## Distinctive moves.

- **Signatures as authority manifests.** Effect rows are inferred and checked; the runtime installs a world handler only for an explicit `--allow` grant and refuses the rest, dynamically evaluated code included. The project describes this as language-level enforcement in a research runtime, not a replacement for an operating-system sandbox.
- **Handlers as worlds.** A handler may resume once, decline to resume, or resume many times. Resuming many times forks the rest of the program, which is how exact enumeration and likelihood weighting of `Dist` models, and Warp's exhaustive mode, run as ordinary library code over the same program.
- **Canonical identity.** Definitions hash by canonical resolved structure, so comments, formatting, provenance and ordinary local or term names do not change identity. The hash covers every definition a function calls, so an edit to a callee changes the caller's hash too. The project states that this identity says nothing about behavioural equivalence of different programs.
- **Review tooling.** `jac diff` compares two versions by canonical structure rather than text: it reports added and changed definitions, any change to their authority (for example `authority {}` becoming `{Net}`) and the dependents affected, and reports no semantic changes for a pure reformat. A signature that omits an effect its body performs is rejected (E0804), `jac run --dry-run` simulates the world effects and reports what the run would have done, and an approval can name the exact hash a reviewer read. `jac relate` reruns a program under schedule, secret or grant variation and reports any difference under a declared observation policy, and `jac review run` (on main, not yet in a release) compares two versions of an entry over declared cases with grouped differences and replayable witnesses.
- **Warp.** The built-in test framework runs the same property by seeded sampling or, over finite generators, exhaustively. `fault.all` resumes at every fault site with both outcomes, so a test covers every combination of failures within a budget, and results are cached by hash, so a test reruns only when its canonical code or a dependency changes.
- **Governance as effects.** Audit records and approvals are ordinary effects with canonical hash-chain carriers and approval handlers, so a governed workflow is checked and tested with the same machinery as any other program.

## Maturity.

Tagged releases publish Linux x86-64 and macOS binaries, an installer and a release evidence pack. Its README calls Jacquard a research prototype rather than a production language and points to `docs/release/0.3/LIMITS.md` for the boundary. Core ships no real network adapter; its networking examples run against deterministic stubs, scripted responses, recorded traces or probability models, and a host integration can implement the same effects instead. Exhaustive checking and exact enumeration are bounded by explicit budgets: a uniform distribution enumerates at most 10,000 values, and larger models fall back to seeded sampling or likelihood weighting, with results labelled accordingly. The 0.3 release decision records 1,194 Alcotest/QCheck cases and 78 transcript tests at the `jacquard-core-0.3.0` tag. Commits carry a single human author, who describes development as largely model-assisted; recent pull requests record Codex and Claude reviews of each change.

## Agent tooling.

The project site, jacquardlang.org, serves an `llms.txt` index, a copy of `SKILL.md` and the error catalogue, along with a review tour that records each command's output from the released binary. `docs/SKILL.md` states that it covers installing Jacquard and writing, checking, running, testing and compiling `.jac` programs without a repository checkout. `AGENTS.md` orients agents working on the implementation. Every diagnostic carries a stable code, a cause and a next step, catalogued in `docs/errors.md`, and the CLI emits them as JSON with `--diagnostic-format json-v1`. There is no MCP server and no model-call effect. External systems sit behind an experimental, versioned host protocol: the companion `jbwinters/jacquard-host` repository publishes Python, TypeScript and Go SDKs, plus a protocol-level Rust adapter, that call checked Jacquard functions and implement their declared effects as ordinary services.
