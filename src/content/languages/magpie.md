---
name: Magpie
camp: syntactic
one_liner: "SSA form as user-facing syntax. Every value %-prefixed and assigned exactly once. ~2.3x more tokens per operation."
url: https://magpie-lang.com
repo: magpie-lang/magpie
paper: null
author: Author anonymous
implementation_language: Rust
compilation_target: "LLVM, WASM"
license: MIT
maturity: working_compiler
date_appeared: 2026-03
agent_tooling:
  - SKILL.md
  - AGENTS.md
key_idea: |
  Surfaces SSA (Static Single Assignment) form as user-facing syntax. Every
  value gets a %-prefixed name, assigned exactly once. Explicit ownership
  transitions. Costs roughly 2.3x more tokens per operation than a
  conventional language — and that's the point: each token is unambiguous.
---
