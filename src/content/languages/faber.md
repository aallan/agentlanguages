---
name: Faber
camp: syntactic
spans_camps: []
one_liner: "Typed compute language whose analysed HIR is the program. Reader locales and compilation targets are projections of that core. Designed for coding agents; tensor work uses math glyphs."
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
  Faber treats HIR as the source of truth. What a human or agent types is a
  rendering into a reader locale: keywords and primitive type names change,
  identifiers and structural glyphs do not. The same analysed program then
  lowers, target by target, toward application backends or a measured GPU
  path. The design bet is that agents author more reliably against one
  semantic core plus machine docs than against a single national-language
  syntax that pretends to be the program.
crossrefs:
  - slug: tacit
    name: Tacit
    camp: syntactic
    relation: "Same diagnosis, different lever. Tacit declares the AST authoritative and projects one canonical text; Faber declares HIR authoritative and projects many reader texts (English, Latin, Thai, Chinese, and others) plus many compilation targets. Tacit fights name-as-error with De Bruijn indices; Faber keeps names and moves the instability into locale packs."
  - slug: x07
    name: X07
    camp: syntactic
    relation: "Further along the same 'text is lossy' axis. X07 deletes the text layer and edits JSON ASTs with JSON Patch; Faber keeps text, but treats each locale file as a sealed rendering of HIR rather than as the meaning. Agents still write source; they are not asked to patch a tree."
  - slug: zero
    name: Zero
    camp: verification
    relation: "Cross-camp neighbour on agent-facing compiler output. Zero invests in structured JSON diagnostics, stable codes, and typed repair plans; Faber invests in locale-sealed source, llms.txt, and shipped skills. Zero's camp is verification; Faber's distinctive move is the HIR-and-projections split, not proof discharge."
  - slug: vera
    name: Vera
    camp: verification
    relation: "Shared agent-docs surface (llms.txt, skills), opposite thesis. Vera removes parameter names and makes every function checkable; Faber keeps a readable type-first surface and makes the same program renderable across locales. Vera assumes the model needs supervision; Faber assumes the model needs a stable meaning and a locale it can emit."
history:
  - when: "2025"
    what: "Faber Romanus first appears as a typed compute language with reader-localised source and a closed compiler (Radix)."
  - when: "Aug 2026"
    what: "A public CLI release documents first correct end-to-end compiled inference against pinned goldens (not a shipped device-GPU inference product). Site first-contact path and experimental-through-v1 banner land."
---

## The thesis.

Faber starts from the observation that coding agents already write most of the source, and that a language designed around one national syntax wastes that fact. The compiler holds one analysed program (HIR). A `.fab` file is a rendering of that program into a reader locale: English is the default writing surface, Latin is the canonical interchange dialect, and other packs (Thai, Simplified and Traditional Chinese, Arabic, Vietnamese, Hindi) exist because they stress the tokenizer and the emitter, not because the language is a novelty costume.

<p class="pullquote">One semantic program. Many ways to read it.</p>

The same HIR then projects onto measured compilation targets. Application lowers currently include Rust, TypeScript, Go and Swift; the MIR lane includes LLVM IR, WebAssembly and related forms; the GPU lane names Metal and CUDA. Support is stated target by target. Bounded dual-backend training on Metal and CUDA is the current proven device claim; end-to-end device GPU inference is not shipped.

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
  <p class="caption">English reader surface from the public localisation notes. Identifiers and the matmul glyph stay put when the same program is rendered into Latin, Thai, or Chinese; only keywords and primitive type names change.</p>
</div>

Declarations are type-first (`const tensor&lt;f32, [2, 3]&gt; a`, not `a: Tensor`). Runtime binds use `←`. Tensor work that is a nested index walk in ordinary code is a glyph or a method here: `·` for matmul, `⊗` for outer product, `⊙` for Hadamard, `↦` for conversion, `.mean()` / `.sum()` for reductions. Locales are sealed: `fn` and `functio` do not mix in one file.

## Distinctive moves.

- **HIR as the program.** Source is a locale rendering. The compiler, not the file extension, owns meaning.
- **Sealed reader packs.** One locale per file. The English pack is where most authoring starts; Latin is the interchange template, not a required writing language.
- **Glyph tensor surface.** Rank-aware operators carry shape contracts into typechecking (inner-dimension unification on `·`, identical-shape on `⊙`).
- **Agent-facing docs shipped with the product.** `faberlang.dev/llms.txt`, a skills catalog, and `faber explain` for glyphs, keywords and diagnostic codes.
- **Honest capability ladder.** Reader-localised source is shipped. Bounded Metal/CUDA training is proven. Device GPU inference and multi-device execution are not current product claims. Version 1 is experimental; stability is a version 2 claim.

## Maturity.

A working `faber` CLI ships as tagged release archives for macOS arm64 and Linux x86_64. The language, public libraries (including Gradus, the MIT autograd and ML library), examples and the documentation site are MIT. Radix, the compiler, is closed while it is under active development; that is presented as temporary, not as a permanent fence. Public GitHub organisation `faberlang` holds the open surface; the Haskell project at `faber-lang/faber` is unrelated.

The strain under real use is the usual early-language one, plus a specific honesty gap: the tensor and inference *surface* is large (Gradus is a substantial Faber library) while device residency and GPU execution remain compiler and host concerns. A catalogue reader should not take the glyph surface as a shipped serving product.

## Agent tooling.

`https://faberlang.dev/llms.txt` is the machine index; `llms-full.txt` is the expanded map. The site content-negotiates an agent guide at `/en-US/` and publishes skills for install, language, packages, examples and corpus. `faber explain` answers glyphs, keywords, grammar terms and diagnostic codes. The inclusion claim is the design intent — agents as authors of a locale-rendered HIR — plus that shipped tooling, not a runtime chatbot wrapped around another language.
