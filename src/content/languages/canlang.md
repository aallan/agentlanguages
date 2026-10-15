---
name: Canlang
camp: syntactic
spans_camps:
  - verification
one_liner: "A language for AI agents to build custom business software. Records, permissions and operations define browser forms and MCP tools, with inline examples that exercise the same business rules."
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
  - "Structured JSON diagnostics, source locations and stable error codes"
  - "can check / compile / lint / policy / explain"
  - "can fmt and can lsp, with a VS Code-compatible extension"
  - "can docs: a localised reference derived from checked declarations"
  - "can test: compiled inline examples through the operation runtime"
  - "can gen: explicit generation, saved-output inspection and refinement"
  - "can validate: compilation, examples and browser checks without AI"
key_idea: |
  Make the business application the unit of authoring. An agent declares its records, access rules, permitted operations and expected outcomes; standard application machinery is shared, and browser forms and MCP tools derive from the owning operations. The intended saving comes from fewer separately maintained representations of the same behaviour. Explicit prompts extend the vocabulary and presentation through saved, editable implementations whose contracts remain visible to the compiler.
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
    relation: "Both give natural-language intent a place in implementation generation. Marsha compiles function descriptions and examples into tested Python through an LLM; Canlang uses explicit prompts for checked language extensions and presentation, saving their implementation while ordinary scenarios retain authored guards and bodies."
history:
  - when: "Oct 2026"
    what: "The current Rust-based business-application toolchain appears publicly. Standalone v0.1.1 is released on 15 October for macOS arm64 and Linux x64/glibc."
---

## The thesis.

Canlang is built around a practical bet: much of the software a company needs consists of records, permissions and workflows specific to how it operates. Its intended users are companies replacing subscription software with applications tailored to their own procedures. Its intended authors are AI agents. The language gives those agents a compact way to describe the business, with standard authentication, teams, storage and interface behaviour supplied through shared defaults.

Consider expense approval. The record defines what is stored; the operation defines who may approve it and under which conditions. The browser form takes its inputs from that operation. An MCP client invokes the same operation through an agent tool. Attached examples specify an eligible review, an unauthorised caller and attempted self-approval. Changing the business rule means changing its owning declaration, with fewer separate implementations for an agent to keep aligned.

<p class="pullquote">The form and the agent tool invoke the same business operation.</p>

That is Canlang's syntactic bet: reduce the amount of application structure an agent must invent and repeat. Types, explicit authority and executable examples supply the verification overlap. The language targets tasks, approvals, bookings, invoicing and similar operational software; its [requirements](https://github.com/veighnsche/canlang/blob/main/docs/specification/REQUIREMENTS.md) make economical generation and maintenance the goal, without claiming a measured cost advantage.

## What it looks like.

`Given` declares data and rules, `When` declares operations, and `Then` declares presentation. Here, a reviewer can approve a submitted expense, but never their own. This excerpt adapts [ExpenseFlow](https://github.com/veighnsche/canlang/blob/main/examples/ExpenseFlow.can); the app header and create/submit workflow are omitted to focus on approval.

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
  <p class="caption">Four examples cover approval, the wrong state, missing authority and self-approval. The form binds the same operation to each displayed expense; locks freeze submitted details and the final decision.</p>
</div>

Each authority declaration answers a different question. `policy` governs reading, `by` admits a caller, `require` checks business eligibility, and `lock` protects existing values from later changes. The form reuses the operation's inputs and checks. Neither a browser control nor an MCP call can turn an ordinary member into a reviewer.

## Distinctive moves.

- **Declare the differences; share the machinery.** Standard CRUD, record identity and versions, team scope, authentication and the application shell have defined defaults. Forms derive their controls from operation schemas. Translations live beside authored text. Larger products compose apps and packages while retaining the original owners of their records, roles and operations. The compactness comes from removing repeated setup while keeping actual permission choices and business conditions explicit.
- **Test the operation where it is declared.** An `examples` table inherits its operation and reuses shared fixtures; its rows vary callers, inputs, state and independently authored expectations. The runner invokes the operation in isolated state and checks its result, persisted changes or rejection. It can distinguish a permission failure from a business-rule failure and detect changes left behind by a rejected call. There are no separate step definitions to synchronise with the application.
- **Extend the vocabulary without losing the business contract.** A static `$"..."` prompt can define a reusable model or field trait, a custom `Given` keyword, a style or a view. Custom keywords can add semantics beyond the built-in vocabulary, through declared compiler/runtime integration contracts. Generated JavaScript, CSS and declaration contributions are saved beside the app and remain editable. Ordinary builds reuse them without model calls; scenarios retain their authored permissions, guards and `do` bodies.

The generation workflow makes those extensions reviewable. Generation produces a candidate; acceptance checks compilation, the build, inline examples and the app's browser tests before replacing the saved implementation. This requires authored examples and browser tests, plus the separately installed browser tooling. Failed candidates preserve the current implementation. The committed [PromptStudio example](https://github.com/veighnsche/canlang/tree/main/tests/fixtures/prompt-pipeline) exercises generated field constraints, a reusable Unicode uniqueness rule, styled views and authenticated create/edit/archive operations. Generation extends the app; its acceptance still depends on independently specified behaviour.

## Maturity.

Canlang ships a Rust compiler, TypeScript runtime packages, editor tooling and an MIT-licensed [standalone distribution](https://github.com/veighnsche/canlang/releases/tag/v0.1.1). The v0.1.1 bundle includes the compiler, catalog, private Node runtime, local workerd engine and production dependencies for macOS arm64 and Linux x64 with glibc 2.39 or newer. Application authors can install the toolkit without assembling a source-build environment; browser automation is an optional add-on.

The deployment model is JavaScript on workerd / Cloudflare Workers, with D1 storage, Durable Objects and R2 selected as required. The repository records successful installed-toolkit checks, the PromptStudio generation-to-browser journey, and [local file and queue workflows](https://github.com/veighnsche/canlang/blob/main/implementation/lean-install/local-bindings.md), including authenticated uploads and recovery cases. These establish working application paths beyond parsing and code emission.

Development remains active. The [completion record](https://github.com/veighnsche/canlang/blob/main/implementation/compiler-completion/README.md) still lists unsupported query, composition and UI cases, along with broader workflow and deployment work. The trade-off is deliberate: a shared business-app model makes applications concise, while specialised foundations or novel extension semantics can require compiler/runtime development. Adoption depends on whether a company's complete workflow fits the implemented paths. Comparative agent-success and token-cost improvements remain to be demonstrated.

## Agent tooling.

The authoring loop is check, repair and exercise the declared behaviour. `can check` and `can compile` return structured diagnostics with source locations and stable codes; `can explain` supplies their meaning. `can fmt` supplies canonical formatting; the language server and editor provide navigation, completion and rename. `can policy` exposes declared access, while `can docs` derives a localised application reference from checked source.

`can test` runs compiled examples. `can gen` manages explicit generation and saved implementations; `can validate` checks the saved application without AI. These [commands](https://github.com/veighnsche/canlang/blob/main/docs/public/04-Reference/01-cli.md) let an agent move from source diagnostics to concrete behavioural checks, with generated code available for inspection and direct editing.
