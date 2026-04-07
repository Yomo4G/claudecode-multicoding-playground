# Agent Orchestration

This rule governs the multi-agent orchestration system
for Claude Code during autonomous execution.

## Precondition

The multi-agent orchestration system is active ONLY when
the `.claude/agents/` directory exists.

If the directory does not exist, Claude Code operates
in single-agent mode with no orchestration capabilities.

## Activation Requirements

The orchestration system must NOT activate until ALL
of the following are true:

1. `/yoroshiku` has been invoked and GO has been granted
2. `.claude/agents/` directory exists
3. `.claude/agents/team.yaml` exists and is valid
4. At least one task is defined in `.claude/tasks/`

## Roles

The system defines 9 agent roles:

| Role | Description |
|------|-------------|
| orchestrator | Coordinates task assignment and agent lifecycle |
| implementer | Writes product code after approval |
| reviewer | Reviews code for quality and architecture |
| security-auditor | Audits code and dependencies for security issues |
| review-recorder | Consolidates review results into structured records |
| e2e-tester | Runs end-to-end integration tests after implementation |
| verifier | Runs tests, lint, and build checks |
| refactorer | Simplifies and improves code structure |
| reporter | Updates dashboard.md with execution state |

Each role is defined in `.claude/agents/{name}.yaml`.

## Orchestrator Responsibilities

The orchestrator is the main Claude Code instance.
It is NOT a subagent.

Responsibilities:
- Read `team.yaml` to determine team composition
- Spawn subagents according to team configuration
- Assign tasks to agents based on role and availability
- Monitor agent status via state files
- Enforce workflow pipeline ordering
- Make scaling decisions based on defined criteria
- Terminate agents when work is complete
- Manage shared contract lifecycle per shared-contracts rule

Prohibitions:
- The orchestrator must NOT write product code directly
- The orchestrator must NOT bypass the workflow pipeline
- The orchestrator must NOT spawn agents not defined in `team.yaml`
- The orchestrator must NOT modify agent definition files

## Agent Lifecycle

Each agent follows this lifecycle:

    Spawn → Execute → Report → Terminate

### Spawn

The orchestrator spawns agents using the Task tool
with `subagent_type` as defined in the agent's YAML.

Instance naming convention: `{name}-{index}`
- Examples: `implementer-0`, `implementer-1`, `reviewer-0`
- Index starts at 0 and increments for scaled instances

### Execute

The agent performs its assigned task within its authority.
Each agent must:
- Write its status to `.claude/state/agent-status/{name}-{instance}.json`
- Stay within its defined `writable_paths`
- Use only its `permitted_commands`
- Respect its `constraints`

### Report

Upon task completion, the agent writes its result to:
`.claude/state/agent-results/{name}-{instance}-{task-id}.json`

### Terminate

The orchestrator terminates agents when:
- The assigned task is complete
- An unrecoverable error occurs
- The agent times out (10 minutes without status update)

## State File Contracts

### Agent Status

Path: `.claude/state/agent-status/{name}-{instance}.json`

```json
{
  "agent": "<name>-<instance>",
  "role": "<role>",
  "status": "idle | working | blocked | error | done",
  "assigned_task": "<task-id or null>",
  "started_at": "<ISO 8601>",
  "updated_at": "<ISO 8601>"
}
```

### Agent Results

Path: `.claude/state/agent-results/{name}-{instance}-{task-id}.json`

```json
{
  "agent": "<name>-<instance>",
  "task_id": "<task-id>",
  "result": "success | failure | partial",
  "summary": "<brief description>",
  "issues": [],
  "completed_at": "<ISO 8601>"
}
```

## Communication Protocol

All agent communication is filesystem-based.

Rules:
- Agents must NOT communicate directly with each other
- All coordination flows through the orchestrator
- State files are the only shared communication medium
- Each agent writes only its own state files
- The reporter is the sole writer of `dashboard.md`

## File Conflict Avoidance

To prevent file write conflicts:
- Each agent writes only to files under its own instance namespace
- Product code writes are serialized through the workflow pipeline
  (only one implementer works on a given file at a time)
- `dashboard.md` is written exclusively by the reporter agent
- State files use agent-instance-specific filenames

## Dashboard Update Contract

The reporter agent is the sole writer of `dashboard.md`.
Other agents must NOT write to `dashboard.md`.

Instead, they write results to `.claude/state/agent-results/`
and the reporter reads those to update the dashboard.

The reporter updates:
- Agent Status table
- Tasks Overview section
- Overall Progress
- Review Summary (from `.claude/state/review-records/`)
- Notes section

### Reporter Triggers

The orchestrator fires the reporter on these events:

| Trigger | When it fires |
|---------|---------------|
| task-started | A task is assigned to an agent |
| task-completed | An agent reports task completion |
| agent-error | An agent enters error status |
| phase-transition | A task moves to the next pipeline stage |
| scaling-event | An agent instance is scaled up or down |
| review-completed | A reviewer closes a review record |
| record-completed | The review-recorder finishes writing a record |
| session-resume | The orchestrator resumes from a paused session |
| periodic | Every 3 completed tasks |

## Workflow Pipeline

The default task workflow is:

    implementer → e2e-tester → [reviewer, security-auditor] → review-recorder → verifier

Rules:
- E2e testing runs immediately after implementation
- Review and security audit run in parallel after e2e passes
- Review-recorder runs after both reviewer and security-auditor complete
- Review-recorder consolidates results into a unified review record
- Verification runs only after review-recorder completes
- If review or audit raises issues, the task returns to implementer
- The refactorer may be inserted before verifier when requested

### E2e Feedback Loop

When the e2e-tester reports failure:

1. The orchestrator creates a fix subtask
   from the failure description
2. The fix subtask is assigned to the implementer
3. After the implementer completes the fix,
   the e2e-tester runs again
4. Maximum 3 retries per task
5. After 3 failures, the task is blocked
   and human intervention is requested

### Review Record Lifecycle

Review records are structured markdown files
that track review findings and their resolution.
See `.claude/rules/review-records.md` for the full specification.

The review record includes a Perspectives Applied section
that documents all checklists verified and their outcomes.
This ensures traceability of what was checked,
not just what was found.

The review record lifecycle within the workflow pipeline:

1. **Review phase**: The reviewer and security-auditor
   run in parallel. Each writes its results
   (including findings and perspectives applied)
   to `.claude/state/agent-results/`.

2. **Record phase**: The review-recorder reads both
   result files and creates a unified review record at
   `.claude/state/review-records/{task-id}-review.md`
   with Perspectives Applied, Findings, and status.

3. **If findings exist**: The orchestrator reads the review record
   and creates a fix subtask for the implementer.
   The fix subtask includes the review record path.

4. **Fix phase**: The implementer fixes the issues
   and updates the review record's Fix Actions section
   and each Finding's Resolution field.

5. **Re-review phase**: The orchestrator re-assigns
   the task to the reviewer. The reviewer verifies fixes
   and updates its result file.

6. **Re-record phase**: The review-recorder updates the record,
   increments the revision number,
   and sets status to `closed` if all findings are resolved.

7. **If unresolved findings remain**: The cycle repeats
   from step 3. Maximum 3 review cycles per task.

Review records persist after task completion
for traceability and retrospective analysis.

## Contract-First Pipeline Extension

When tasks have shared contracts
(as defined in `.claude/rules/shared-contracts.md`),
the pipeline is extended:

    contract-define → implement (parallel) → e2e-test → [review, security-auditor] → review-recorder → verifier

Rules:
- The contract-define step runs before parallel implementation
- Only the producing task's implementer defines the contract
- Consuming tasks cannot enter the implement stage
  until their required contracts are defined
  in the producer task's definition file
- The orchestrator writes contract content
  into task definition files after receiving
  the implementer's result

## Scaling Decisions

The orchestrator may scale agents up or down based on criteria
defined in `team.yaml`.

### Scale Up

Spawn an additional instance when:
- Task queue depth exceeds the configured threshold
- Parallel-eligible tasks are waiting while agents are busy

### Scale Down

Terminate an instance when:
- No tasks are queued for the agent's role
- The agent has been idle for more than 5 minutes

### Constraints

- Never exceed `max` instances defined in the agent's YAML
- Never go below `min` instances
- Check for scaling conflicts defined in `team.yaml`

## Error Handling

When an agent encounters an error:

1. The agent updates its status to `error` in its status file
2. The orchestrator retries the task once with the same agent
3. If the retry fails, the orchestrator:
   - Marks the task as blocked
   - Reports the error to the user
   - Requests human intervention
4. The orchestrator does NOT retry more than once per task per agent

## Agent Timeout

If an agent does not update its status file for 10 minutes:

1. The orchestrator treats the agent as errored
2. The orchestrator terminates the agent
3. The task is reassigned or marked as blocked

## Integration with Commands

### `/yoroshiku`

When `/yoroshiku` grants GO and `.claude/agents/` exists:

1. Read `team.yaml` for team composition
2. Read all agent definition YAMLs
3. Create `.claude/state/agent-status/` directory if needed
4. Create `.claude/state/agent-results/` directory if needed
5. Create `.claude/state/review-records/` directory if needed
6. Spawn agents with `min > 0` in the team configuration
7. Update `dashboard.md` Agent Status table via reporter
8. If resuming from a previous session
   (state files exist),
   fire `session-resume` trigger for the reporter
   to sync dashboard with current state

### `/retro`

When `/retro` is invoked:

1. Read all agent result files from `.claude/state/agent-results/`
2. Read all agent status files from `.claude/state/agent-status/`
3. Read task definitions from `.claude/tasks/`
4. Analyze rework patterns across all categories
5. Generate rules (human approval)
6. Generate retro report to `.claude/state/retro-report.md`
7. Fire `retro-completed` trigger for the reporter

## Skill Lifecycle Integration

Skills are created through conversation with user approval.
Agents do not autonomously detect or propose skills
during task execution or retrospective analysis.
The `.claude/state/skill-candidates/` directory is not used.

## Single-Agent Fallback

When `.claude/agents/` does not exist:
- Claude Code operates as a single agent
- No orchestration, no subagents, no state files
- All work is performed directly by the main instance
- This is the default mode
