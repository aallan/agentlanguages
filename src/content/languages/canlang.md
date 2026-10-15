---
name: Canlang
camp: syntactic
spans_camps:
  - verification
one_liner: "A language for AI agents to build custom business software, with browser forms and MCP tools derived from declared operations and independently authored examples that check their behaviour."
url: https://sodaos.dev/canlang
repo: veighnsche/canlang
paper: null
author: Vince Liem
implementation_language: Rust (compiler), TypeScript (runtime packages)
compilation_target: JavaScript for workerd / Cloudflare Workers
license: MIT
maturity: working_compiler
date_appeared: 2026-10
agent_tooling:
  - AGENTS.md
  - "Structured JSON diagnostics, source spans and stable error codes"
  - "can check / compile / lint / policy / explain"
  - "can fmt and can lsp, with a VS Code-compatible extension"
  - "can docs: a localised reference derived from checked declarations"
  - "can test: compiled inline examples executed through the operation runtime"
  - "can gen: explicit AI generation, saved-output inspection and refinement"
  - "can validate: compilation, build, examples and browser checks without AI"
key_idea: |
  Make the business application the unit of authoring. An agent declares records, access rules, permitted operations and expected outcomes; shared defaults supply standard application machinery, while browser forms and MCP tools derive from the owning operations. The intended saving comes from maintaining fewer separate representations of the same behaviour. Explicit prompts extend the vocabulary and presentation through saved, editable implementations whose contracts remain visible to the compiler.
crossrefs:
  - slug: pact
    name: Pact
    camp: verification
    relation: "Both address the repeated glue around application code. Pact makes intent, effects and error outcomes explicit on functions and routes and bundles HTTP and SQLite; Canlang derives browser forms and application MCP interfaces from records, operations and their declared permissions."
  - slug: ilo
    name: ilo
    camp: syntactic
    relation: "Both seek to reduce the cost of agent-authored code. ilo works on compact general-purpose notation, feedback and retries; Canlang removes repeated business-application structure through canonical operations, shared defaults and interfaces derived from declarations."
  - slug: marsha
    name: Marsha
    camp: orchestration
    relation: "Both use natural-language intent in code generation. Marsha compiles function descriptions and examples into tested Python through an LLM; Canlang uses explicit prompts for checked language extensions and custom presentation, saving their implementation while ordinary scenarios retain authored guards and bodies."
history:
  - when: "Oct 2026"
    what: "The Rust-based business-application toolchain appears publicly. Standalone v0.1.1 ships on 15 October for macOS arm64 and Linux x64/glibc."
---

## The thesis.

Canlang is built around a practical bet: much of the software a company needs consists of records, permissions and workflows tailored to its own operations. It targets companies replacing subscription software with custom business applications. Its intended authors are AI agents. The language gives those agents a compact way to describe business rules, while shared defaults supply standard authentication, teams, storage and interface behaviour.

Take expense approval. A model defines the stored record; a scenario defines who may approve it and under which conditions. The browser form derives its inputs from that scenario. An MCP client invokes the same scenario as an agent tool. Attached inline examples specify an eligible approval, an unauthorised caller and attempted self-approval. Updating a business rule means editing its owning declaration, with fewer separate implementations for an agent to keep aligned.

<p class="pullquote">The form and the agent tool invoke the same business operation.</p>

That is Canlang's syntactic bet: reduce the amount of application structure an agent must invent and repeat. Static types, explicit authority checks and executable examples supply the verification overlap. The language targets tasks, approvals, bookings, invoicing and similar operational software; its [requirements](https://github.com/veighnsche/canlang/blob/main/docs/specification/REQUIREMENTS.md) prioritise economical generation and maintenance without claiming a measured cost advantage.

## What it looks like.

Each package organises code into three sections: `Given` declares data and rules, `When` declares operations, and `Then` declares presentation. Here, a reviewer can approve a submitted expense, but never their own. This excerpt adapts [ExpenseFlow](https://github.com/veighnsche/canlang/blob/main/examples/ExpenseFlow.can); the app header and create/submit workflow are omitted to focus on approval.

<!-- Highlighted with Canlang's editors/vscode/syntaxes/can.tmLanguage.json and token-colors.json, over Cursor Dark High Contrast. -->
<div class="code-sample">
  <div class="code" style="background:#0A0A0A;color:#F0F0F0">
<pre><span style="color:#FFFFFF;font-style:italic;font-weight:700">Given</span>
 <span style="color:#C586C0">role</span> <span style="color:#DCDCAA">reviewer</span>
 <span style="color:#4EC9B0">Expense</span> { <span style="color:#9CDCFE">purpose</span>:<span style="color:#4EC9B0">text</span> <span style="color:#C586C0">trim</span> <span style="color:#9CDCFE">max</span><span style="color:#D6D6DD">=</span><span style="color:#B5CEA8">300</span>, <span style="color:#9CDCFE">amount</span>:<span style="color:#4EC9B0">money</span>,
  <span style="color:#9CDCFE">submitted_by</span>:<span style="color:#4EC9B0">user</span> <span style="color:#9CDCFE">server</span><span style="color:#D6D6DD">=</span><span style="color:#9CDCFE">actor</span>,
  <span style="color:#9CDCFE">status</span>:<span style="color:#4EC9B0">enum</span>(<span style="color:#9CDCFE">draft</span>,<span style="color:#9CDCFE">submitted</span>,<span style="color:#9CDCFE">approved</span>)<span style="color:#D6D6DD">=</span><span style="color:#9CDCFE">draft</span>,
  <span style="color:#9CDCFE">decided_by</span>:<span style="color:#4EC9B0">user?</span>, <span style="color:#9CDCFE">decided_at</span>:<span style="color:#4EC9B0">datetime?</span> }
 <span style="color:#C586C0">policy</span> <span style="color:#4EC9B0">Expense</span> <span style="color:#9CDCFE">read</span><span style="color:#D6D6DD">=</span><span style="color:#9CDCFE">members</span> <span style="color:#9CDCFE">where</span><span style="color:#D6D6DD">=</span><span style="color:#9CDCFE">row</span>.<span style="color:#9CDCFE">submitted_by</span><span style="color:#D6D6DD">==</span><span style="color:#9CDCFE">actor</span>
 <span style="color:#C586C0">policy</span> <span style="color:#4EC9B0">Expense</span> <span style="color:#9CDCFE">read</span><span style="color:#D6D6DD">=</span><span style="color:#9CDCFE">reviewer</span>
 <span style="color:#C586C0">invariant</span> <span style="color:#4EC9B0">Expense</span>: <span style="color:#9CDCFE">row</span>.<span style="color:#9CDCFE">amount</span>.<span style="color:#9CDCFE">minor</span><span style="color:#D6D6DD">&gt;</span><span style="color:#B5CEA8">0</span>
 <span style="color:#C586C0">lock</span> <span style="color:#4EC9B0">Expense</span> <span style="color:#9CDCFE">fields</span><span style="color:#D6D6DD">=</span><span style="color:#9CDCFE">purpose</span>,<span style="color:#9CDCFE">amount</span>,<span style="color:#9CDCFE">submitted_by</span> <span style="color:#9CDCFE">when</span><span style="color:#D6D6DD">=</span><span style="color:#9CDCFE">row</span>.<span style="color:#9CDCFE">status</span><span style="color:#D6D6DD">!=</span><span style="color:#9CDCFE">draft</span>
 <span style="color:#C586C0">lock</span> <span style="color:#4EC9B0">Expense</span> <span style="color:#9CDCFE">fields</span><span style="color:#D6D6DD">=</span><span style="color:#9CDCFE">status</span>,<span style="color:#9CDCFE">decided_by</span>,<span style="color:#9CDCFE">decided_at</span> <span style="color:#9CDCFE">when</span><span style="color:#D6D6DD">=</span><span style="color:#9CDCFE">row</span>.<span style="color:#9CDCFE">status</span><span style="color:#D6D6DD">==</span><span style="color:#9CDCFE">approved</span>
 <span style="color:#C586C0">fixture</span> <span style="color:#9CDCFE">pending</span><span style="color:#D6D6DD">=</span><span style="color:#4EC9B0">Expense</span> {<span style="color:#9CDCFE">purpose</span><span style="color:#D6D6DD">=</span><span style="color:#E394DC">"Travel"</span>,<span style="color:#9CDCFE">amount</span><span style="color:#D6D6DD">=</span><span style="color:#DCDCAA">money</span>(<span style="color:#B5CEA8">25</span>,<span style="color:#E394DC">"EUR"</span>),
  <span style="color:#9CDCFE">submitted_by</span><span style="color:#D6D6DD">=</span><span style="color:#9CDCFE">other</span>,<span style="color:#9CDCFE">status</span><span style="color:#D6D6DD">=</span><span style="color:#9CDCFE">submitted</span>}
<span style="color:#FFFFFF;font-style:italic;font-weight:700">When</span>
<span style="color:#E394DC"> # Approve a submitted expense belonging to another teammate.</span>
 <span style="color:#FFFFFF;font-weight:700">scenario</span> <span style="color:#DCDCAA">approve</span>(<span style="color:#9CDCFE">expense</span>:<span style="color:#4EC9B0">Expense</span>) <span style="color:#9CDCFE">by</span><span style="color:#D6D6DD">=</span><span style="color:#9CDCFE">reviewer</span>
  <span style="color:#FFFFFF;font-weight:700">require</span> <span style="color:#9CDCFE">expense</span>.<span style="color:#9CDCFE">status</span><span style="color:#D6D6DD">==</span><span style="color:#9CDCFE">submitted</span><span style="color:#C586C0"> and</span> <span style="color:#9CDCFE">expense</span>.<span style="color:#9CDCFE">submitted_by</span><span style="color:#D6D6DD">!=</span><span style="color:#9CDCFE">actor</span>
  <span style="color:#FFFFFF;font-weight:700">do</span> <span style="color:#C586C0">set</span> <span style="color:#9CDCFE">expense</span> {<span style="color:#9CDCFE">status</span><span style="color:#D6D6DD">=</span><span style="color:#9CDCFE">approved</span>,<span style="color:#9CDCFE">decided_by</span><span style="color:#D6D6DD">=</span><span style="color:#9CDCFE">actor</span>,<span style="color:#9CDCFE">decided_at</span><span style="color:#D6D6DD">=</span><span style="color:#9CDCFE">now</span>}
  <span style="color:#FFFFFF;font-weight:700">examples</span> <span style="color:#9CDCFE">expense</span><span style="color:#D6D6DD">=</span><span style="color:#9CDCFE">pending</span>
   <span style="color:#9CDCFE">as</span>,<span style="color:#9CDCFE">expense</span>.<span style="color:#9CDCFE">status</span>,<span style="color:#9CDCFE">expense</span>.<span style="color:#9CDCFE">submitted_by</span> <span style="color:#D6D6DD">-&gt;</span> <span style="color:#9CDCFE">expense</span>.<span style="color:#9CDCFE">status</span>,<span style="color:#9CDCFE">expense</span>.<span style="color:#9CDCFE">decided_by</span>
   <span style="color:#9CDCFE">reviewer</span>,<span style="color:#9CDCFE">submitted</span>,<span style="color:#9CDCFE">other</span> <span style="color:#D6D6DD">-&gt;</span> <span style="color:#9CDCFE">approved</span>,<span style="color:#9CDCFE">self</span>
   <span style="color:#9CDCFE">reviewer</span>,<span style="color:#9CDCFE">draft</span>,<span style="color:#9CDCFE">other</span> <span style="color:#D6D6DD">-&gt;</span> <span style="color:#DCDCAA">error</span>(<span style="color:#9CDCFE">rule_failed</span>)
   <span style="color:#9CDCFE">members</span>,<span style="color:#9CDCFE">submitted</span>,<span style="color:#9CDCFE">other</span> <span style="color:#D6D6DD">-&gt;</span> <span style="color:#DCDCAA">error</span>(<span style="color:#9CDCFE">forbidden</span>)
   <span style="color:#9CDCFE">reviewer</span>,<span style="color:#9CDCFE">submitted</span>,<span style="color:#9CDCFE">self</span> <span style="color:#D6D6DD">-&gt;</span> <span style="color:#DCDCAA">error</span>(<span style="color:#9CDCFE">rule_failed</span>)
<span style="color:#FFFFFF;font-style:italic;font-weight:700">Then</span>
 <span style="color:#FFFFFF;font-weight:700">page</span> <span style="color:#E394DC">/</span> <span style="color:#9CDCFE">title</span><span style="color:#D6D6DD">=</span><span style="color:#E394DC">"Expenses"</span>
  <span style="color:#569CD6">list</span> <span style="color:#9CDCFE">Expense</span> <span style="color:#9CDCFE">order</span><span style="color:#D6D6DD">=-</span><span style="color:#9CDCFE">created</span>
<span style="color:#569CD6">   text</span> <span style="color:#9CDCFE">row</span>.<span style="color:#9CDCFE">purpose</span>,<span style="color:#9CDCFE">row</span>.<span style="color:#9CDCFE">amount</span>,<span style="color:#9CDCFE">row</span>.<span style="color:#9CDCFE">status</span>
   <span style="color:#569CD6">form</span> <span style="color:#DCDCAA">approve</span> <span style="color:#9CDCFE">arguments</span><span style="color:#D6D6DD">=</span>{<span style="color:#9CDCFE">expense</span><span style="color:#D6D6DD">=</span><span style="color:#9CDCFE">row</span>}</pre>
  </div>
  <p class="caption">Four example rows test valid approval, invalid state, missing role authority and self-approval. The form binds the same operation to each listed expense; locks freeze submitted details and the final decision.</p>
</div>

Every authority rule answers a distinct question: `policy` governs who may read, `by` governs who may invoke an operation, `require` enforces business preconditions, and `lock` protects stored fields from later edits. Browser and MCP calls use the same operation runtime, which enforces the operation's schema, permissions and guards. Neither interface can turn an ordinary member into a reviewer.

## Distinctive moves.

- **Declare the differences; share the machinery.** Standard CRUD, record identity and versions, team scope, authentication and the application shell use defaults pinned to the language version. Forms derive their controls from operation schemas. Translations sit inline beside authored text. Larger products compose apps and packages while preserving the original owners of their records, roles and operations. Source stays compact by removing repeated setup while keeping permissions and business conditions explicit.
- **Test the operation where it is declared.** An `examples` block attaches to its operation and reuses shared fixtures; table rows vary callers, inputs, initial state and independently authored expectations. The runner executes the operation in isolated state and checks its returned result, persisted changes or rejection code. It distinguishes permission failures (`forbidden`) from business-rule rejections (`rule_failed`) and checks that expected rejections leave the example's captured state unchanged. There are no separate step definitions to synchronise with the application.
- **Extend the vocabulary without losing the business contract.** A static `$"..."` prompt can define a reusable model or field trait, a custom `Given` keyword, a scoped style or a custom view. Custom keywords can introduce semantics beyond the built-in vocabulary through checked compiler and runtime integration contracts. Generated JavaScript, CSS and declaration contributions are saved beside the app as editable files. Ordinary builds reuse those files without model calls; scenarios retain their authored permissions, guards and `do` bodies.

The generation workflow makes those extensions reviewable. Generation stages an isolated candidate; acceptance requires passing compilation, the platform build, inline examples and the app's browser tests before replacing the saved implementation. This requires authored examples and browser tests, plus the optional browser-automation add-on. Failed candidates preserve the current implementation. The committed [PromptStudio fixture](https://github.com/veighnsche/canlang/tree/main/tests/fixtures/prompt-pipeline) exercises generated field validation, a reusable Unicode uniqueness keyword, styled custom views and authenticated create/edit/archive operations. Generation extends what the app can express; acceptance still depends on independently specified behaviour.

## Maturity.

Canlang ships a Rust compiler, TypeScript runtime packages, editor tooling and an MIT-licensed [standalone distribution](https://github.com/veighnsche/canlang/releases/tag/v0.1.1). The v0.1.1 release bundles the compiler, catalog, private Node runtime, local `workerd` binary and production dependencies for macOS arm64 and Linux x64 with glibc 2.39 or newer. Developers and agents can install the toolkit and run local applications without assembling a source-build environment; browser automation is an optional add-on.

Applications compile to JavaScript targeting `workerd` / Cloudflare Workers, with D1 storage, Durable Objects and R2 selected as required. Remote deployment still requires resource preparation and configuration. The repository records successful installed-toolkit checks, the PromptStudio generation-to-browser workflow, and [local file and queue workflows](https://github.com/veighnsche/canlang/blob/main/implementation/lean-install/local-bindings.md), including authenticated uploads and selected local restart and replay recovery cases. These establish working application paths beyond parsing and code emission.

Development remains active. The [completion record](https://github.com/veighnsche/canlang/blob/main/implementation/compiler-completion/README.md) still lists unsupported query, composition and UI cases, along with broader workflow and deployment work. The trade-off is deliberate: a shared business-app model makes applications concise, while specialised foundations or novel extension semantics can require compiler/runtime development. Adoption depends on whether a company's complete workflow fits the implemented paths. Comparative agent-success and token-cost improvements remain to be demonstrated.

## Agent tooling.

The authoring loop is check, repair and exercise the declared behaviour. With `--format=json`, `can check` and `can compile` return structured diagnostics with source spans and stable error codes. `can explain` explains a diagnostic code with guidance and valid/invalid examples. `can fmt` supplies canonical formatting, and `can lsp` backs the VS Code extension with navigation, completion and rename support. `can policy` extracts a summary of declared access rules, while `can docs` generates a localised Markdown reference from checked declarations.

`can test` executes compiled inline examples through the operation runtime. `can gen` manages explicit prompt generation, candidate inspection and refinement; `can validate` runs compilation, the build, inline examples and browser checks against saved implementations without model calls. These [commands](https://github.com/veighnsche/canlang/blob/main/docs/public/04-Reference/01-cli.md) let an agent move from source diagnostics to concrete behavioural checks, keeping generated code on disk for inspection and direct editing.
