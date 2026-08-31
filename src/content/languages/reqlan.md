---
name: reqlan
camp: verification
spans_camps:
  - syntactic
one_liner: "Named requirement ideas in .rq files, linked to symbols and tests. Dangling edges fail the checker; the same index feeds an LSP and MCP."
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
  The model does not need to keep the specification in its head. The graph
  has to still resolve. Each idea is a named handle with a short body and
  edges to other ideas, files, symbols, and tests. The same index feeds an
  LSP, a CLI checker that fails on dangling references, and an MCP server
  so an agent can query a neighbourhood instead of ingesting a specifications
  folder. Implementation stays in the host language; reqlan sits beside it.
crossrefs:
  - slug: intent
    name: Intent
    camp: verification
    relation: "Closest design relative. Same diagnosis that named natural-language goals should resolve to checkable artefacts. Intent compiles those goals to Rust, JavaScript, and WebAssembly and discharges contracts with Z3. reqlan leaves the implementation in the host language and only checks that the graph edges still exist."
  - slug: vera
    name: Vera
    camp: verification
    relation: "Same camp slogan, different discharge. Vera's thesis is that the model does not need to be right, it needs to be checkable, and Z3 plus runtime guards do the catching. reqlan takes that diagnosis to the requirement graph beside existing code: a dangling idea, file, symbol, or test edge is a diagnostic, not an SMT obligation."
  - slug: tacit
    name: Tacit
    camp: syntactic
    relation: "Cross-camp foil on names. Tacit treats names as a source of model error (De Bruijn indices, BLAKE3-addressed definitions, display names as sidecar). reqlan treats the name as the feature: session_refresh is the stable handle an agent authors and the checker resolves. That is the syntactic touch; the checker is what keeps it in verification."
  - slug: spec
    name: Spec
    camp: unclassified
    relation: "Near-neighbours on the word spec, different artefacts. Spec is a draft multi-agent IR with a browser POC and specialist roles. reqlan is a working .rq language checked into the application repo, with no specialist-agent pipeline."
  - slug: marsha
    name: Marsha
    camp: orchestration
    relation: "Marsha treats English plus examples as a source the LLM compiles away into Python. reqlan is not compiled away: the .rq graph remains the artefact agents read, and the checker enforces it."
history:
  - when: "June 2026"
    what: "Public GitHub repository and reqlan.com appear."
---

## The thesis.

reqlan takes the verification camp's diagnosis and applies it to the requirement graph that sits beside existing code, not to a new executable language. LLMs will keep rewriting the paragraph that was supposed to constrain a function. The compiler's job is to catch the drift: every idea has a stable name, every edge to a file, a symbol, or a test is resolved, and a dangling reference fails `reqlan check` and the language server. The model does not have to get the neighbourhood right. The neighbourhood has to be checkable.

<p class="pullquote">A dangling edge is a compile error. A rewritten paragraph is not.</p>

The syntactic camp's move is here too, as a secondary. An idea is a handle — `session_refresh` rather than a paragraph that will be rewritten the next time someone pastes a specification into chat — so each token has one job. What keeps reqlan out of that camp, and in verification, is the checker. The catalogue's syntactic camp is defined by the absence of any mechanism for the compiler to catch what the model gets wrong. reqlan has one: unresolved edges fail closed.

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

- **Checkable references, not proofs.** `reqlan check` resolves idea, file, symbol, and test edges. A proven-by clause is a named binding, not a discharged obligation. The checker will tell you the test no longer exists; it will not tell you the test still means what the idea says. That is the honest ceiling: mechanically checkable, not SMT.
- **Names as handles.** The syntactic touch is the unit itself. `session_refresh` is one token with one job, not a paragraph of specification prose. Agents author the handle; the checker keeps it from drifting off the code it points at.
- **One index, three surfaces.** The VS Code / Cursor extension, the CLI, and the MCP server read the same graph. MCP tools include search, list, and file-context queries so a coding agent can pull a neighbourhood by hop distance.
- **Sit beside existing code.** `.rq` files are committed next to the implementation. There is no lowering to a new runtime and no specialist-agent pipeline. The project does not replace industrial RM tools or markdown process kits, and it is not a qualified requirements-management tool.

## Maturity.

The public repository dates from June 2026.
A Langium grammar, editor extension with an LSP, CLI, native Rust core, MCP server, and HTML export all ship.
Parse and check run on a workspace marker directory; broken references come back as diagnostics.

It is not a general-purpose programming language or a theorem prover. The file extension collides with an existing RDF query language. The graph is only as good as the edges people keep drawing.

## Agent tooling.

The MCP server queries the same index the editor uses. The CLI emits JSON for analyse, check, search, and click. The language server offers go-to-definition on idea names, diagnostics on dangling edges, and rq: comment references in TypeScript, Python, and Markdown. There is no compiler-bundled SKILL.md of the kind Vow ships; the MCP tools and JSON CLI are the structured interface.
