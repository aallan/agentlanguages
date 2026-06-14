---
name: Codex
camp: verification
spans_camps: [orchestration]
one_liner: "Self-hosting literate language on bare-metal x86-64: dependent, linear, and effect types, proof blocks, and a byte-identical fixed point as the acceptance gate for every change. Authored and maintained end-to-end by AI agents."
url: https://github.com/damiant3/NewRepository
repo: damiant3/NewRepository
paper: null
author: Damian Tedrow (with a multi-agent AI team)
implementation_language: Codex (self-hosted; the bootstrap reference compiler is retired)
compilation_target: "Bare-metal x86-64 (CDX binary, no OS or libc); transpiler plugs for ~48 targets including WebAssembly"
license: Not published
maturity: working_compiler
date_appeared: 2026-03
agent_tooling:
  - CLAUDE.md operating contract
  - per-agent process docs
  - "numbered diagnostics in a central registry (ranges 0xxx-4xxx, plus 9xxx internal) stating what, where, and the fix"
  - fixed-point build gates (text round-trip + byte-identical binary)
  - deterministic replay (codex.os.replay)
key_idea: |
  A literate language where prose is load-bearing and the compiler is its
  own specification: the acceptance test for any change is that the
  self-host remains a byte-identical fixed point of itself on bare metal,
  with no OS, libc, or GC underneath. Dependent, linear, and effect types
  carry capabilities; bounded integers and proof blocks run through a
  five-phase verifier. The whole system -- compiler, OS, drivers, tooling --
  is authored and maintained by AI agents under a gated, measured process:
  self-hosting roughly a week from the first commit, fully self-sustaining
  (reference compiler retired) in 41 days.
crossrefs:
  - slug: ailang
    name: AILANG
    camp: verification
    relation: "Both are agent-authored languages with effect typing. AILANG enforces capability rows over a Go-implemented runtime; Codex self-hosts -- the agents maintain the compiler that compiles itself, on bare metal with no runtime underneath."
  - slug: moonbit
    name: MoonBit
    camp: verification
    relation: "Both verification camp with broad toolchains. MoonBit bets on training-data depth and semantics-aware token sampling; Codex bets on the fixed point -- byte-identical regeneration as the gate every change must pass."
history:
  - when: "14 Mar 2026"
    what: "Founding specification and first commit are simultaneous; the goal is a single literate language to replace accumulated repository hosting, with code that reads like a book."
  - when: "Mar 2026"
    what: "The compiler self-hosts roughly a week from the first commit."
  - when: "24 Apr 2026"
    what: "All four bootstrap stages green, 41 days from start: the reference compiler is permanently retired and the self-host is a byte-identical fixed point of itself on bare metal."
  - when: "May-Jun 2026"
    what: "OS quires land (22 kernel drivers, networking stack, trust lattice, deterministic replay), 48 transpiler plugs, a custom WHP-based VM for the build loop; an ongoing memory campaign requires a measured heap and time-complexity verdict on every change."
---

## The thesis.

Codex &mdash; Damian Tedrow's self-hosting language, unrelated to OpenAI's coding model of the same name &mdash; starts from the position that the verification camp usually argues toward and then removes the floor: if agents are going to author the system, the system should not rest on anything the agents did not build. The compiler is written in Codex, compiles itself on bare-metal x86-64 with no operating system, no libc, and no garbage collector, and the acceptance test for every change is regeneration byte-identity -- the self-host compiled by its own output must equal itself, bit for bit, signature aside. There is no separate specification document to drift from; the fixed point is the specification.

<p class="pullquote">The repository remembers everything. The language says what you mean. The machine checks that you meant it.</p>

The second commitment is literacy. Prose is not comment syntax; it is part of the chapter, written at low indentation under section headers, and it survives the text round-trip gate like any other content. The founding document asks for a language that "exists for human reading and machine," and the format treats both audiences as readers of the same book.

## What it looks like.

<div class="code-sample">
  <div class="code">
<pre><span class="kw">Chapter:</span> Dice
 A bounded integer cannot leave its range; the overflow mode
 says what happens at the edge.
  <span class="ty">faces</span> : Integer <span class="kw">between</span> 1 <span class="kw">and</span> 20 = 20
  <span class="ty">describe</span> : Integer -&gt; Text
  describe (roll) =
   <span class="kw">if</span> roll == 20 <span class="kw">then</span> <span class="str">"critical"</span>
   <span class="kw">else if</span> roll == 1 <span class="kw">then</span> <span class="str">"fumble"</span>
   <span class="kw">else</span> show roll
  <span class="ty">opening</span> : [<span class="ct">Console</span>] Nothing =
   print-line-uni (<span class="str">"you rolled "</span> &amp; describe faces)</pre>
  </div>
  <p class="caption">The entry point is <code>opening</code>, not <code>main</code>. <code>[Console]</code> is the effect row; a function that prints must say so in its type. Prose lines at low indentation are part of the chapter, not comments &mdash; the literate format is load-bearing and survives the round-trip gate.</p>
</div>

## Distinctive moves.

- **The fixed point is the gate.** Two build gates run on every change: a text round-trip (the compiler regenerates its own source semantically) and CDX byte-identity (stage one's binary output equals stage two's). A change that breaks either does not ship.
- **No borrowed substrate.** Bare metal means every allocation is permanent until the producing function returns. The discipline is survey-before-allocate: phases reserve deck regions up front, scratch is compacted at phase boundaries, and every code review states an explicit memory and time-complexity verdict, measured rather than estimated.
- **Types as the specification.** Dependent types, linear types, and effect rows; bounded integers (`Integer between 1 and 20`) with declared overflow behavior; claim/proof/qed blocks checked by a five-phase verifier. Use-after-free is a type error.
- **A repository protocol, not just a language.** The longer arc replaces Git-style hosting with a content-addressed protocol of facts, proposals, and verdicts over a trust lattice -- coordination machinery designed for many authors whose work must be verified rather than trusted.
- **Agents as the only authors.** The development team is a set of named AI agents working Perforce streams under gated process: zero test failures before integration, seed rebuilds proven by self-verification, and measured before/after numbers in every change description.

## Maturity.

The compiler is roughly 32,000 lines of Codex across 53 files and is a hard fixed point of itself: the canonical artifact is a ~2.1 MB self-sustaining CDX binary that boots under the project's own WHP-based virtual machine or QEMU multiboot, compiles the full source, and verifies its own signature. A 217-test battery gates every change alongside the fixed-point checks. Around the compiler sit OS quires (22 bare-metal drivers including xHCI, NE2K, and Intel HDA, a networking stack, deterministic replay, the trust lattice), 113 transpiler plug modules covering ~48 targets, and the ~4,500-line C hypervisor that hosts the build loop. The bootstrap reference compiler was retired on 24 April 2026 and is kept only as historical record; no other-language toolchain remains in the chain. The strain to watch is the one the project chose deliberately: bare-metal memory ceilings make compiler heap usage a first-class engineering campaign, run with measured per-change verdicts.

## Agent tooling.

CLAUDE.md is the operating contract: build gates, process rules, and prohibitions that agents follow verbatim, with per-agent identity files and a documented Perforce protocol for parallel streams. The compiler emits numbered diagnostics from a central registry (`CdxCodes`, 61 codes at the public cut, organised into ranges &mdash; 0xxx infrastructure and lexer, 1xxx parser, 2xxx type checker, 3xxx name resolver, 4xxx proof and capability, 9xxx compiler-internal) written to state what went wrong, where, and the suggested fix -- diagnostics are treated as a feature with their own design rule. The build surface is fully scriptable (single-command gates, parallel test battery, single-file compile), deterministic replay ships as an OS quire, and the development history itself -- bootstrap stages, gate results, measured memory campaigns -- is recorded in-tree as the working memory of the agent team that maintains it.
