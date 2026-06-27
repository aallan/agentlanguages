---
name: Codex
camp: verification
spans_camps: [orchestration]
one_liner: "Self-hosting literate language on bare-metal x86-64: dependent, linear, and effect types, proof blocks, hard real-time enforcement, and a byte-identical fixed point as the acceptance gate for every change. Authored and maintained end-to-end by AI agents."
url: https://github.com/damiant3/NewRepository
repo: damiant3/NewRepository
paper: null
author: Damian Tedrow (with a multi-agent AI team)
implementation_language: Codex (self-hosted; the bootstrap reference compiler is retired)
compilation_target: "Bare-metal x86-64 (CDX binary, no OS or libc); ARM64 and RISC-V cross-compilation via plugs; PTX (NVIDIA) and SPIR-V (Vulkan/OpenCL) GPU targets; 53 transpiler plugs total including WebAssembly"
license: Not published
maturity: working_compiler
date_appeared: 2026-03
agent_tooling:
  - CLAUDE.md operating contract
  - per-agent process docs
  - "numbered diagnostics in a central registry (ranges 0xxx-9xxx) stating what, where, and the fix"
  - fixed-point build gates (text round-trip + byte-identical binary)
  - deterministic replay (codex.os.replay)
  - "punctual keyword: compile-time bounded-execution enforcement with instruction counting"
key_idea: |
  A literate language where prose is load-bearing and the compiler is its
  own specification: the acceptance test for any change is that the
  self-host remains a byte-identical fixed point of itself on bare metal,
  with no OS, libc, or GC underneath. Dependent, linear, and effect types
  carry capabilities; bounded integers and proof blocks run through a
  five-phase verifier; the `punctual` keyword enforces hard real-time
  execution bounds at compile time. Around the compiler sit 377 library
  modules across 26 quires, an OS kernel with 22 drivers and a networking
  stack, 53 transpiler plugs, and 630 application modules across 47 apps.
  The whole system is authored and maintained by AI agents under a gated,
  measured process: self-hosting roughly a week from the first commit,
  fully self-sustaining (reference compiler retired) in 41 days.
crossrefs:
  - slug: ailang
    name: AILANG
    camp: verification
    relation: "Both are agent-authored languages with effect typing. AILANG enforces capability rows over a Go-implemented runtime; Codex self-hosts -- the agents maintain the compiler that compiles itself, on bare metal with no runtime underneath."
  - slug: moonbit
    name: MoonBit
    camp: verification
    relation: "Both verification camp with broad toolchains. MoonBit bets on training-data depth and semantics-aware token sampling; Codex bets on the fixed point -- byte-identical regeneration as the gate every change must pass."
  - slug: vera
    name: Vera
    camp: verification
    relation: "Both verification camp, both span into orchestration. Vera checks with Z3 SMT and drops variable names; Codex checks with a five-phase verifier, dependent types, and the self-hosting fixed point. Vera targets WebAssembly; Codex targets bare metal."
history:
  - when: "14 Mar 2026"
    what: "Founding specification and first commit are simultaneous; the goal is a single literate language to replace accumulated repository hosting, with code that reads like a book."
  - when: "Mar 2026"
    what: "The compiler self-hosts roughly a week from the first commit."
  - when: "24 Apr 2026"
    what: "All four bootstrap stages green, 41 days from start: the reference compiler is permanently retired and the self-host is a byte-identical fixed point of itself on bare metal."
  - when: "May 2026"
    what: "OS quires land (22 kernel drivers, networking stack, trust lattice, deterministic replay), plug architecture ships, custom WHP-based VM replaces QEMU for the build loop."
  - when: "Jun 2026"
    what: "Dependent types (PropEqTy, proof erasure), type classes (dictionary passing), linear types (orthogonal to mutable), punctual hard real-time keyword, SIMD/Vector types with SSE2 codegen, ARM64 and RISC-V cross-compilation, PTX and SPIR-V GPU plugs. 53 transpiler plugs, 377 library modules, 630 application modules across 47 apps."
---

## The thesis.

Codex &mdash; Damian Tedrow's self-hosting language, unrelated to OpenAI's coding model of the same name &mdash; starts from the position that the verification camp usually argues toward and then removes the floor: if agents are going to author the system, the system should not rest on anything the agents did not build. The compiler is written in Codex, compiles itself on bare-metal x86-64 with no operating system, no libc, and no garbage collector, and the acceptance test for every change is regeneration byte-identity &mdash; the self-host compiled by its own output must equal itself, bit for bit, signature aside. There is no separate specification document to drift from; the fixed point is the specification.

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
- **Types as the specification.** Dependent types with propositional equality (`===` in type position, inhabited by `Refl`, checked by the unifier); linear types for resources (use exactly once or leak, CDX2063); mutable records for uniquely-owned in-place data (aliasing is CDX2062); effect rows declaring side effects in every signature; bounded integers (`Integer between 1 and 20`) with declared overflow behaviour; `claim`/`proof`/`qed` blocks checked by a five-phase verifier. Use-after-free and double-use are type errors. Proofs are erased at emit &mdash; zero machine code.
- **Hard real-time by construction.** The `punctual` keyword enforces bounded execution at compile time per function: no heap allocation (CDX6002), no recursion (CDX6005), no unsafe calls (CDX6001), no closures (CDX6003), no bare I/O (CDX6004). The emitter counts instructions and reports the tally (CDX6010); an optional budget warns when the count exceeds a threshold (CDX6011). No production language ships this combination &mdash; Ada Ravenscar restricts globally and needs external WCET tools; Rust and MISRA-C have no compile-time execution bound mechanism.
- **A repository protocol, not just a language.** The longer arc replaces Git-style hosting with a content-addressed protocol of facts, proposals, and verdicts over a trust lattice &mdash; coordination machinery designed for many authors whose work must be verified rather than trusted.
- **Agents as the only authors.** The development team is a set of named AI agents working Perforce streams under gated process: zero test failures before integration, seed rebuilds proven by self-verification, and measured before/after numbers in every change description.

## Maturity.

The compiler is roughly 28,000 lines of Codex across 54 files and is a hard fixed point of itself: the canonical artefact is a 2.3 MB self-sustaining CDX binary that boots under the project's own WHP-based virtual machine or QEMU multiboot, compiles the full source in 22 seconds on bare metal, and verifies its own Ed25519 signature. A 137-test battery (consolidated from 232 individual tests) gates every change alongside the fixed-point checks; the full gate &mdash; CDX build, sign, canary, text round-trip, semantic equivalence, CDX fixed point, and BVT &mdash; completes in roughly 140 seconds.

Around the compiler sit 377 library modules across 26 quires (data structures, cryptography, networking, AI inference, game engine, 3D engine, UI toolkit, signal processing, compression, encoding, simulation, and hard real-time primitives), an OS kernel with 22 bare-metal drivers (xHCI, NE2K, Intel HDA, Bochs VBE, and others), a full TCP/IP networking stack (Ethernet through TLS), a preemptive scheduler with IPC channels, an identity and trust lattice, and a deterministic replay subsystem. Nine IoT board drivers (STM32F4, ESP32-C6, Raspberry Pi 4, nRF52840, RP2040, nRF9160, STM32L4, FE310, and QEMU virt) cover ARM, RISC-V, and hosted targets with 88 register-level sub-tests; the IoT protocol stack implements MQTT v5.0, CoAP, and LwM2M, and a compliance-evidence module maps 60 regulatory requirements across the EU Cyber Resilience Act, ETSI EN 303 645, NISTIR 8259A, and IEC 62443 to language features that satisfy each one.

The plug architecture ships 53 transpiler plugs across programming languages (Ada through Zig), UI frameworks (Angular through WPF), GPU targets (PTX for NVIDIA, SPIR-V for Vulkan/OpenCL), and binary formats (CDX, ELF, PE, GPT/FAT images). ARM64 and RISC-V cross-compilation plugs produce ELF binaries that meet or beat GCC -O0 on micro-benchmarks across all four test cases; x86-64 codegen beats MSVC /O2 on a tight accumulator loop (14 instructions vs 23). SIMD ships as first-class `Vector N T` types with dependent lane counts and SSE2 packed codegen.

630 application modules span 47 apps: an ERP suite with five industry verticals, an e-commerce platform, a relational database server with MVCC and WAL, a creative suite (3D modelling, image editing, animation, audio/DAW, video compositing), a collectible card game platform with web portal, a desktop environment, and 20 single-purpose web apps on a shared runtime. The C# transpiler plug emits the full compiler (2,376 definitions) and the result compiles under `dotnet build` with zero errors. The UEFI-bootable GPT disk image (8 MB) runs on real x86-64 hardware and provides an interactive coloured developer console with keyboard navigation.

The bootstrap reference compiler was retired on 24 April 2026 and is kept only as historical record; no other-language toolchain remains in the chain. The strain to watch is the one the project chose deliberately: bare-metal memory ceilings make compiler heap usage a first-class engineering campaign, run with measured per-change verdicts.

## Agent tooling.

CLAUDE.md is the operating contract: build gates, process rules, and prohibitions that agents follow verbatim, with per-agent identity files and a documented Perforce protocol for parallel streams. The compiler emits numbered diagnostics from a central registry (CdxCodes, organised into ranges &mdash; 0xxx infrastructure and lexer, 1xxx parser, 2xxx type checker, 3xxx name resolver, 4xxx proof and capability, 6xxx punctual enforcement, 9xxx compiler-internal) written to state what went wrong, where, and the suggested fix &mdash; diagnostics are treated as a feature with their own design rule. The build surface is fully scriptable (single-command gates, parallel test battery, single-file compile), deterministic replay ships as an OS quire, and the development history itself &mdash; bootstrap stages, gate results, measured memory campaigns &mdash; is recorded in-tree as the working memory of the agent team that maintains it.
