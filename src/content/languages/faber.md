---
name: Faber
camp: syntactic
spans_camps: []
one_liner: "Typed compute language designed for coding agents to author and for humans to read. Mechanical, predictable syntax; reader locales so a speaker of Chinese or Thai can talk to a model and write the program in that language. Same HIR, same compile."
url: https://faberlang.dev
repo: faberlang/faber
paper: null
author: Ian Zepp
implementation_language: Rust
compilation_target: Rust, TypeScript, Go, Swift, LLVM IR, WebAssembly, Metal, CUDA
license: MIT
maturity: working_compiler
date_appeared: 2025-01
agent_tooling:
  - llms.txt / llms-full.txt
  - SKILL.md (install, language, examples, corpus)
  - well-known agent-skills catalog
  - Markdown agent guide under /en-US/
  - faber explain for glyphs, keywords, and diagnostic codes
key_idea: |
  Faber is built for a split audience. Coding agents write the source;
  humans read it. The surface is mechanical and predictable — type-first
  declarations, sealed keywords, math glyphs for tensor work — so a model
  can emit it without inventing syntax. Humans are not expected to type
  · ⊗ ⊙. HIR is the program: a reader locale is a rendering, which is why
  someone can speak Chinese or Thai to their model, read and write the
  .fab file in that language, and still compile the same meaning.
crossrefs:
  - slug: tacit
    name: Tacit
    camp: syntactic
    relation: "Tacit also treats the tree as more authoritative than one national-language spelling. Faber uses that split so a person can author with a model in their own language; Tacit uses it to canonicalise a single text and drop names toward De Bruijn indices."
  - slug: x07
    name: X07
    camp: syntactic
    relation: "X07 deletes text and edits JSON ASTs. Faber keeps text on purpose: the agent still writes a .fab file, just a sealed, locale-rendered one a human can read."
  - slug: zero
    name: Zero
    camp: verification
    relation: "Both ship agent-facing compiler output (skills, structured explainers). Zero's bet is verification and typed repair; Faber's is a predictable authoring surface plus native-language reader packs."
  - slug: vera
    name: Vera
    camp: verification
    relation: "Both publish llms.txt and skills. Vera removes parameter names so the model cannot lean on them; Faber keeps readable names and moves the language barrier into locale packs so the model can write in the human's language."
history:
  - when: "2025"
    what: "Faber Romanus first appears as a typed compute language with reader-localised source and a closed compiler (Radix)."
  - when: "Aug 2026"
    what: "Public CLI documents first correct end-to-end compiled inference against pinned goldens (not a shipped device-GPU inference product). Site first-contact path and experimental-through-v1 banner land."
---

## The thesis.

Faber is a language for coding agents to write and for humans to read. The syntax is deliberately mechanical: type-first bindings, one locale pack per file, a small glyph set for tensor work, no mixed-language spellings. A model is supposed to emit that surface without guessing. A person is supposed to read the result, not sit and type `·` and `⊗`.

HIR is what makes the second half work across languages. The compiler holds one analysed program. A `.fab` file is a rendering into a reader locale — English by default, also Latin (interchange, not costume), Thai, Simplified and Traditional Chinese, Arabic, Vietnamese, Hindi. Someone who thinks in Thai can talk to their model in Thai, read the program in Thai, write the program in Thai, and it still compiles. Keywords and primitive type names change; identifiers and structural glyphs do not. Meaning does not fork.

<p class="pullquote">Agents write it. Humans read it. The locale is theirs; the meaning is one program.</p>

The same HIR then projects onto measured compilation targets. Application lowers currently include Rust, TypeScript, Go and Swift; the MIR lane includes LLVM IR and WebAssembly; the GPU lane names Metal and CUDA. Support is stated target by target. Bounded dual-backend training on Metal and CUDA is the current proven device claim; end-to-end device GPU inference is not shipped.

## What it looks like.

<div class="code-sample">
  <div class="code">
<pre><span class="kw">main</span> {
    <span class="kw">const</span> <span class="ty">tensor</span>&lt;<span class="ty">f32</span>, [2, 3]&gt; a ← <span class="kw">empty</span>
    <span class="kw">const</span> <span class="ty">tensor</span>&lt;<span class="ty">f32</span>, [3, 4]&gt; b ← <span class="kw">empty</span>
    <span class="kw">const</span> <span class="ty">tensor</span>&lt;<span class="ty">f32</span>, [2, 4]&gt; product ← a <span class="op">·</span> b
    <span class="kw">print</span> product
}</pre>
  </div>
  <p class="caption">English reader surface. The same HIR renders into Thai or Chinese; a human reads their keywords, an agent emits the sealed pack, the matmul glyph and the names stay put.</p>
</div>

Declarations are type-first (`const tensor&lt;f32, [2, 3]&gt; a`, not `a: Tensor`). Runtime binds use `←`. Tensor work that is a nested index walk in ordinary code is a glyph or a method: `·` matmul, `⊗` outer product, `⊙` Hadamard, `↦` convert, `.mean()` / `.sum()` for reductions. Locales are sealed: `fn` and `functio` do not mix in one file.

## Distinctive moves.

- **Agents author; humans read.** The surface is mechanical so a model can emit it. Glyphs are for the agent and the reader, not for a human to hunt on a keyboard.
- **Native-language loop through HIR.** Speak to the model in Chinese or Thai, write and read the `.fab` in that locale, compile the same program.
- **Sealed reader packs.** One locale per file. English is the default writing surface; Latin is the interchange template, not a required writing language.
- **Predictable tensor surface.** Rank-aware operators carry shape contracts into typechecking (inner-dimension unification on `·`, identical-shape on `⊙`).
- **Agent-facing docs shipped with the product.** `faberlang.dev/llms.txt`, a skills catalog, and `faber explain` for glyphs, keywords and diagnostic codes.
- **Honest capability ladder.** Reader-localised source is shipped. Bounded Metal/CUDA training is proven. Device GPU inference and multi-device execution are not current product claims. Version 1 is experimental; stability is a version 2 claim.

## Maturity.

A working `faber` CLI ships as tagged release archives for macOS arm64 and Linux x86_64. The language, public libraries (including Gradus, the MIT autograd and ML library), examples and the documentation site are MIT. Radix, the compiler, is closed while it is under active development; that is presented as temporary, not as a permanent fence. Public GitHub organisation `faberlang` holds the open surface; the Haskell project at `faber-lang/faber` is unrelated.

The strain under real use is the usual early-language one, plus a specific honesty gap: the tensor and inference *surface* is large (Gradus is a substantial Faber library) while device residency and GPU execution remain compiler and host concerns. A catalogue reader should not take the glyph surface as a shipped serving product.

## Agent tooling.

`https://faberlang.dev/llms.txt` is the machine index; `llms-full.txt` is the expanded map. The site content-negotiates an agent guide at `/en-US/` and publishes skills for install, language, packages, examples and corpus. `faber explain` answers glyphs, keywords, grammar terms and diagnostic codes. The inclusion claim is the design intent — agents as authors of a locale-rendered, mechanically predictable HIR — plus that shipped tooling, not a runtime chatbot wrapped around another language.
