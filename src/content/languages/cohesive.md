---
name: Cohesive
camp: verification
spans_camps: []
one_liner: "A family of embedded system-definition languages that lower typed C# declarations into portable semantic IR for validation, execution, and infrastructure-specific compilation."
url: https://github.com/cohesivesystems/cohesive
repo: cohesivesystems/cohesive
paper: null
author: Leo Gorodinski / Cohesive Systems
implementation_language: C# and TypeScript
compilation_target: "Canonical semantic IR; .NET reference interpreters and runtime integrations; SQL, OpenAPI, GraphQL, TypeScript, and infrastructure artifacts through adapters"
license: Apache-2.0
maturity: early_implementation
date_appeared: 2026-10
agent_tooling: [AGENTS.md, structured diagnostics, source maps, semantic fingerprints]
key_idea: |
  Raise the unit of agent authoring from individual computations to explicit system semantics: entities, relations, transitions, processes, APIs, presentation, and infrastructure requirements. Embedded C# authoring surfaces produce canonical, persistable IR that is independent of the host-language syntax. Compilers and interpreters consume that model, matching semantic requirements against explicit target capabilities and constraints.
crossrefs:
  - slug: axis
    name: Axis
    camp: syntactic
    relation: "Both provide first-class declarations spanning application concerns rather than only individual computations. Axis uses a standalone backend language shaped for small models; Cohesive embeds a family of semantic languages in C# and separates their portable models from infrastructure-specific interpretations."
  - slug: hale
    name: Hale
    camp: verification
    relation: "Both make system structure and constraints explicit. Hale combines computation with communicating components, placement, and architectural claims in a standalone language; Cohesive models application domains and infrastructure requirements through embedded authoring surfaces and portable IR."
  - slug: semaprax
    name: SEMAPRAX
    camp: verification
    relation: "Both expose explicit semantics, stable identities, revisions, and structured tooling for agent-driven evolution. SEMAPRAX derives a semantic program graph from its standalone source language; Cohesive materialises canonical system models from typed builders and generated authoring projections."
---

## The thesis.

Cohesive is a family of system-definition languages, initially embedded in C#, designed for agent-first authoring and human review. Its premise is that agents and people benefit from an explicit, shared representation of what a system means across application layers.

Its semantic domains include entities, relationships and queries, state transitions, multistep processes, APIs, presentation, and infrastructure requirements. These domains have distinct constructs and compilation boundaries, with typed references connecting their declarations.

Embedding preserves access to an established language, type system, tooling, and ecosystem. The resulting semantic models are independent of the C# authoring syntax: builders and source generators produce canonical IR, while validation, compilation, and interpretation consume the materialised model.

<p class="pullquote">Define system semantics once, then attach multiple interpretations.</p>

## What it looks like.

Ordinary C# records supply data contracts. A domain declares an entity and its transition, a process invokes that transition, and an infrastructure model declares logical resources and readiness requirements. Namespace imports and runtime bindings are omitted.

<div class="code-sample">
  <div class="code">
<pre>public sealed record Order(string Id, bool Submitted);
public sealed record SubmitOrder(string OrderId);
public sealed class OrdersDomain : DomainModel
{
    public DomainEntity&lt;Order&gt; Orders { get; }
    public Transition&lt;Order, Unit, bool&gt; Submit { get; }
    public OrdersDomain() : base(revision: "1")
    {
        Orders = Entity&lt;Order&gt;("orders");
        Submit = Orders.Transition&lt;bool&gt;(
            id: new("orders/submit"), revision: new("1"),
            transition =&gt; transition
                .Requires(order =&gt; !order.Submitted, order =&gt; false)
                .Set(order =&gt; order.Submitted, true)
                .Return(true));
    }
}
[Process(id: "orders/submit-process", revision: "1")]
public sealed partial class SubmitOrderProcess(OrdersDomain domain)
    : ProcessModel&lt;SubmitOrder, bool&gt;
{
    protected override async ProcessTask&lt;bool&gt; Execute(
        ProcessContext process, SubmitOrder input)
    {
        return await process.Transition(domain.Submit, input.OrderId);
    }
}
public sealed class OrdersInfrastructure : InfrastructureModel
{
    public OrdersInfrastructure()
    {
        Define(
            id: new("orders"), revision: new("1"),
            bindingProfileId: new("orders/bindings"),
            infra =&gt;
            {
                var state = infra.Resource(new("orders/state")).Persistent();
                infra.Workload(new("orders/worker")).RequiresReady(state);
            });
    }
}</pre>
  </div>
  <p class="caption">A guarded transition, a process referencing that exact transition, and logical infrastructure requirements. The process method is compiler input rather than an application callback. Storage and process-runtime bindings are supplied separately; the readiness edge alone does not establish them.</p>
</div>

Transition expressions lower into canonical IR rather than surviving as arbitrary delegates. The Process source generator similarly translates supported asynchronous syntax into Process IR; it does not persist a CLR state machine.

## Distinctive moves.

**Embedded authoring, independent semantics.** Typed C# builders and generated authoring projections produce portable semantic models. Direct IR construction and other producers can target the same representation.

**System definition across layers.** Domain operations, queries, processes, APIs, presentation, and infrastructure requirements are explicit declarations. Typed references and generated contracts connect these layers without requiring independently maintained descriptions of the same behaviour.

**Capability-driven compilation.** Semantic requirements are declared independently of infrastructure targets. Adapters describe capabilities, constraints, and guarantees; compilers determine whether a target can realise the requested semantics. Unsupported requirements should produce diagnostics rather than silently weaker behaviour.

**Multiple interpretations.** Canonical models support execution and artifact generation alongside validation, simulation, inspection, and other non-execution uses. Interpretation coverage varies by semantic domain and adapter.

**Attributable defaults.** Conventions supply common authoring and compilation defaults. The architectural goal is deterministic, inspectable decisions with explicit configuration and local overrides where necessary.

## Maturity.

Cohesive is an early R&D implementation with working semantic models, typed builders, validators, reference interpreters, source generators, code generators, and infrastructure integrations. Existing integrations include PostgreSQL, Cosmos DB, ASP.NET Core, Azure Durable Task, and TypeScript projections.

Its breadth creates a substantial coverage challenge. Authoring APIs are evolving, capabilities differ across adapters, and some integrations remain experimental or require further qualification. The existence of an adapter does not establish support for every semantic construct.

The Verification classification reflects explicit semantics, invariants, validation, and inspectable compilation boundaries. It does not imply comprehensive theorem proving or verified equivalence across all interpretations. Cohesive's process language describes application workflows; agent coordination is not its primary organising principle.

Comparative claims about agent productivity remain an evaluation goal rather than an established result.

## Agent tooling.

The repository includes AGENTS.md guidance covering semantic authority, deterministic lowering, capability preservation, and agentic authoring. Canonical execution documents retain identities, revisions, source maps, structured diagnostics, and semantic fingerprints.

These mechanisms support inspection of materialised semantics and attribution of diagnostics and derived artifacts to source declarations. Agents can author through typed C# surfaces while compiler and validation tooling operate on the resulting semantic models.

Agent-facing support remains under development. This entry does not claim a complete MCP-based authoring interface or a published agent-performance benchmark.
