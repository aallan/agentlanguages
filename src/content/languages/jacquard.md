---
name: Jacquard
camp: orchestration
spans_camps: [verification]
one_liner: "Effect rows on every arrow, enforced as a runtime authority manifest. Handlers swap the world a program runs in, from a fixed snapshot to an exact probability model. Definitions are content-addressed by canonical structure."
url: https://research.friendmachine.co/jacquard/
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
  - slug: lumen
    name: Lumen
    camp: orchestration
    relation: "Both put algebraic effects in signatures and gate them with grants. Lumen targets humans authoring agent workflows and makes model calls a first-class effect; Jacquard targets code that models write, and ships no model-call effect, leaving model access to a host on the other side of a versioned worker protocol."
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
- **Canonical identity.** Definitions hash by canonical resolved structure, so comments, formatting, provenance and ordinary local or term names do not change identity, and pure tests rerun only when canonical code or a dependency changes. The project states that this identity says nothing about behavioural equivalence of different programs.
- **Testing the review, not only the code.** Warp checks properties by sampling or, over finite generators, exhaustively. `jac relate` reruns a program under schedule, secret or grant variation and reports any difference under a declared observation policy, and `jac review run` (on main, after 0.3.0) compares two versions of an entry over declared cases with grouped differences and replayable witnesses.
- **Governance as effects.** Audit records and approvals are ordinary effects with canonical hash-chain carriers and approval handlers, so a governed workflow is checked and tested with the same machinery as any other program.

## Maturity.

At 0.3.0 (7 October 2026), the project publishes Linux x86-64 and macOS binaries, an installer and a release evidence pack. Its README calls Jacquard a research prototype rather than a production language and points to `docs/release/0.3/LIMITS.md` for the boundary. A real network adapter does not ship; the networking examples run against deterministic stubs, scripted responses, recorded traces or probability models. Exhaustive checking and exact enumeration are bounded by explicit budgets: a uniform distribution enumerates at most 10,000 values, and larger models fall back to seeded sampling or likelihood weighting, with results labelled accordingly. The 0.3 release decision records 1,201 Alcotest/QCheck cases and 79 transcript tests on main. Commits carry a single human author, who describes development as largely model-assisted; recent pull requests record Codex and Claude reviews of each change.

## Agent tooling.

`docs/SKILL.md` (about 43 KB) states that it covers installing Jacquard and writing, checking, running, testing and compiling `.jac` programs without a repository checkout. `AGENTS.md` orients agents working on the implementation. Every diagnostic carries a stable code, a cause and a next step, catalogued in `docs/errors.md`, and the CLI emits them as JSON with `--diagnostic-format json-v1`. There is no MCP server and no model-call effect; a separate host worker protocol carries the boundary to external systems.
