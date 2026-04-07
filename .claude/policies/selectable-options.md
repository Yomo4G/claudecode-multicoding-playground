# Supported Frameworks (Selectable)

The project supports multiple frontend frameworks.
However, **only one framework may be active at a time**.

Possible choices include:
- React
- Vue.js
- Next.js
- Nuxt.js
- Astro
- Gatsby

Rules:
- Do NOT assume any framework by default.
- Do NOT mix multiple frameworks.
- Framework selection must be confirmed via configuration
  before any product code is written.

# Lint / Formatter Policy (Selectable)

Multiple linting and formatting tools are supported.
Only one primary toolchain may be selected.

Possible choices include:
- Biome
- ESLint
- Prettier

Rules:
- Do NOT introduce multiple linters or formatters.
- The selected tool is the single source of truth.
- Tooling must be confirmed via configuration
  before generating configs or code.

# Testing Policy (Selectable)

Multiple testing tools are supported.
Only one testing strategy may be selected initially.

Possible choices include:
- Playwright
- Vitest
- Jest
- Cypress

Rules:
- Do NOT mix testing frameworks by default.
- Testing tool selection must align with the chosen framework.
- Test generation is prohibited until the tool is confirmed.

# Backend and Database Policy (Auto-determined)

Backend and database configurations are derived
from the framework selection. They are not independently selectable.

- Full-stack frameworks (Next.js, Nuxt.js):
  - Project structure: single
  - Backend: built-in API routes
  - Database: SQLite

- SPA frameworks (React, Vue.js, Astro, Gatsby):
  - Project structure: monorepo (frontend + backend)
  - Backend framework: Hono
  - Database: SQLite

Rules:
- These fields are auto-determined during setup.
- The AI must not modify these fields.
- The AI must not suggest alternative backends or databases
  unless explicitly asked.
