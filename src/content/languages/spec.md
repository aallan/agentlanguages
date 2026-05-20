---
name: Spec
camp: unclassified
spans_camps:
  - orchestration
one_liner: "v0.2 design proposal for a language-agnostic IR for agent-driven development. Six specialised agents (Product, Architect, Scrum, Developer, Tester, DevOps) collaborate on shared .spec.ir artefacts; language-specific code generation is downstream."
url: https://github.com/mronus/spec
repo: mronus/spec
paper: null
author: M. Abdullah Onus
implementation_language: TypeScript (React POC)
compilation_target: Not applicable — IR artefacts (.spec.ir files), not executable
license: MIT
maturity: thought_experiment
date_appeared: 2026-04
agent_tooling:
  - "Browser-based React/TypeScript POC at mronus.github.io/spec orchestrating six specialised agents end-to-end"
  - "Multi-agent pipeline with feedback loops, state persistence, and resume support"
  - "Support for Claude and GPT models; API keys remain in the browser"
key_idea: |
  Spec separates concerns into two domains. The Spec Domain is language-agnostic: six specialised agents (Product, Architect, Scrum, Developer, Tester, DevOps) collaborate to produce a set of .spec.ir artefacts — contract, module, infrastructure, data, types, interfaces, functions, events, tests, pipeline — that describe what the system should do. The External Agents Domain is language-specific: separate language agents (Java, Go, Terraform, etc.) consume the IR and produce code. The bet is that this separation lets one specification target multiple languages and enables incremental modification with the proposal's claimed 200 tokens of context instead of the 1,500 a comparable Java change requires.
crossrefs:
  - slug: boruna
    name: Boruna
    camp: orchestration
    relation: "Cross-camp neighbour. Boruna runs DAG workflows with policy-gated effects and hash-chained evidence; Spec coordinates specialist agents producing shared IR artefacts. Both treat the language as one layer in a larger orchestration story."
  - slug: pel
    name: Pel
    camp: orchestration
    relation: "Academic-leaning kin. Both propose architectures for agent collaboration that have not yet shipped a usable language — Pel as a CMU paper, Spec as a draft proposal with a browser-based POC."
---

## What it is.

Spec is a draft language design proposal at v0.2, not a working compiler. The repository ships a design document (`spec-language-design-proposal-v0.2.md`), a browser-based React/TypeScript proof-of-concept that orchestrates the agent pipeline against Claude or GPT, and a README that explicitly labels the project as a draft for discussion. The IR format defines ten artefact types &mdash; contract.spec.ir, module.spec.ir, infrastructure.spec.ir, data.spec.ir, types.spec.ir, interfaces/*.spec.ir, functions/*.spec.ir, events.spec.ir, tests.spec.ir, pipeline.spec.ir &mdash; each owned by a specific agent role (Product, Architect, Scrum, Developer, Tester, DevOps). The external language agents that would translate IR to running code in Java, Go, Rust, Terraform, or other targets are listed in the future-work section as not yet implemented.

## Why it's here.

The catalogue includes Spec as a marker of an architectural position that spans into orchestration. Where the syntactic and verification camps argue about what an agent should write, Spec argues about who should write what, and in what order &mdash; Product before Architect before Developer, with explicit IR handoffs between roles. The distinctive move is to treat the multi-agent pipeline as the primary artefact and language-specific code generation as a downstream concern that can be deferred. The catalogue does not rate Spec against working compilers. It marks it as a different kind of evidence: a structured argument that "language for agents to write" might be the wrong unit of analysis, and that "IR for agents to coordinate over" is the unit that matters.
