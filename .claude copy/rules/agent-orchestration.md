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

The system defines 7 agent roles:

| Role | Description |
|------|-------------|
| orchestrator | Coordinates task assignment and agent lifecycle |
| implementer | Writes product code after approval |
| reviewer | Reviews code for quality and architecture |
| security-auditor | Audits code and dependencies for security issues |
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
- `/handover` is invoked

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

### Skill Candidates (Agent-sourced)

Path: `.claude/state/skill-candidates/{name}-{timestamp}.json`

```json
{
  "candidate": "<skill-name>",
  "source_agent": "<name>-<instance>",
  "evaluation": {
    "repeatability": true,
    "complexity": true,
    "generality": true,
    "originality": true
  },
  "criteria_met": 4,
  "trigger": "<trigger description>",
  "steps": ["<step 1>", "<step 2>", "<step 3>"],
  "detected_at": "<ISO 8601>"
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
- Skill Candidates section
- Notes section

## Workflow Pipeline

The default task workflow is:

    implementer → [reviewer, security-auditor] → verifier

Rules:
- Review and security audit run in parallel after implementation
- Verification runs only after both review and audit pass
- If review or audit raises issues, the task returns to implementer
- The refactorer may be inserted before verifier when requested

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
5. Create `.claude/state/skill-candidates/` directory if needed
6. Spawn agents with `min > 0` in the team configuration
7. Update `dashboard.md` Agent Status table via reporter

### `/handover`

Before generating the handover document:

1. Signal all agents to complete current work
2. Wait for agents to reach `done` or `idle` status
3. Terminate all agent instances
4. Run reporter for final dashboard update
5. Include agent summary in handover document

## Skill Lifecycle Integration

Agents with `skill_detection: true` participate
in the Skill Proposal Lifecycle.

When an agent detects a skill candidate:

1. Run the 4-stage evaluation check (per `skill-lifecycle.md`)
2. Write the candidate to `.claude/state/skill-candidates/`
3. The reporter includes candidates in the dashboard

Cross-agent dedup is handled by the extended Stage 1 check
defined in `skill-lifecycle.md`.

## Single-Agent Fallback

When `.claude/agents/` does not exist:
- Claude Code operates as a single agent
- No orchestration, no subagents, no state files
- All work is performed directly by the main instance
- This is the default mode
