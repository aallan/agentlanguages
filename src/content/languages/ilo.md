---
name: ilo
camp: syntactic
spans_camps: [verification]
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

ilo is a token-minimal language whose stated premise is that the cost of a program is not its runtime but its token count across generation, retries, and context loading. The surface follows from that: builtins have short fixed aliases (`mapr`, `fld`, `rdjl`, `jpth`, `spl`), function parameters take no parentheses, `>` separates parameters from the return type, `;` separates statements, and the last expression is the return value. A file-level `^26.5` pragma declares the minimum runtime. The implementation is Rust, compiling through a bytecode VM and a Cranelift backend for JIT and object output, with 2,700+ commits, 8,700+ tests, and 369 example programs that double as a cross-engine regression suite. A 13,000-line verifier runs ahead of execution and gates it, and later cycles added effect sets and capability builtins with static enforcement &mdash; machinery in service of the token thesis, since an error caught before execution is a retry not spent, rather than of correctness as a terminal value. That is why verification sits as the secondary camp here.

## The distinctive move.

Where most entries in the syntactic camp argue from design principle, ilo argues from a measurement loop. The project runs scripted agent personas against real tasks, logs every point where the model produced wrong or non-converging code, and files those as language bugs with priority labels. The resulting issue tracker reads less like a feature roadmap than a record of model failure modes: braceless guards returning from the wrong scope, ternary forms confused with match arms, `fld` argument order misremembered, `{name}` in string literals having no escape. Fixes land with a regression test and an example file, on the reasoning that the example is itself context an agent will later learn from. This is a different theory of language design from Mog's or Zero's, and it is the project's clearest contribution: the claim that an agent language should be tuned empirically against observed model error, not reasoned about in advance.

## Where it strains.

The spec has grown against the thesis. ilo's own strategy document, written in May 2026, measured the spec at roughly 16,000 tokens against Zero's 4,300 and concluded that spec loading dominates per-task cost, that per-generation savings of ~600 tokens versus Python are eaten by context overhead in short sessions, and that modular skills were therefore "existential economics." `SPEC.md` has since reached 179 KB and the `ai.txt` variant 167 KB &mdash; around 51,000 and 48,000 tokens on a cl100k count. The modular-skills work did ship: twelve task-scoped modules totalling roughly 13,800 tokens sit under a 14,000-token aggregate cap enforced in CI, with the 14 KB `SKILL.md` (~4,900 tokens) as the per-task entry point, and that is the honest figure to set against Mog's 3,200-token spec. The caps were raised in May to absorb accumulated diagnostic and hint text, and now run at about 98% utilisation.

The project publishes the number that bears hardest on its own premise. A committed CI baseline from August 2026 records thirteen scripted personas attempting real tasks with Haiku 4.5: one produced working code, one partially, and eleven failed, with twelve of the thirteen exhausting a three-attempt ceiling. Adoption is minimal &mdash; single-digit GitHub stars, a few hundred lifetime crates.io downloads, two GitHub issues ever, and a roadmap tracked on a private instance. The language ships a working compiler, a package manager, an HTTP server, and streaming primitives, which is more surface than most of the catalogue at this star count, but it has not yet published the closed-loop benchmark its own strategy identifies as the thing that would make its central claim checkable.
