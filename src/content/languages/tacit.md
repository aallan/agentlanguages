---
name: Tacit
camp: syntactic
spans_camps: [verification]
one_liner: "AST as the source of truth. Canonical byte-exact text, BLAKE3-addressed definitions, DeBruijn indices, typed Hole nodes for malformed code, and explicit effects in function signatures."
url: https://github.com/weetster/tacit
repo: weetster/tacit
paper: null
author: weetster
implementation_language: Rust
compilation_target: LLVM IR / native (x86_64 Linux)
license: Apache-2.0 OR MIT
maturity: working_compiler
date_appeared: 2026-04
agent_tooling:
  - AGENTS.md
  - CLAUDE.md
key_idea: |
  Tacit treats human-oriented surface syntax as a lossy intermediate. The AST
  is the authoritative artefact; every valid AST has exactly one canonical
  text serialisation, definitions are content-addressed by the BLAKE3 hash of
  that canonical form, variable references are DeBruijn indices, and parser
  errors produce typed `Hole` nodes with structured diagnostics rather than
  failing the parse. Effects are explicit in function signatures.
crossrefs:
  - slug: magpie
    name: Magpie
    camp: syntactic
    relation: "Closest neighbour in the same camp. Magpie surfaces SSA as the textual source; Tacit goes a step further and declares the text itself non-authoritative &mdash; the <code>.tac</code> file is a canonical projection of the AST, not the source. Both pay a token cost to strip ambiguity."
  - slug: x07
    name: X07
    camp: syntactic
    relation: "Same direction along the &lsquo;text is lossy&rsquo; axis. X07 stores programs as canonical JSON ASTs and edits them with JSON Patch; Tacit stores them as canonical text projected from the AST, with BLAKE3-addressed identity. Different surfaces, same diagnosis."
  - slug: vera
    name: Vera
    camp: verification
    relation: "Cross-camp foil on names. Vera abolishes parameter names entirely in favour of typed DeBruijn slots (<code>@Int.0</code>); Tacit keeps display names as sidecar metadata but uses DeBruijn indices in canonical form. Both treat names as a source of model error rather than a feature."
  - slug: mog
    name: Mog
    camp: syntactic
    relation: "Adjacent on the embedding angle. Mog is a small embedded language with a capability system and a sub-3,200-token spec; Tacit ships a constrained host-interface ABI for a Rust host and explicitly defers capabilities to Tacit-Full. Different bets on whether capability tracking belongs in v1."
---

## The thesis.

Tacit's diagnosis is that text-based source forces models to maintain stylistic conventions, name choices, and whitespace that the compiler immediately discards. The project's response is to make the AST the canonical artefact and treat text as a derived view. The repository's README states the position directly: &ldquo;The AST is the source of truth. Tacit does not treat a human-oriented surface syntax as the authoritative program representation.&rdquo;

<p class="pullquote">If human readability is not the primary constraint, a language can optimise for three things at once.</p>

Two views render the same tree: a dense **authoring view** sized for model token budgets, and an **inspection view** layered for debugging and human review. Both round-trip losslessly through a JSON sidecar (`.tacd`). Canonical text is byte-exact &mdash; there is exactly one serialisation per AST, which eliminates formatter debates and makes hashing meaningful. Definitions are identified by the BLAKE3 hash of their canonical text; display names live in the sidecar and carry no semantic weight. Variable references use DeBruijn indices in canonical form. The cross-camp move is the verification-adjacent effect lattice: Tacit-Lite tracks `IO` / `Alloc` / `Mut` / `Div` in signatures, and unit boundaries must declare type and effect rows explicitly.

## What it looks like.

```tacit
unit Math {
  import inc : Int -> Int
    from blake3:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef;

  private double : Int -> Int =
    lambda x. @add x x;

  export public add_two : Int -> Int =
    lambda x. inc (inc x);
}
```

Imports name exact `blake3:<64-hex>` definition hashes, not paths or version ranges. Visibility (`public` / `package` / `private`) is part of the artefact. The display names `x`, `inc`, `double` are sidecar metadata; in canonical form references are DeBruijn indices.

## Distinctive moves.

- **AST as authoritative source.** The on-disk `.tac` file is the byte-exact canonical projection of the tree; comments and free-form formatting are not in the language. Names, field order, and type/effect hints live in a `.tacd` JSON sidecar.
- **Content-addressed definitions.** Imports resolve to BLAKE3 hashes, not names. Renaming a definition leaves its hash unchanged; changing its signature, body, or referenced hashes produces a new identity. Package manifests pin a hash-indexed local cache.
- **Typed `Hole` nodes instead of parse failures.** Malformed code reduces to a `Hole` node with a structured diagnostic and a type slot, so downstream tools can keep operating on partial programs (ADR 0040, landed in Phase 2).
- **Explicit effect rows on boundaries.** Tacit-Lite's fixed lattice is `IO` / `Alloc` / `Mut` / `Div`; effect signatures are mandatory at unit exports and inferred locally elsewhere. Tacit-Full (refinement types, capability-based security, handlers) is reserved as a roadmap, not shipped.
- **Toolchain pin as a first-class artefact.** `tacit init` writes a `tacit-toolchain.toml` that pins toolchain, primer, and bundled stdlib hashes; every package-aware command refuses to run on a mismatched pin and surfaces a `toolchain-pin-*` diagnostic.

## Maturity.

A Rust workspace (five crates: `tacit-canonical`, `tacit-views`, `tacit-typecheck`, `tacit-codegen`, `tacit-cli`) at v0.7.7, released 19 May 2026. Apache-2.0 / MIT dual-licensed; 237 commits, 3 stars, 2 forks at time of cataloguing. The decision log runs to ~90 ADRs; Phase 6 was frozen by [ADR 0089](https://github.com/weetster/tacit/blob/main/decisions/0089-phase-6-frozen.md) on 2026-05-17, closing modules/units, package manifests with hash-pinned lockfiles, package tests with stable `tacit-test-v1` JSON output, fixed-width integers with wrapping/checked/saturating arithmetic, typed mutable-memory handles, source-level stdlib packages (`tacit.core`, `.bytes`, `.array`, `.text`, `.collections`, `.io`), and a constrained host-interface ABI with generated C headers and Rust bindings. A Rust embedding demo links a Tacit kernel as a static library. Phase 7 is the next planned phase; debugger, diff/blame, IDE, public registry, and arbitrary FFI are explicitly out of scope until a later ADR. LLVM 19 is pinned via `inkwell`; published release artefacts target Linux x86_64 with a glibc 2.35 floor.

## Agent tooling.

`AGENTS.md` (1.7 KB) carries the Codex-facing sealed-corpus guardrail and a pointer to `CLAUDE.md`. `CLAUDE.md` (~20 KB) functions as a full development guide rather than a SKILL.md &mdash; it enumerates frozen artefacts, ground rules, the file-extension contract (`.tac` / `.tacd` / `.taca`), and the per-phase delivered surface. The toolchain ships its own primer: `tacit primer` prints the byte-pinned Tacit-Lite primer, and `tacit primer --search` / `--list-sections` / `--section <id>` support selective disclosure designed to fit a model's context window without flooding it. Diagnostics, package tests, and `tacit version` all emit stable JSON.
