---
name: input-sanitization
description: >
  Applies input validation and sanitization at both
  frontend and backend layers to prevent injection attacks.
  Covers OWASP A03 (Injection) and Defense in Depth principle.
compatibility: Designed for Claude Code
metadata:
  version: "1"
  owasp: "A03"
---

## Triggers

- When accepting user input (forms, query params, path params)
- When constructing database queries with user-supplied values
- When rendering user-supplied content in HTML

## Preconditions

- Framework and backend are configured in project.config.json
- At least one route or component accepts user input

## Steps

1. Identify all user input entry points
   - Target: `src/**`, `backend/src/routes/**`
   - List: form fields, URL params, query strings, headers
   - Verify: All entry points documented in task result

2. Apply backend input validation
   - Target: `backend/src/routes/**`
   - Use schema validation (zod/joi) on all request bodies
   - Reject invalid input before processing
   - Verify: No route handler processes unvalidated input

3. Use parameterized database queries
   - Target: `backend/src/**` or `db/**`
   - All queries use parameterized statements (never string concat)
   - ORM methods preferred over raw SQL where available
   - Verify: grep for string concatenation in SQL returns zero

4. Apply frontend output encoding
   - Target: `src/components/**` or `frontend/src/components/**`
   - Use framework's built-in XSS protection
     (React JSX auto-escaping, Vue v-text)
   - Never use dangerouslySetInnerHTML / v-html with user content
   - Verify: No raw HTML insertion of user-supplied data

5. Validate file-related inputs
   - Target: Routes handling file uploads or paths
   - Validate file types against allowlist
   - Sanitize filenames (remove path traversal sequences)
   - Verify: No path traversal possible via user input

## Tags

injection, xss, sqli, sanitization, owasp, a03
