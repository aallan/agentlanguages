---
name: Sigil
camp: verification
spans_camps: []
one_liner: "Every function declares its intent, contracts and effects, and the declared effect set must match the inferred one exactly. Humans review the compiler-generated spec rather than the code."
url: https://github.com/goodnasubi/sigil
repo: goodnasubi/sigil
paper: null
author: Takashi Ikeda
implementation_language: Rust
compilation_target: Native static binary (Linux x86-64, via Cranelift); reference evaluator for the language IR (SIR)
license: MIT
maturity: working_compiler
date_appeared: 2026-10
agent_tooling:
  - AGENTS.md
  - JSON diagnostics (sigil check --json)
  - machine-readable spec output (sigil spec --json)
  - language server with spec-on-hover (sigil lsp)
key_idea: |
  Sigil inverts the review flow for agent-written code. Every function
  carries a declaration block — intent, requires, ensures, effects — and
  the human reviews that block, rendered by the compiler as the module's
  spec, instead of the implementation. The checker then holds the code
  to the declarations: the declared effect set must equal the inferred
  one, neither a subset nor a superset, and unchecked regions exist only
  inside a declared trust base the human enables explicitly.
crossrefs:
  - slug: thermite
    name: Thermite
    camp: verification
    relation: "Same camp, different artefact under review. Both make contracts and effects mandatory on every function; Thermite records an assurance level per obligation, while Sigil fixes the human's attention on one artefact — the generated spec — and makes the effect declaration exact rather than graded."
  - slug: vera
    name: Vera
    camp: verification
    relation: "Mandatory contracts again, opposite treatment of the surface. Vera removes variable names and discharges obligations with Z3; Sigil keeps names, adds a natural-language intent clause to every function because the intent is part of what the human reviews, and discharges obligations by checking and evaluation rather than SMT."
  - slug: zero
    name: Zero
    camp: verification
    relation: "Both treat authority as something to be declared rather than ambient. Zero hands the program a capability object at main; Sigil's analogue is per-module trust declarations plus exact effect sets, with the trusted base enumerable from the source and enabled per invocation."
history:
  - when: "Oct 2026"
    what: "First public commits. Milestones M0–M6 (syntax, checking, ownership, standard library and effects runtime, native output, machine-readable spec and language server) complete the core language."
  - when: "Nov 2026"
    what: "Worked examples reach 09 (enums with exhaustive matching). The cryptography series opens with the constant-time checker, and ADR 0027 records safety design principles for agent-written code."
---

## The thesis.

Sigil starts from a division of labour rather than a syntax. If agents
write code faster than humans can read it, the artefact a human signs
off has to be smaller than the code and stronger than a summary. Sigil
makes that artefact the per-function declaration block — `intent` (what
the function is for, in natural language), `requires`, `ensures` and
`effects` — and makes it load-bearing. The compiler renders the blocks
of a module as its spec (`sigil spec`), which is what the human
reviews; the implementation is then checked against them.

<p class="pullquote">The model writes the code. The human signs the spec.</p>

The project is developed the way it expects programs to be written.
Several independent AI agents from different model families implement
the compiler itself under a public protocol recorded in the
repository's `AGENTS.md`: work starts from an issue, one agent locks
it, lanes partition the tree so parallel work does not collide, and
changes that affect the specification require human approval. The
repository history is therefore also a record of agents building a
language for agents, with the human reviewing at the spec level
throughout.

## What it looks like.

<div class="code-sample">
  <div class="code">
<pre><span class="kw">fn</span> load_prices(path: <span class="ty">Path</span>) -&gt; <span class="ty">Result</span>&lt;<span class="ty">List</span>&lt;<span class="ty">Int</span>&gt;, <span class="ty">IoError</span>&gt;
  <span class="ct">intent</span> <span class="str">"価格の一覧をファイルから読む"</span>
  <span class="ct">requires</span> !path.is_empty()
  <span class="ct">ensures</span> none
  <span class="ct">effects</span> console, fs.read
{
  console.log(&amp;<span class="str">"loading prices"</span>);
  <span class="kw">let</span> text = fs.read(&amp;path)?;
  <span class="kw">return</span> Ok(text.lines().map(|line| line.parse_int().unwrap_or(0)));
}</pre>
  </div>
  <p class="caption">The <code>effects</code> clause is not documentation. The checker infers the function's actual effects and rejects the program if the declared and inferred sets differ in either direction; a pure function declares <code>effects none</code>, and a higher-order function can declare <code>effects of(f)</code> to inherit an argument's effects. Examples ship as pairs: the <code>.sigil</code> source and the <code>.spec</code> view a reviewer approves.</p>
</div>

## Distinctive moves.

- **Exact effect matching.** Declared effects are compared with
  inferred effects for equality, not containment. Hiding an effect and
  declaring an unused one are both errors, so the spec a human reads
  cannot silently drift from what the code does.
- **The spec is a compiler output.** `sigil spec` renders a module's
  contract surface for review, `sigil spec --json` emits it
  structurally, and the language server returns the same spec on hover,
  so "what was promised here" is a query rather than a re-read.
- **Trust is declared, not assumed.** Modules carry a trust level
  (`trust none` by default). Regions exempt from checking exist only
  inside a declared trust base, enabled per invocation with
  `--trust-base`; what runs unchecked is enumerable from the source.
- **Constant-time discipline for cryptography.** A dedicated checker in
  the test suite runs a taint analysis over the IR — secret values must
  not reach branches, indices or non-constant-time operations — and
  differential checks against the native backend. ADR 0027 generalises
  the stance: information flow tracked at the type level, capability
  orientation with no ambient authority, no dangerous defaults, and
  diagnostics a machine can read.

## Maturity.

The core language is complete: parser, formatter, type and effect
checker, ownership and borrow checker, standard library, the SIR
evaluator behind `sigil run`, and `sigil build`, which emits a single
static native binary whose behaviour is tested to agree with the
evaluator. The project reports a test suite passing 1,090 tests at the
November 2026 milestone, growing with each feature. Worked examples
ship in source-plus-spec pairs covering averages, port reading,
ownership, effects, control flow, concurrency, bytes and bit
operations, traits, and enums with exhaustive matching. In progress:
the standard library's cryptography series — the constant-time
foundations are merged; a `Secret` type that zeroizes on drop and has
no display representation, and SHA-256, are in development. Longer
phases in the roadmap (server, database and OS targets) are recorded
as design ADRs, not shipped features.

## Agent tooling.

The repository itself is part of the tooling surface: a public
`AGENTS.md` defines how agent contributors lock issues, name branches,
partition files into lanes and mark commits, and pull requests must
name the issue they close. For writing Sigil, the compiler offers its
spec and diagnostics as JSON — `sigil spec --json`, and
`sigil check --json` with kind, phase, position and message fields —
and an LSP server whose hover returns the spec of the declaration
under the cursor, so an agent can check a promise without re-reading
the implementation that made it.
