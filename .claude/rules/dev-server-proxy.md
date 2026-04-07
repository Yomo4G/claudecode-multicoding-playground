---
paths:
  - "**/vite.config.*"
  - "**/next.config.*"
  - "**/nuxt.config.*"
  - "**/astro.config.*"
  - "**/gatsby-config.*"
---

# Dev Server Proxy Configuration

This rule ensures that frontend proxy configuration
always targets the correct backend service.

## Precondition

This rule applies when `project.config.json` defines
`projectStructure` as `monorepo`.

When `projectStructure` is `single`,
the frontend and backend share the same server.
Proxy configuration is not applicable.

## Source of Truth

The proxy target port is defined in `project.config.json`
under `devPorts.backend`.

This value is auto-determined during setup
and must not be modified by Claude Code.

## Implementer Obligations

When creating or modifying a frontend build tool configuration
(e.g., `vite.config.ts`, `astro.config.mjs`, `gatsby-config.ts`,
or any equivalent) that includes proxy or API routing settings:

1. Read `devPorts.backend` from `project.config.json`.
2. Set the proxy target to `http://localhost:{devPorts.backend}`.
3. Do not use any other port or host as the default proxy target.

## Verifier Obligations

When verifying a task that created or modified
a frontend build tool configuration:

1. Read `devPorts.backend` from `project.config.json`.
2. Read the proxy target from the build tool configuration.
3. Confirm the proxy target port matches `devPorts.backend`.
4. Report a verification failure if they do not match.
