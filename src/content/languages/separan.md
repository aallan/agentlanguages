---
name: Separan
camp: syntactic
spans_camps:
  - verification
one_liner: "Named block boundaries are checked against their closers; parsed structural identities can also delimit and verify AI edit scopes."
url: https://github.com/mocchii2/Separan
repo: mocchii2/Separan
paper: null
author: mocchii2
implementation_language: Python and C
compilation_target: Python runtime and native C executable
license: Apache-2.0
maturity: working_compiler
date_appeared: 2026-08
agent_tooling:
  - VS Code extension and Language Server Protocol (LSP)
  - Structural inspection and diff CLI
  - AST-based AI edit-scope verification
  - JSON diagnostics for CI and review tooling
key_idea: |
  Separan makes structural boundaries explicit in source: named logic blocks
  and control-flow blocks must be closed with matching labels. Its structural
  tooling derives hierarchical identities and fingerprints from the parsed AST,
  then uses them to check whether a change stays inside an allowed edit scope.
crossrefs:
  - slug: tacit
    name: Tacit
    camp: syntactic
    relation: "Both make program structure central to authoring, but take opposite positions on names. Tacit treats the AST as authoritative and removes semantic weight from display names; Separan keeps readable names in source and makes matching opener/closer labels part of the checked structure."
  - slug: reqlan
    name: reqlan
    camp: verification
    relation: "Both give names a machine-checkable role. reqlan resolves requirement-graph edges to files, symbols, and tests beside host-language code; Separan parses an executable language and uses named AST boundaries to identify and constrain source edits."
  - slug: intent
    name: Intent
    camp: verification
    relation: "Both expose machine-checkable structure to support agent-authored code, but check different properties. Intent verifies contracts and their references; Separan's structural review tooling checks edit boundaries and does not establish behavioral correctness."
---

## The thesis.

Separan starts from a source-level problem: when a block's purpose and boundary are implicit, a reader or editing tool has to reconstruct them from indentation or surrounding syntax. Separan instead names the boundary. A logic unit opens with `SEP:name` and closes with `END_SEP:name`; labeled control-flow blocks use the same matching-label principle. The parser reports a structural mismatch rather than treating a differently named closer as an equivalent boundary.

<p class="pullquote">Name the boundary, then check that the edit stayed inside it.</p>

The primary move is syntactic, not a claim that naming alone proves a program correct. Names remain readable to a person, while matching rules make selected boundaries mechanically checkable. That design is distinct from Tacit's canonical-AST approach: Separan keeps ordinary source text and meaningful identifiers rather than making text a projection of an AST.

## What it looks like.

<div class="code-sample">
  <div class="code">
<pre><span class="kw">SEP</span>:main
<span class="kw">if</span> user.active :active_user
print "active"
<span class="kw">endif</span>:active_user
<span class="kw">END_SEP</span>:main</pre>
  </div>
  <p class="caption">The opener and closer name the logic unit, and the conditional must close with the label used at its opening.</p>
</div>

Separan's structural tooling extends the same idea to review. It assigns hierarchical identities such as `SEP:main#1/if:active_user#1` to AST boundaries and computes versioned SHA-256 fingerprints that exclude source positions, indentation, blank lines, and comments. The `separan-structure diff` command compares parsed structures; `separan-structure verify` checks that changes fall within explicitly allowed scopes. Semantic tags can also select separately located logic units for a scoped change.

## Distinctive moves.

- **Named, checked boundaries.** `SEP`/`END_SEP` and labeled control-flow closers expose the structure in source and reject mismatched labels.
- **AST identities for review.** Hierarchical identities keep repeated labels addressable, while fingerprints distinguish structural changes from movement or formatting.
- **Explicit edit scopes.** A reviewer or CI job can permit changes beneath a selected boundary and fail when changes occur outside it. Ambiguous short labels require a more specific path rather than fuzzy matching.

## Maturity.

Separan has Python and native C implementations, a command-line runtime, and a published language specification. Structural diff and edit-scope verification are implemented as a preview tooling layer. These checks constrain where a change occurs; they do not prove that the changed code has the intended behavior. Tests, type checks, and other semantic checks remain necessary.

## Agent tooling.

The project ships a VS Code extension and a language server, along with structural inspection, diff, and scope-verification commands. The review commands also offer JSON output for CI and review integrations. The [structural AI workflow specification](https://github.com/mocchii2/Separan/blob/main/spec/structural-ai.md) documents identities, fingerprints, scope rules, and exit statuses; the [README](https://github.com/mocchii2/Separan) provides the language overview and runnable examples.
