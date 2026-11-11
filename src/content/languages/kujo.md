---
name: Kujo
camp: orchestration
spans_camps: []
one_liner: "A scripting language with a bytecode VM, replayable AI calls, runtime capability controls, and machine-readable tooling for coding agents."
url: https://kujolang.ai
repo: kujolang/kujo
paper: null
author: Kujolang
implementation_language: Rust
compilation_target: Bytecode (custom VM)
license: MIT
maturity: working_compiler
date_appeared: "2026-06"
agent_tooling:
  - AGENTS.md
  - Agent Skills (separate kujo-skills repository)
  - Structured JSON diagnostics and CLI contracts
  - LSP
  - Repository-specific MCP server generator
key_idea: |
  Kujo puts deterministic AI request hashing, response record/replay, and
  capability controls into a general-purpose scripting runtime. Coding agents
  get an operational language guide and machine-readable check, lint, and
  runtime-diagnostic surfaces; provider routing and agent policy remain in
  packages rather than becoming language syntax.
crossrefs:
  - slug: boruna
    name: Boruna
    camp: orchestration
    relation: "Both put replay and capability controls in the runtime. Boruna centres declared workflow effects and evidence bundles; Kujo uses ordinary scripts with AI response cassettes and opt-in restrictions on host access."
  - slug: codong
    name: Codong
    camp: syntactic
    relation: "Both combine application scripting with bundled APIs and structured feedback for coding agents. Codong emphasises a canonical operation vocabulary and compilation through Go; Kujo targets a bytecode VM and makes AI record/replay a runtime primitive."
---

## The thesis.

Kujo is a general-purpose scripting language for local-first automation and AI-native applications. Its agent-authoring surface is concrete: the repository's [agent guide](https://github.com/kujolang/kujo/blob/main/AGENTS.md) specifies binding rules, module conventions, runtime selection, validation commands, and stable CLI contracts for agents writing `.kujo` programs. A separate [skills repository](https://github.com/kujolang/kujo-skills) packages that guidance into focused coding workflows.

The orchestration classification comes from the runtime boundary. Kujo provides request hashing, recorded AI responses, and capability checks; provider routing, retries, RAG policy, and agent frameworks belong in packages. Compared with Boruna's workflow-oriented model, Kujo keeps functions, loops, collections, and modules as the ordinary units of authored code. The replay guarantee concerns recorded AI calls, not arbitrary whole-program execution.

## What it looks like.

<div class="code-sample">
  <div class="code">
<pre><span class="kw">let</span> messages := [ai_message(<span class="str">"user"</span>, <span class="str">"Summarise this report."</span>)]
<span class="kw">let</span> options := {
    <span class="str">"endpoint"</span>: <span class="str">"https://api.example.test/v1/chat/completions"</span>,
    <span class="str">"model"</span>: <span class="str">"demo-model"</span>
}
<span class="kw">let</span> request_id := ai_request_hash(messages, options)
print(request_id)</pre>
  </div>
  <p class="caption">Message construction and request hashing are pure operations: this example runs without credentials or network access, including in untrusted mode. The hash identifies the normalised request used by the AI cassette mechanism.</p>
</div>

## Distinctive moves.

The [AI runtime](https://github.com/kujolang/kujo/blob/main/docs/AI_RUNTIME.md) computes credential-independent request hashes and can serve recorded responses before constructing an HTTP client. Strict replay returns an error on a missing cassette rather than contacting a provider. This gives an agent-written integration a reproducible offline test path without replacing its call sites with a separate mock API.

Capability controls distinguish AI egress from general network access. A normal run is trusted; `--untrusted` restricts host effects, with explicit grants such as `--allow-ai`. The project's [security guidance](https://github.com/kujolang/kujo/blob/main/docs/SECURE_AI_SCRIPTING.md) explicitly says Kujo is not a sandbox. These are runtime controls, not a static effect-type proof.

Like Codong, Kujo supplies application APIs and structured feedback alongside the language. Its distinctive emphasis is the deterministic runtime mechanism rather than a claim about minimum token counts. No independent token-efficiency result is asserted here.

## Maturity.

Kujo has a working Rust implementation, published binaries for macOS, Linux, and Windows, and a bytecode VM as the default execution path. The public repository dates from June 2026. The tree-walking interpreter remains available for compatibility and debugging; [runtime parity documentation](https://github.com/kujolang/kujo/blob/main/docs/VM_INTERPRETER_PARITY_MATRIX.md) records differences, and JIT execution is experimental. Authors need to check the supported runtime path rather than assume all execution modes are interchangeable.

## Agent tooling.

The [machine-readable CLI contract](https://github.com/kujolang/kujo/blob/main/docs/CLI_MACHINE_READABLE_CONTRACTS.md) documents JSON output and exit codes for checking, formatting, linting, and runtime diagnostics. Agents must still respect command-specific error envelopes: ordinary failures are not universally JSON on standard output. The runtime also ships an LSP and `kujo mcp make` for generating repository-specific MCP servers. These tools support the author/check/repair loop independently of whether a program itself calls an LLM.
