---
name: Thermite
camp: verification
spans_camps: [syntactic]
one_liner: "Contract-first language with mandatory req, ens, and fx clauses; Forge reports per-obligation assurance through Verus, bounded checking, runtime contracts, or Lean-checked reconstruction."
url: https://github.com/dollspace-gay/Thermite
repo: dollspace-gay/Thermite
paper: null
author: dollspace-gay and maxinelevesque
implementation_language: Rust and Lean 4
compilation_target: "Rust; native Linux executables and freestanding libraries via rustc"
license: MIT
maturity: working_compiler
date_appeared: 2026-06
agent_tooling:
  - THERMITE.skill.md
  - forge skill
  - forge goal / forge fill
  - structured JSON certificates and diagnostics
  - .claude/agents/
key_idea: |
  Treat verification as a per-obligation evidence record rather than a binary compiler verdict. Every function declares its precondition, postcondition, and permitted effects; Forge records whether each clause received checked reconstruction, an all-input proof, bounded checking, runtime enforcement, or an explicit trust escape. Counterexamples remain failures rather than being relabelled as a lower assurance result.
crossrefs:
  - slug: vera
    name: Vera
    camp: verification
    relation: "Both require contracts and effects on every function and expose machine-oriented diagnostics. Vera removes parameter names and targets WebAssembly; Thermite keeps a Rust-shaped surface, lowers through Rust, and records a separate assurance level and trust profile for each obligation."
  - slug: aver
    name: Aver
    camp: verification
    relation: "Both keep verification artefacts beside the function and provide agent-facing language references. Aver uses prose intent and colocated verify blocks with Lean and Dafny export; Thermite uses preconditions, postconditions, and an assurance ladder whose checked-reconstruction routes terminate in Lean."
history:
  - when: "Jun 2026"
    what: "First public release of the parser, contract language, Forge checker, Rust lowering path, and assurance certificates."
  - when: "Jul 2026"
    what: "Checked reconstruction expanded to fixed-width bit-vectors and finite relation and array clauses, alongside the existing nonlinear arithmetic route."
---

## The thesis.

Thermite starts from a narrower claim than “the verifier accepted this
program.” A verification result is only useful when it says which obligation
was checked, by which engine, under which assumptions, and what happened when
the engine could not decide. Every function therefore carries three mandatory
clauses: `req` for the caller's obligation, `ens` for the function's guarantee,
and `fx` for its permitted effects. Forge checks each clause and emits a
certificate rather than a single undifferentiated pass bit.

The certificate places evidence on an assurance ladder. L4 denotes an admitted
decidable route with checked reconstruction; L3 is an all-input proof through
Verus/Z3 or the Lean engine; L2 is bounded model checking with its bound
recorded; L1 is an always-active runtime contract; and L0 is the explicit
`#[slag]` trust escape. A timeout may lead to a lower rung, but a concrete
counterexample does not.

<p class="pullquote">A counterexample is a failure, never a downgrade.</p>

## What it looks like.

<div class="code-sample">
  <div class="code">
<pre><span class="kw">fn</span> sum(xs: &amp;[<span class="ty">u32</span>]) -&gt; <span class="ty">u64</span>
  <span class="ct">req</span> xs.len() &lt;= <span class="num">1_000_000</span>
  <span class="ct">ens</span> result == spec_sum(xs)
  <span class="ct">fx</span>  pure
{
  <span class="kw">let mut</span> acc: <span class="ty">u64</span> = <span class="num">0</span>;
  <span class="kw">let mut</span> i: <span class="ty">usize</span> = <span class="num">0</span>;
  <span class="kw">while</span> i &lt; xs.len()
    <span class="ct">inv</span> acc == spec_sum(&amp;xs[..i])
    <span class="ct">dec</span> xs.len() - i
  {
    acc = acc + xs[i] <span class="kw">as</span> <span class="ty">u64</span>;
    i = i + <span class="num">1</span>;
  }
  acc
}</pre>
  </div>
  <p class="caption">The contract, loop invariant, and termination measure are part of the source. <code>result</code> names the return value inside the postcondition.</p>
</div>

## Distinctive moves.

- **Per-obligation assurance.** Forge records the engine and trust profile for
  each clause. The project-level headline is the minimum over the functions in
  scope, so one runtime-only boundary is not hidden behind a proof elsewhere.
- **Checked solver reconstruction.** Eligible nonlinear arithmetic,
  fixed-width bit-vector, and finite first-order relation or array clauses take
  specialised L4 routes, and the three differ in what Lean is asked to check.
  Finite relation and array clauses get genuine certificate replay: an external
  SAT run's LRAT proof is re-checked against a problem Lean recomputes for
  itself. Bit-vector and linear-integer clauses are re-proved in Lean
  independently, with the solver's own proof never consumed. The nonlinear
  route transports a trusted solver answer from the reals to the integers
  through a kernel-checked lemma. The ordinary all-input route through Verus is
  not reconstructed, and the project's trust document enumerates what remains
  trusted.
- **Contract-quality checks.** Mandatory contracts ensure that a specification
  exists, but do not establish that it expresses the author's intent. Forge
  probes for vacuous conditions and tests whether mutations survive the stated
  contract. These checks reduce the space of weak specifications without
  claiming to close the intent gap.
- **Effects cross the compilation boundary.** The `fx` row is checked for
  subsumption up the call graph, then used to derive a seccomp allowlist for
  hosted executables. Rust lowering also retains runtime contract checks,
  keeping the L1 result active when stronger evidence is unavailable. The
  allowlist is per effect verb rather than per resource &mdash; the
  parenthesised path or domain is discarded &mdash; and an open project RFC
  records that a declared `write` to a region the body never touches still
  certifies. The row constrains syscalls rather than confining resources.
- **Holes are a supported workflow.** An agent can write the contract around a
  typed hole, inspect the open goal with `forge goal`, apply a candidate with
  `forge fill`, and check again. A remaining hole prevents the item from being
  built or certified.

## Maturity.

Forge parses and checks Thermite, lowers certified programs to Rust, builds
native hosted executables, and can emit freestanding `no_std` libraries for
the kernel target. The repository ships conformance programs, proof-bearing
gates, translation-validation batteries, and an audit command that re-derives
the recorded trust chain.

The full stack is experimental and operationally substantial. Verus, Lean,
Mathlib, Z3, the reconstruction tools, and optional bounded-checking tooling
sit around the Rust compiler; the complete path is tested on x86-64 Linux.
That makes the proof-bearing setup heavier and less portable than the surface
syntax suggests. The larger limit is semantic rather than operational:
machine checks can establish that an implementation meets its formal
contract, while the correspondence between that contract and the intended
behaviour remains reviewable evidence rather than a closed theorem.

## Agent tooling.

`THERMITE.skill.md` is generated from the same registries and exhaustive
compiler matches that define Forge's accepted surface, with a token-budget
gate to keep the reference bounded. `forge skill` emits the canonical form or
a Claude Code variant and can check a committed copy for drift. The `goal`,
`fill`, and `edit` commands expose the contract-directed repair loop, while
JSON output gives agents structured obligation results, counterexamples,
engine attribution, and certificate data. Repository-local agent files and
the same audit gates used by maintainers document the development workflow,
but they are not required to compile a Thermite program.
