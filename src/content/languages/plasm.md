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
  - plasm CLI client (init, search, context, run)
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
  - slug: lume
    name: Lume
    camp: syntactic
    relation: "Both treat context budget as a first-class design constraint. Lume packs docs and diagnostics under a caller-set token cap; Plasm compresses vendor API vocabulary into session-local e#/p#/r# symbols and a live DOMAIN teaching TSV."
  - slug: plumbing
    name: Plumbing
    camp: adjacent
    relation: "Plumbing types the wiring between agents; Plasm types the data and effects agents request from external APIs once wired."
---

## The thesis.

Plasm treats the agent integration problem as a **language and plan** problem, not a transport problem. MCP and HTTP give agents a common way to call tools; Plasm asks what **typed domain** those calls should compose over. APIs are authored as **Capability Graph Schemas (CGS)**: entities, relations, queries, searches, and declared effects mapped to real HTTP or GraphQL via CML templates. Agents do not memorize OpenAPI field names per vendor — they copy opaque **`e#` / `m#` / `p#` / `r#`** symbols from a live **DOMAIN teaching table** (TSV) and write **path-expression programs** that the runtime type-checks and lowers to an execution DAG.

**Plan before live HTTP.** The same program string is reviewed dry-run, then executed live. Agents reach that flow through **two execution environments**: **Streamable HTTP MCP** (`plasm_context` → `plasm` → `plasm_run`, server-held session and teaching TSV) and the **`plasm` CLI client** (`init` → `search` → `context` → `run` against a remote HTTP host, with the **client-owned** symbol table under `.plasm/`). Both compile the same surface language to the same plan IR; they differ in transport and where DOMAIN symbols are authoritative.

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
- **Dry-run gate.** Open context (`plasm_context` or `plasm context`), plan with `plasm`, execute with `plasm_run` / `plasm run` after review; run snapshots may attach for audit.
- **Capability-scoped row validation.** Postfix transforms such as `.group_by` validate against the **upstream capability's projected fields** (explicit `provides:` in CGS), not the full entity — so search-then-aggregate stays honest when search returns a subset of fields.
- **Deterministic semantic correction.** Parse failures on predicate fields can rewrite to canonical wire names when the domain lexicon has a unique match; ambiguous cases return structured recovery hints instead of silent nulls.

## Maturity.

Open-source workspace **`PlasmTools/plasm-core`**, Rust compiler/runtime, v0.1.x releases. Conformance is an executable **`plasm_language_matrix`** e2e suite (parse → DAG → dry → live Hermit) against dedicated fixtures — not production API catalogs. Dozens of packaged API catalogs (GitHub, Linear, Notion, …) ship as CGS + mappings. License is **Business Source License 1.1** (non-production OSS use permitted under Additional Use Grant). A Lean-oriented formal sketch exists in the language definition; it is not a complete verification story — camp fit is **orchestration** with **syntactic** secondary (symbol tuning), not SMT/refinement typing.

## Agent tooling.

Plasm ships **two agent execution environments** for the same language:

- **MCP (in-process with the host).** `plasm_context` opens or extends a logical session and returns teaching TSV; `plasm` dry-runs; `plasm_run` executes live. The MCP host holds session state and the append-only symbol map.
- **`plasm` CLI (remote HTTP terminal).** `plasm init` configures a server profile; `plasm search` discovers catalogs; `plasm context` builds a **client-local** DOMAIN table (`domain.tsv` under `.plasm/`); `plasm run` expands programs against that table and POSTs to the server's execute API. Suited to CI, scripts, and agents that prefer a transport-only boundary.

**Authoring and eval:** root `AGENTS.md`, `CLAUDE.md`, and the `plasm-authoring` skill suite for CGS catalogs; `plasm-eval` for NL conformance against DOMAIN. **`plasm-server`** / **`plasm-mcp`** provide the HTTP + MCP listener; **`plasm-repl`** remains a local schema debugger, not the remote agent path.

## Design constraints.

- **Catalog-parameterized tokens** — valid entity and field names change per loaded CGS and exposure wave; agents must read the latest TSV, not cache symbols across unrelated sessions.
- **Federated duplicate wire names** — `github/Issue` and `linear/Issue` require distinct `e#` symbols in one session; the runtime stamps `catalog_entry_id` on dispatch, but teaching must never collide opaque IDs.
- **Product surface area** — CGS authoring, CML mappings, MCP host, and traces are part of the shipped stack; the catalogue entry is the **agent-facing program language** hosted by that runtime.

Compared to **Code Mode**-style "write code against one API," Plasm optimizes for **multi-catalog row workflows** under governance: typed graphs, composable row sets, and reviewable plans rather than an unconstrained sandbox script.
