---
name: Plasm
camp: orchestration
spans_camps: [syntactic]
one_liner: "Catalog-hosted path expressions over typed API graphs, with session-scoped opaque symbols, dry-run execution plans, and federated multi-API sessions."
url: https://plasm.tools
repo: PlasmTools/plasm-core
paper: null
author: Ryan Roberts
implementation_language: Rust
compilation_target: Native binaries (HTTP/API execution plans)
license: Business Source License 1.1
maturity: working_compiler
date_appeared: 2026-04
agent_tooling:
  - AGENTS.md
  - CLAUDE.md
  - SKILL.md
  - MCP server (plasm_context, plasm, plasm_run)
  - Teaching TSV (DOMAIN symbol map)
key_idea: |
  APIs are authored as typed capability graphs (CGS); agents write compact
  path-expression programs against a live teaching table of opaque e#/m#/p#/r#
  symbols instead of memorizing vendor JSON schemas. Programs lower to
  reviewable execution plans (dry-run before live HTTP), with federated
  sessions keeping one append-only symbol space across multiple catalogs.
crossrefs:
  - slug: boruna
    name: Boruna
    camp: orchestration
    relation: "Both separate plan from live execution and ship MCP as the agent surface. Boruna gates bytecode effects and hash-chains evidence; Plasm gates HTTP/API effects via CGS capabilities and dry-run plans."
  - slug: pact
    name: Pact
    camp: verification
    relation: "Pact puts intent and effects in function signatures for web apps; Plasm puts domain vocabulary in catalog graphs and keeps agent programs token-compact via symbol tuning."
  - slug: plumbing
    name: Plumbing
    camp: adjacent
    relation: "Plumbing types the wiring between agents; Plasm types the data and effects agents request from external APIs once wired."
---

## The thesis.

Plasm treats the agent integration problem as a **language and plan** problem, not a transport problem. MCP and HTTP give agents a common way to call tools; Plasm asks what **typed domain** those calls should compose over. APIs are authored as **Capability Graph Schemas (CGS)**: entities, relations, queries, searches, and declared effects mapped to real HTTP or GraphQL via CML templates. Agents do not memorize OpenAPI field names per vendor — they copy opaque **`e#` / `m#` / `p#` / `r#`** symbols from a live **DOMAIN teaching table** (TSV) and write **path-expression programs** that the runtime type-checks and lowers to an execution DAG.

**Plan before live HTTP.** The MCP tools **`plasm`** (dry-run) and **`plasm_run`** (execute) share the same program string. The agent reviews a structured plan — which capabilities fire, in what order, with what row shapes — before any mutating call. This is orchestration-camp discipline applied to multi-API row composition rather than bytecode workflows.

## What it looks like.

```text
issues = e1{p46="open"}.page_size(50)
labels = issues.r3
report = labels[p50] <<RPT
{% for r in rows %}{{ r.p50 }}
{% endfor %}
RPT
sent = e1.m13(p91=report.content)
issues, sent
```

Symbols are **session-local**: `e1` might mean GitHub `Issue` in one federated session and Linear `Issue` as `e2` when both catalogs are seeded. The grammar rules are stable; the vocabulary is **catalog-parameterized** (like SQL over a schema). Canonical surface spec: [Plasm language definition](https://plasmtools.github.io/plasm-core/reference/plasm-language-definition/).

## Distinctive moves.

- **Teaching TSV, not raw schema.** DOMAIN emits valid expression exemplars plus a compact symbol map. **Symbol tuning** renames wire tokens to short opaque IDs to save context — notation on the same grammar, not a second language tier.
- **Incremental DOMAIN waves.** Federated sessions append entities and capabilities monotonically; `e#`/`m#`/`p#`/`r#` stay append-only within a logical session.
- **Dry-run gate.** `plasm_context` opens the session; `plasm` validates; `plasm_run` performs live execution and may attach run snapshot URIs for audit.
- **Capability-scoped row validation.** Postfix transforms such as `.group_by` validate against the **upstream capability's projected fields** (explicit `provides:` in CGS), not the full entity — so search-then-aggregate stays honest when search returns a subset of fields.
- **Deterministic semantic correction.** Parse failures on predicate fields can rewrite to canonical wire names when the domain lexicon has a unique match; ambiguous cases return structured recovery hints instead of silent nulls.

## Maturity.

Open-source workspace **`PlasmTools/plasm-core`**, Rust compiler/runtime, v0.1.x releases. Conformance is an executable **`plasm_language_matrix`** e2e suite (parse → DAG → dry → live Hermit) against dedicated fixtures — not production API catalogs. Dozens of packaged API catalogs (GitHub, Linear, Notion, …) ship as CGS + mappings. License is **Business Source License 1.1** (non-production OSS use permitted under Additional Use Grant). A Lean-oriented formal sketch exists in the language definition; it is not a complete verification story — camp fit is **orchestration** with **syntactic** secondary (symbol tuning), not SMT/refinement typing.

## Agent tooling.

**MCP:** `plasm_context` (session + teaching TSV), `plasm` (plan-only), `plasm_run` (live), `discover_capabilities`. **Repo guidance:** root `AGENTS.md`, `CLAUDE.md`, and the `plasm-authoring` skill suite for catalog authoring. **Eval:** `plasm-eval` drives NL cases against DOMAIN with deterministic coverage reporting. **HTTP / CLI:** discovery, execute, and the `plasm` remote terminal for transport-only clients that own symbol tables locally.

## Where it strains.

- **Catalog-parameterized tokens** — valid entity and field names change per loaded CGS and exposure wave; agents must read the latest TSV, not cache symbols across unrelated sessions.
- **Federated duplicate wire names** — `github/Issue` and `linear/Issue` require distinct `e#` symbols in one session; the runtime stamps `catalog_entry_id` on dispatch, but teaching must never collide opaque IDs.
- **No first-class `:llm` in the surface language** — model calls live in REPL/eval harnesses; Plasm programs target **API effects**, not typed Inference effects.
- **Product surface area** — CGS authoring, CML mappings, MCP host, and traces are part of the shipped stack; the catalogue entry is the **agent-facing program language** hosted by that runtime.

Compared to **Code Mode**-style "write code against one API," Plasm optimizes for **multi-catalog row workflows** under governance: typed graphs, composable row sets, and reviewable plans rather than an unconstrained sandbox script.
