# Dev Server Lifecycle

The dev server is managed by Claude Code during the execution phase.
It is not a manual operation.

## Preconditions for Starting

The dev server must NOT be started until ALL of the following are true:

1. `/yoroshiku` has been invoked and GO has been granted
2. `pnpm install` has completed successfully
3. A `dev` script exists in the root `package.json`
4. At least one source entry point file exists
   (e.g., `src/main.tsx`, `frontend/src/main.tsx`, `src/app/page.tsx`,
   or equivalent for the configured framework)

## Starting the Dev Server

- Run `pnpm run dev` as a background process
- Do not block task execution while the dev server starts
- After starting, verify the server is responsive
  by checking that the expected port is listening
- If the server fails to start, log the error and continue execution
  without the dev server. Do not retry automatically.
  Inform the user on the next status update.

## When to Check Dev Server Status

Claude Code should verify the dev server is running:

- Before executing browser-facing or API-facing tasks
- After making significant configuration changes
  (e.g., `vite.config.ts`, `next.config.ts`, dependency changes)

## Restarting the Dev Server

The dev server should be restarted when:

- Framework configuration files are modified
- Dependencies are added or removed
- The dev server process has exited unexpectedly

To restart:
1. Run `pnpm teardown`
2. Run `pnpm run dev` as a background process

## Stopping the Dev Server

The dev server is stopped by running `pnpm teardown`.

This happens:
- When execution is complete
- When the user explicitly requests it

## Failure Handling

- Dev server startup failure is NOT a blocking error
- Claude Code must not retry startup more than once per trigger event
- If the dev server cannot start after one retry,
  report the issue to the user and continue with other tasks

## Port Expectations

Based on the configured framework and project structure:

- Single project (Next.js/Nuxt.js): port 3000
- Monorepo frontend (Vite-based): port 5173
- Monorepo backend (Hono): port 3000
