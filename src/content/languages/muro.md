---
name: Muro
camp: verification
spans_camps: []
one_liner: "Explicit affine dependent type theory in which the agent writes every type, motive and proof. Spec, evidence and run are separated by a checked wall, and only run terms are emitted, as Elixir for the BEAM or as C."
url: https://muro-lang.dev
repo: murolang/muro
paper: null
author: Ricardo Corral-Corral
implementation_language: Elixir
compilation_target: Elixir (BEAM) by default; C via --backend c (no machine numbers, closures or raw ν in C); run terms only
license: MIT
maturity: early_implementation
date_appeared: 2026-09
agent_tooling:
  - AGENTS.md
  - llms.txt
  - "For agents manual page (operational contract)"
  - "machine-readable manual manifest (manual/manifest.yml)"
  - "line:col checker errors with expected/context for holes"
key_idea: |
  The agent, not the human, carries the cost of formal verification. Every definition is tagged spec, evidence or run, and the checker forbids
  promotion across the boundary: a spec never becomes evidence, evidence never
  becomes a run. Run and evidence terms are affine and structurally recursive;
  there are no implicits, unification, metavariables or tactics, so every type
  and proof step is written out. Only run terms are emitted, as Elixir or C. The
  rules are stated in Agda, with a --safe proof that the executable checker is
  sound for the typing judgment on a stated fragment.
crossrefs:
  - slug: vera
    name: Vera
    camp: verification
    relation: "Same diagnosis, different discharge. Vera attaches requires/ensures contracts to every function and sends them to Z3, falling back to runtime checks; Muro has no solver and no runtime fallback — the proof is a hand-written evidence term the checker accepts or rejects, then erases."
  - slug: aver
    name: Aver
    camp: verification
    relation: "Both keep the proof beside the program. Aver exports colocated verify blocks to Lean 4 and Dafny; Muro states the proof in its own dependent type theory, in the same file, and treats Agda as the specification of the language rather than as a target for user programs."
---

## The thesis.

Muro's author describes it as agent-centric. The agent absorbs the cognitive load of formal verification, and people get verified programs that run on an established runtime. The language is built to make that division of labour checkable. Nothing is inferred: there are no implicits, unification, metavariables or tactics, so every type, motive and proof step an agent produces is on the page. `mix muro.check` either accepts the file or names each definition that fails.

<p class="pullquote">A spec never becomes evidence. Evidence never becomes a run.</p>

Muro (Spanish for *wall*) is an explicit affine dependent type theory implemented in Elixir, with the rules of the calculus written in Agda under `agda/Muro/`. Every definition is tagged `spec`, `evidence` or `run`. `spec` definitions describe data and signatures and are never compiled. `evidence` definitions are theorems written as ordinary terms (`match`, `rewrite`, `refl`), checked to the same standard as programs and then erased. `run` definitions are programs: affine in their variables unless plain data is marked reusable, and structurally recursive on one argument. From one source, run terms emit as Elixir `def`/`defp` for the BEAM or, with `mix muro.emit --backend c`, as a `.h`/`.c` pair. The author has said more targets are planned; none beyond these two exist yet.

## What it looks like.

<div class="code-sample">
  <div class="code">
<pre><span class="kw">def</span> IsEven : <span class="ct">spec</span> Π (n : <span class="ty">Nat</span>) → <span class="ty">Type</span> := …
<span class="kw">def</span> half : <span class="ct">run</span> Π (n : <span class="ty">Nat</span>) → <span class="ty">Nat</span> := …
<span class="kw">def</span> half_ok : <span class="ct">evidence</span> Π (n : <span class="ty">Nat</span>) → Π (e : IsEven n) →
    {plus (half n) (half n) ≡ n : <span class="ty">Nat</span>} := …</pre>
  </div>
  <p class="caption">From <code>examples/half_ok.muro</code>, as shown on muro-lang.dev. Evenness is a type, <code>half</code> is a program, and the theorem about it is a third definition that is checked but not emitted.</p>
</div>

## Distinctive moves.

- **The wall.** The site's mode table: a `run` term may appear in run, evidence and spec; an `evidence` term in evidence and spec but never in run; a `spec` term only in spec. A proof may talk about a program; a program may not depend on a proof. Passing a value to a theorem does not spend it.
- **Nothing inferred.** No implicits, unification, metavariables or tactics. A `?` hole always fails and reports the expected type and context.
- **Checker soundness in Agda.** `Muro.Soundness` proves, under `--safe`, that when the Elixir-mirrored checker accepts a definition, the inductive judgment derives it — one direction only, on a fragment covering Π, λ, Nat, Unit, Empty, identity, `rewrite` and indexed `data`/`match`. Streams (ν) and Tensor sit outside that proof, and the project states that consistency for closed evidence waits on normalisation.
- **Fuel is not a verdict.** Reduction is bounded by fuel; running out is reported as `out of fuel`, not as acceptance.

## Maturity.

First commit 18 September 2026; published on Hex by the murolang organisation, with a per-release changelog. The C backend (`Muro.Emit.C`) landed on 1 October 2026 and is narrower than the Elixir one. It handles `Nat`, `Unit`, user and indexed data, `match` as `switch`, and `run` streams as seed-plus-step structs. It refuses `I64`/`F32`/`Tensor` (`c:machine`), closures and unapplied lambdas (`c:lambda`), and `Always`, `~` or raw `ν` inside a `run` (`c:stream`). Allocation goes through an overridable `MURO_ALLOC`. CI runs the Elixir tests, including C tests that compile the output with `cc`, and `make agda` on every push. Examples include Vec/Fin lookup without runtime bounds checks, streams with bisimulation, Nx-backed machine numbers, and a reinforcement-learning library (CSHRL) whose environments prove ranking theorems and emit an agent as an Elixir `Stream`. The manual's Limits page lists what the checker refuses.

## Agent tooling.

The README states that Muro is built for agents to write, with the agent carrying the load of formal verification. A root `AGENTS.md` condenses the manual's *For agents* page. It separates two jobs (writing a `.muro` program versus changing the kernel), lists allowed and forbidden edits and the exact commands (including `--fuel` and emit for both backends), and instructs agents to "copy syntax from `examples/`, not from memory". It also records practical pitfalls: parenthesising a multi-line `match` used as an argument, an affine reuse being reported as non-descending recursion, branch order following constructor order, erased guards not ruling out `run` branches, and slow unary `Nat` constants. The repository ships an `llms.txt` index of the manual, and `manual/manifest.yml` is a machine-readable index of the same pages. Diagnostics are plain text with `line:col` positions, and holes print the expected type and context. There is no SKILL.md, MCP server or JSON diagnostic output.
