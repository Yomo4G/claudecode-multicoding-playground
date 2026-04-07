# Multi-Agent Orchestration

When `.claude/agents/` exists, the project uses
a multi-agent orchestration system.

Agent definitions live in `.claude/agents/*.yaml`.
Team composition is defined in `.claude/agents/team.yaml`.
Orchestration rules are in `.claude/rules/agent-orchestration.md`.

The system defines 8 roles:

- Orchestrator: coordinates task assignment and agent lifecycle
- Implementer: writes product code after approval
- Reviewer: reviews code for quality and architecture
- SecurityAuditor: audits code and dependencies for security
- ReviewRecorder: consolidates review results into structured records
- Verifier: runs tests, lint, and build checks
- Refactorer: simplifies and improves code structure (on-demand)
- Reporter: updates dashboard.md with execution state

Rules:
- Agent definition files (`.claude/agents/**`) are PROTECTED.
- The AI must not modify agent definitions during execution.
- All agents are strictly bound by the same governance rules.
- The use of agents does NOT grant decision-making authority.
- When `.claude/agents/` does not exist,
  Claude Code operates in single-agent mode.
