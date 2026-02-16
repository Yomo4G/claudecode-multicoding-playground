# Execution Permissions

This rule takes effect after `/yoroshiku` grants GO.
It defines what Claude Code is allowed and prohibited from doing
during autonomous execution.

## Writable Paths (Whitelist)

Claude Code may only create, modify, or delete files
under the following paths:

- `src/**`
- `tests/**` (`test/**`)
- `public/**`
- `frontend/**`
- `backend/**`
- `db/**`
- `.claude/state/**`
- `.claude/tasks/**`
- `.claude/skills/**`
- `dashboard.md`
- Tool configuration files at project root
  (e.g., `tsconfig.json`, `vite.config.ts`, `eslint.config.js`)
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`

All other paths are protected.
Any modification outside these paths requires explicit human approval.

## Protected Paths (Never Modify)

- `CLAUDE.md`
- `project.config.json`
- `.claude/commands/**`
- `.claude/rules/**`
- `.claude/contexts/**`
- `.claude/agents/**`
- `.claude/project-framing.md`
- `scripts/**`
- `README.md`
- `idea-discovery.txt`

## Prohibited Commands

### Git Destructive Operations

- `git push --force` / `git push -f`
- `git reset --hard`
- `git branch -D`
- `git rebase` against main/shared branches
- `git config`

### Publishing and Deployment

- `npm publish` / `pnpm publish`
- Any deployment commands

### System-Level Changes

- `brew install` / `apt install` or equivalent
- `rm -rf` on protected paths
- `chmod` / `chown`

### Security-Sensitive Operations

- Creating or modifying `.env` or credential files
- Authenticated requests to external services

## Permitted Operations

The following are explicitly allowed during execution:

- `git add` / `git commit` / `git push` (non-force)
- `pnpm install` / `pnpm add`
- `pnpm test` / `pnpm lint` / `pnpm build`
- `pnpm run dev` (background process)
- `pnpm teardown`
- `pnpm placeholders` (generate placeholder images)
- File creation, modification, and deletion within writable paths

## Enforcement

- This rule has no exceptions during autonomous execution.
- If a task requires a prohibited action,
  Claude Code must stop and request human approval.
- Violations of this rule are treated as execution failures.
