---
name: MoonBit
camp: verification
one_liner: "AI-friendly general-purpose language. ICSE 2024 paper on real-time semantics-aware token sampling. Three years of training data."
url: https://www.moonbitlang.com
repo: null
paper: null
author: Hongbo Zhang / IDEA Shenzhen
implementation_language: OCaml
compilation_target: "WASM GC, JavaScript, native (C codegen), LLVM"
license: Unknown
maturity: working_compiler
date_appeared: 2023-01
agent_tooling:
  - "`moon doc` AI symbol lookup"
  - MoonBit Pilot coding agent
  - "`declare` keyword for AI-native specification"
key_idea: |
  AI-friendly general-purpose language with the deepest history in the
  space — three years of training data, full toolchain across four
  backends, a package registry (mooncakes.io), cloud IDE, and IDE plugins.
  Published an ICSE 2024 paper on a real-time semantics-aware token
  sampler. Backed by the International Digital Economy Academy (Shenzhen).
crossrefs:
  - slug: vera
    name: Vera
    camp: verification
    relation: "Both verification camp; opposite breadth. MoonBit is a full-stack general-purpose language; Vera narrows to checkability and drops names entirely. MoonBit assumes the model needs help; Vera assumes the model needs supervision."
  - slug: zero
    name: Zero
    camp: verification
    relation: "Closest in industrial backing (Vercel Labs vs IDEA Shenzhen) and product framing. Zero leans syntactic (one obvious way to express things); MoonBit leans toward typed sampling at the model level."
  - slug: ailang
    name: AILANG
    camp: verification
    relation: "Both ship effect typing; MoonBit's is conventional, AILANG's is row-polymorphic with capability-based carving (IO/FS/Net/Clock/AI). MoonBit's edge is the training data depth that no other entry has."
history:
  - when: "2023"
    what: "MoonBit project initiated at IDEA Shenzhen under Hongbo Zhang. Pre-LLM-craze; framing changes over the following two years."
  - when: "Jan 2024"
    what: "ICSE 2024 paper on real-time semantics-aware token sampling for MoonBit code generation."
  - when: "2024–2025"
    what: "Toolchain hardens: four backends (WASM GC, JavaScript, native via C codegen, LLVM), package registry (mooncakes.io), cloud IDE, VS Code and IntelliJ plugins, debugger."
  - when: "2026"
    what: "<code>declare</code> keyword and MoonBit Pilot agent ship, repositioning the language explicitly as AI-native rather than just AI-friendly."
---

## The thesis.

MoonBit is the catalogue's exception that proves the rule. Most entries are recent (Jan–May 2026); MoonBit has been shipping since 2023. Most are single-author or small-team experiments; MoonBit is backed by the International Digital Economy Academy in Shenzhen and led by Hongbo Zhang, who created ReScript and contributed to OCaml. Most ship a thought experiment or an early implementation; MoonBit ships four backends, a package registry, a cloud IDE, and two IDE plug-ins.

<p class="pullquote">The model doesn't need to be retrained. The sampler needs to know the type system.</p>

The distinctive technical move is in how the model interacts with the compiler. The ICSE 2024 paper describes a real-time semantics-aware token sampler: as the model generates code, a fast type-checker prunes ill-typed continuations at the token level. The model can still hallucinate, but the hallucinations never get past the sampler. This is closer to the verification camp's "make it checkable" intuition than the syntactic camp's "make it easier to generate" — applied at the layer where the generation actually happens.

## Distinctive moves.

- **Real-time semantics-aware sampling.** The compiler participates in token generation, not just post-hoc checking.
- **`declare` keyword.** A first-class form for AI-native specification of intent and constraints, distinct from regular function signatures.
- **Four backends.** WASM GC, JavaScript, native (via C codegen), and LLVM. No other entry in the catalogue targets this breadth.
- **mooncakes.io.** A first-party package registry. Most catalogued languages don't have one because there's no ecosystem yet; MoonBit has the ecosystem.
- **Three years of training data.** The unmatched advantage. Every other entry is racing to generate examples; MoonBit has them.

## Maturity.

The most mature project in the catalogue by a clear margin. 2,115+ stars (the second-highest after Zero). Full toolchain, multiple backends in active production use, IDE integrations across both major desktop IDEs, working debugger. Documentation depth and developer experience are at a level no other entry approaches.

The pragmatic question is whether MoonBit's general-purpose framing remains compelling against narrower agent-native languages as the field matures. MoonBit's bet is that general-purpose plus AI-aware tooling beats agent-native plus narrow ecosystem. The next two years will test it.

## Agent tooling.

`moon doc` exposes AI-friendly symbol lookup; MoonBit Pilot is a coding agent that targets MoonBit specifically; the `declare` keyword gives agents a structured way to express intent. Less prominent than the SKILL.md/AGENTS.md pattern other catalogue entries use — MoonBit's bet is that an agent that knows the language outperforms an agent reading instructions about the language.
