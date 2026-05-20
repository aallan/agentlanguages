---
name: Prove
camp: verification
one_liner: "Same verification diagnosis, opposite conclusion. License prohibits AI training use. Refinement types, verb-based IO."
url: https://prove.botwork.se
repo: null
paper: null
author: Magnus Knutas
implementation_language: Python (bootstrap)
compilation_target: C (via gcc/clang)
license: Prove Source License v1.0
maturity: working_compiler
date_appeared: 2026-04
agent_tooling: []
key_idea: |
  Same verification-camp diagnosis as Vera and Aver, opposite conclusion.
  Deliberately designed to be hard for AI to generate correctly; the licence
  explicitly prohibits use for AI training. Refinement types, requires/
  ensures contracts, verb-based IO tracking where pure verbs cannot perform
  IO. Tree-sitter grammar, Pygments lexer, binary installers.
---
