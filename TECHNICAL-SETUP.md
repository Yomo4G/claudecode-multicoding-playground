# Technical Setup

Detailed guide for configuring your project's
framework, tooling, and governance layers.

For getting started, see [README.md](README.md).

---

## Overview

Run `pnpm run setup` to start the interactive setup process.

Setup records **human decisions only** — it does not install dependencies,
generate product code, or define governance content.

Setup is **fully reversible** with `pnpm run setup:reset`.

---

## Requirements

- **Node.js v24.13.0 or later** — required for the setup script
  due to a security-critical vulnerability fixed in this version.
  This requirement applies only to setup, not to application development.
- **pnpm** — package manager used throughout the project.

---

## Configuration Options

### Framework

Only one framework may be active at a time.

| Framework | Type | Project Structure | Backend |
|-----------|------|-------------------|---------|
| React | SPA | Monorepo (`frontend/` + `backend/`) | Hono |
| Vue.js | SPA | Monorepo (`frontend/` + `backend/`) | Hono |
| Astro | SPA | Monorepo (`frontend/` + `backend/`) | Hono |
| Gatsby | SPA | Monorepo (`frontend/` + `backend/`) | Hono |
| Next.js | Full-stack | Single project | Built-in API routes |
| Nuxt.js | Full-stack | Single project | Built-in API routes |

### Lint / Formatter

Only one primary toolchain may be selected.

| Tool | Description |
|------|-------------|
| Biome | Fast, all-in-one linter and formatter |
| ESLint | Widely used JavaScript/TypeScript linter |
| Prettier | Opinionated code formatter |

### Testing

Only one testing strategy may be selected initially.

| Tool | Description |
|------|-------------|
| Vitest | Vite-native unit testing framework |
| Jest | Popular JavaScript testing framework |
| Playwright | End-to-end browser testing |
| Cypress | End-to-end browser testing |

### Runtime

The execution environment for the project.

| Runtime | Description |
|---------|-------------|
| Node.js | Standard JavaScript runtime |
| Bun | Fast all-in-one JavaScript runtime |
| Deno | Secure JavaScript/TypeScript runtime |

Runtime is an execution constraint, not a project architecture decision.
Changing runtime does not imply framework or tooling changes.

---

## Auto-Determined Settings

Backend and database configurations are derived from the framework selection.
They are not independently selectable.

**Full-stack frameworks** (Next.js, Nuxt.js):
- Project structure: `single`
- Backend: built-in API routes
- Database: SQLite

**SPA frameworks** (React, Vue.js, Astro, Gatsby):
- Project structure: `monorepo` (`frontend/` + `backend/`)
- Backend framework: Hono
- Database: SQLite

---

## Governance Layer Selection

During setup, you are asked which Claude governance layers to enable.
Each `y` answer creates the corresponding `.claude/` directory.

This follows the governance model: directory existence = human decision to enable.

---

## Reset

To reset all selections and start over:

```bash
pnpm run setup:reset
```

You can also manually edit `project.config.json`
and set values back to `null`, then run `pnpm run setup` again.

---

## project.config.json Reference

| Field | Type | Description |
|-------|------|-------------|
| `runtime` | string \| null | Selected runtime (node, bun, deno) |
| `framework` | string \| null | Selected framework |
| `lint` | string \| null | Selected linter/formatter |
| `test` | string \| null | Selected testing tool |
| `projectStructure` | string \| null | Auto-determined (single, monorepo) |
| `backend` | string \| null | Auto-determined backend type |
| `backendFramework` | string \| null | Auto-determined backend framework |
| `database` | string \| null | Auto-determined database |
| `designMethod` | string \| null | Design approach (conversation, image, reference, auto) |
| `designReference` | string \| null | Reference service name (when designMethod is reference) |
| `breakpoints` | object \| null | Responsive design breakpoints |
