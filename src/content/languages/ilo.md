---
name: ilo
camp: syntactic
spans_camps: []
one_liner: "Token-minimal language where every builtin has a short fixed alias and design changes are argued against measured token cost. Development is driven by scripted agent sessions whose failures are filed as language bugs."
url: https://ilo-lang.ai
repo: ilo-lang/ilo
paper: null
author: Daniel Morris
implementation_language: Rust
compilation_target: Native (Cranelift JIT and object emission), with a bytecode VM
license: MIT
maturity: working_compiler
date_appeared: 2026-02
agent_tooling:
  - "skills/ilo/SKILL.md (13 KB Claude skill, the intended per-task context load)"
  - ".claude-plugin/marketplace.json (installable as a Claude Code plugin)"
  - "ai.txt (full prose spec, agent-addressed rather than agent-sized)"
  - "AGENTS.md, plus structured diagnostics with stable ILO-P/T/R codes"
key_idea: |
  ilo evaluates each design choice against total token cost: generation, plus
  retries, plus context loading. Builtins carry short fixed aliases (mapr, fld,
  rdjl, jpth), parameters need no parentheses, and the last expression returns.
  The distinctive move is process rather than syntax: the language is developed
  by running scripted agent personas against real tasks and filing every
  confusion as a language bug, so the surface is shaped by what models
  measurably get wrong rather than by human ergonomics. The project's own
  strategy documents track where that has and has not paid off.
crossrefs:
  - slug: mog
    name: Mog
    camp: syntactic
    relation: "Nearest neighbour on the token-density claim, and the sharper comparison. Both bet that a small surface is what agents need; Mog bounds the whole spec at 3,200 tokens, while ilo's per-task artefact is a 13 KB skill file sitting above a 160 KB prose spec. Mog makes the bound load-bearing, ilo makes the alias table load-bearing."
  - slug: zero
    name: Zero
    camp: verification
    relation: "Direct competitor on positioning; both describe themselves as the language for agents, ilo from February 2026 and Zero from May. Zero pairs a small surface with verification machinery and repair-plan diagnostics; ilo pairs it with alias density and an agent-driven bug pipeline. Zero has distribution, ilo has the earlier date."
  - slug: lume
    name: Lume
    camp: syntactic
    relation: "Same diagnosis about context cost, opposite remedy. Lume keeps a conventional surface and bounds what the model sees with a token-budgeted retrieval tool; ilo compresses the surface itself and ships a fixed skill file. A clean natural experiment on whether density or retrieval is the better lever."
---

## What it is.

ilo is a token-minimal language whose stated premise is that the cost of a program is not its runtime but its token count across generation, retries, and context loading. The surface follows from that: builtins have short fixed aliases (`mapr`, `fld`, `rdjl`, `jpth`, `spl`), function parameters take no parentheses, `>` separates parameters from the return type, `;` separates statements, and the last expression is the return value. A file-level `^26.5` pragma declares the minimum runtime. The implementation is Rust, compiling through a bytecode VM and a Cranelift backend for JIT and object output, with 2,700+ commits, 8,700+ tests, and 369 example programs that double as a cross-engine regression suite.

## The distinctive move.

Where most entries in the syntactic camp argue from design principle, ilo argues from a measurement loop. The project runs scripted agent personas against real tasks, logs every point where the model produced wrong or non-converging code, and files those as language bugs with priority labels. The resulting issue tracker reads less like a feature roadmap than a record of model failure modes: braceless guards returning from the wrong scope, ternary forms confused with match arms, `fld` argument order misremembered, `{name}` in string literals having no escape. Fixes land with a regression test and an example file, on the reasoning that the example is itself context an agent will later learn from. This is a different theory of language design from Mog's or Zero's, and it is the project's clearest contribution: the claim that an agent language should be tuned empirically against observed model error, not reasoned about in advance.

## Where it strains.

The spec has grown against the thesis. ilo's own strategy document, written in May 2026, measured the spec at roughly 16,000 tokens against Zero's 4,300 and concluded that spec loading dominates per-task cost, that per-generation savings of ~600 tokens versus Python are eaten by context overhead in short sessions, and that modular skills were therefore "existential economics." Since then `SPEC.md` has reached ~173 KB and `ai.txt` ~161 KB, on the order of 44,000 and 41,000 tokens; the modular-skills work was never scheduled. The 13 KB `SKILL.md` is the artefact actually sized for a per-task load, and it is the honest number to compare against Mog's 3,200-token spec. Adoption is minimal, with single-digit GitHub stars and no Show HN. The language ships a working compiler, a package manager, an HTTP server, and streaming primitives, which is more surface than most of the catalogue at this star count, but it has not yet published the closed-loop benchmark its own strategy identifies as the thing that would make its central claim checkable.
