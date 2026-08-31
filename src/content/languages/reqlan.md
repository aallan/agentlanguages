---
name: reqlan
camp: adjacent
spans_camps:
  - syntactic
one_liner: "Named requirement ideas in .rq files, linked to symbols and tests, with an LSP and MCP on the same index."
url: https://reqlan.com
repo: littletuna4/reqlan
paper: null
author: Tony Cerqui
implementation_language: TypeScript (Langium) and Rust
compilation_target: Requirement-graph index (CLI, LSP, MCP) and static HTML export
license: AGPL-3.0-only
maturity: working_compiler
date_appeared: 2026-06
agent_tooling:
  - MCP server (@reqlan/mcp)
  - VS Code / Cursor language server
  - CLI with JSON output (parse, check, analyse, search, click, export)
key_idea: |
  reqlan is a language for a requirement graph that sits next to existing
  code rather than compiling to a new runtime. Each idea has a stable name,
  a short body, and edges to other ideas, files, symbols, and tests. The
  same index feeds an LSP, a CLI checker that fails on dangling references,
  and an MCP server so an agent can query a neighbourhood instead of
  ingesting a specifications folder.
crossrefs:
  - slug: intent
    name: Intent
    camp: verification
    relation: "Same diagnosis that named natural-language goals should resolve to checkable artefacts. Intent compiles those goals to Rust, JavaScript, and WebAssembly and discharges contracts with Z3. reqlan leaves the implementation in the host language and only checks that the graph edges still exist."
  - slug: spec
    name: Spec
    camp: unclassified
    relation: "Near-neighbours on the word spec, different artefacts. Spec is a draft multi-agent IR with a browser POC and specialist roles. reqlan is a working .rq language checked into the application repo, with no specialist-agent pipeline."
  - slug: plumbing
    name: Plumbing
    camp: adjacent
    relation: "Both ship an MCP server as the agent-facing surface. Plumbing types the wiring between agents. reqlan types the neighbourhood of intent beside application code."
  - slug: marsha
    name: Marsha
    camp: orchestration
    relation: "Marsha treats English plus examples as a source the LLM compiles away into Python. reqlan is not compiled away: the .rq graph remains the artefact agents read, and the checker enforces it."
history:
  - when: "June 2026"
    what: "Public GitHub repository and reqlan.com appear."
---

## The thesis.

reqlan starts from a different unit of analysis than most of this catalogue. The thing an agent should author is not a new executable language, and not a markdown process kit, but a small graph of named ideas that live next to the code they constrain. An idea is a handle: `session_refresh` rather than a paragraph that will be rewritten the next time someone pastes a specification into chat. Edges point at other ideas, at files, at symbols, and at tests. If an edge dangles, the language server and the CLI report it.

<p class="pullquote">The neighbourhood is the unit of context, not the document.</p>

The distinctive move is to keep implementation in the host language. TypeScript, Python, and the rest stay as they are. reqlan adds a graph those files can be hung from, and an index that an LSP, a CLI, and an MCP server all read. Agents author `.rq` and then author ordinary code against it. They do not have to ingest a `specs/` folder to find the rule that still matters.

## What it looks like.

<div class="code-sample">
  <div class="code">
<pre><span class="kw">session_refresh</span> {
    refresh tokens rotate on use
    implemented in [<span class="str">"./src/auth/session.ts"</span>.rotateRefresh]
    proven by [<span class="str">"./src/auth/session.test.ts:rejects reused refresh token"</span>]
    <span class="ct">@status</span> in-progress
    <span class="ct">@tags</span> (auth, security)
}</pre>
  </div>
  <p class="caption">A named idea with edges to a symbol and a named test. Dangling targets fail <code>reqlan check</code> and show up in the editor.</p>
</div>

One-liner ideas omit the braces. Wiki-links (`[session_refresh]`) and file references share the same bracket form. Host-language comments can pin a line back to an idea with `rq:[...]`. Attributes (`@status`, `@tags`, `@todo`) are part of the graph, not YAML sidecar files. The grammar is Langium; the analytical core that walks the graph is Rust, distributed as native host packages.

## Distinctive moves.

- **The graph is the language.** Names, bodies, and edges are the syntax. There is no lowering to SMT, no codegen to a new runtime, and no specialist-agent pipeline. What you write is what the index contains.
- **Checkable references, not proofs.** `reqlan check` resolves idea, file, symbol, and test edges. A proven-by clause is a named binding, not a discharged obligation. The checker will tell you the test no longer exists; it will not tell you the test still means what the idea says.
- **One index, three surfaces.** The VS Code / Cursor extension, the CLI, and the MCP server read the same graph. MCP tools include search, list, and file-context queries so a coding agent can pull a neighbourhood by hop distance.
- **Sit beside existing code.** `.rq` files are committed next to the implementation. The project does not replace industrial RM tools or markdown process kits, and it is not a qualified requirements-management tool.

## Maturity.

The public repository dates from June 2026.
A Langium grammar, editor extension with an LSP, CLI, native Rust core, MCP server, and HTML export all ship.
Parse and check run on a workspace marker directory; broken references come back as diagnostics.

It is not a general-purpose programming language or a theorem prover. The file extension collides with an existing RDF query language. The graph is only as good as the edges people keep drawing.

## Agent tooling.

The MCP server queries the same index the editor uses. The CLI emits JSON for analyse, check, search, and click. The language server offers go-to-definition on idea names, diagnostics on dangling edges, and rq: comment references in TypeScript, Python, and Markdown. There is no compiler-bundled SKILL.md of the kind Vow ships; the MCP tools and JSON CLI are the structured interface.
