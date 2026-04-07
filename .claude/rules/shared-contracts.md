---
paths:
  - ".claude/tasks/**"
---

# Shared Contracts

This rule governs shared contract specifications
that must be defined before parallel implementation begins.

## Definition

A shared contract is a technical interface specification
that two or more tasks depend on for correctness.

Examples:
- API endpoint specifications (request/response shapes)
- Shared type definitions across frontend and backend
- Database schema definitions used by multiple tasks
- Event schemas for pub/sub or webhook patterns

## Precondition

This rule applies when:
- Multiple tasks share a logical dependency
  on the same technical interface
- Those tasks may be executed in parallel
  by different implementer instances

## Identification During Planning

During `/plan`, for each pair of tasks
that can run in parallel, check whether they
read or write the same technical interface.

If a shared interface is found:
1. Designate one task as the contract producer.
2. Designate the other task(s) as contract consumers.
3. Embed a contract placeholder section
   in the producer task's definition file.
4. Add a contract reference
   in each consumer task's definition file.

## Task Definition Format

### Producer Task

The producer task definition must include
a `## Shared Contracts (Producer)` section
with a placeholder for each contract:

    ## Shared Contracts (Producer)

    ### Contract: {contract-name}

    - Consumers: {task-ids}
    - Status: placeholder

    <!-- Content defined during contract-define phase -->

### Consumer Task

The consumer task definition must include
a `## Shared Contracts (Consumer)` section
referencing the producer:

    ## Shared Contracts (Consumer)

    - Contract: {contract-name}
    - Producer: {task-id}
    - Dependency: contract-only

The `contract-only` dependency means:
the consumer does not wait for the producer task
to fully complete. It waits only for the contract
content to be defined.

## Contract-Define Phase

During execution, when the orchestrator detects
tasks with shared contracts:

1. The orchestrator assigns a contract-define subtask
   to the producer task's implementer.
   The subtask is: "Define the contract specification
   for {contract-name}."

2. The implementer writes the contract specification
   to its result file
   (`.claude/state/agent-results/{name}-{instance}-{task-id}.json`)
   in the `summary` field.

3. The orchestrator reads the result and writes
   the contract content into the producer task's
   definition file, replacing the placeholder.

4. The orchestrator updates the contract status
   from `placeholder` to `defined`.

5. Only after the contract is defined
   may the orchestrator assign consuming tasks
   to implementer instances.

6. The orchestrator passes the contract content
   as part of the context when spawning
   the consuming task's implementer.

## Contract Content Format

The contract content must include enough detail
for both producer and consumer to implement
consistently. For API contracts:

    ### Contract: {contract-name}

    - Consumers: {task-ids}
    - Status: defined

    #### {METHOD} {path}

    Request:
    - {field}: {type} ({required|optional})

    Response ({status}):
    - {field}: {type}

    Error Response ({status}):
    - {field}: {type}

## Implementer Obligations

### As Contract Producer

When assigned a contract-define subtask:
- Define the interface specification concisely
- Include all fields, types, and status codes
- Write the specification to the result file

When assigned the full implementation task:
- Implement according to the contract exactly
- Do not deviate from the defined specification

### As Contract Consumer

When assigned a task with contract dependencies:
- Read the contract from the context provided
  by the orchestrator
- Implement according to the contract exactly
- If the contract appears incorrect or incomplete,
  report to the orchestrator and stop

## Verifier Obligations

When verifying a task that has shared contracts:

1. Read the contract from the producer task's
   definition file.
2. Verify that the producer's implementation
   conforms to the contract.
3. Verify that each consumer's implementation
   conforms to the contract.
4. Report deviations as verification failures.

## Constraints

- The orchestrator must not assign consuming tasks
  until the contract is defined.
- Contract content must not be modified
  after the status changes to `defined`
  without orchestrator coordination.
- If a contract change is needed:
  1. Pause all consuming tasks
  2. Update the contract in the task definition
  3. Notify all consumer implementers
  4. Resume consuming tasks
