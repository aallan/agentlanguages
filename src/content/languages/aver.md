---
name: Aver
camp: verification
one_liner: "Co-located verify blocks, Lean 4 proof export, decision blocks embedding ADRs in source. Match-only branching."
url: https://averlang.dev
repo: jasisz/aver
paper: null
author: Szymon Teżewski
implementation_language: Rust
compilation_target: Interpreted; transpiles to Rust
license: Unknown
maturity: working_compiler
date_appeared: 2026-03
agent_tooling:
  - "`aver context`: token-budgeted dependency-graph export"
key_idea: |
  Co-located verify blocks, Lean 4 proof export, intent annotations (?),
  decision blocks embedding ADRs in source, match-only branching (no
  if/else), effect lists on signatures. Closest design relative to Vera in
  the catalogue. Now integrated into VeraBench as the first external
  language.
---
