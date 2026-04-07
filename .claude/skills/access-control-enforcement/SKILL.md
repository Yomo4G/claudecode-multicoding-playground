---
name: access-control-enforcement
description: "Enforces route-level and data-level access control to prevent unauthorized access and IDOR vulnerabilities. Covers OWASP A01. Use when creating API endpoints that access user-specific data or admin routes."
user-invokable: false
compatibility: Designed for Claude Code
metadata:
  version: "1"
  owasp: "A01"
---

## Triggers

- When creating API endpoints that access user-specific data
- When implementing admin-only routes
- When a route returns data belonging to a specific user

## Preconditions

- Authentication is implemented
- Route structure exists in backend

## Steps

1. Apply authentication middleware to all protected routes
   - Target: `backend/src/middleware/**`, `backend/src/routes/**`
   - All routes except public (login, register) require auth
   - Middleware extracts and validates session before handler
   - Verify: No protected route accessible without valid session

2. Implement data-level authorization (IDOR prevention)
   - Target: `backend/src/routes/**`
   - All queries for user-specific data include user ID from session
   - Never trust user-supplied IDs for ownership checks
   - Verify: Cannot access other users' resources by changing IDs

3. Implement role-based access for admin routes
   - Target: `backend/src/routes/admin/**`
   - Admin role check middleware on all moderation routes
   - Regular users receive 403 on admin endpoints
   - Verify: Non-admin user receives 403 on admin routes

4. Configure CORS restrictively
   - Target: Backend server configuration
   - Allow only the frontend origin
   - Do not use wildcard (*) in production config
   - Verify: Cross-origin requests from unknown origins are rejected

5. Enforce method restrictions
   - Target: `backend/src/routes/**`
   - Each route explicitly declares allowed HTTP methods
   - OPTIONS/HEAD handled by framework, not custom code
   - Verify: Unsupported methods return 405

## Tags

access-control, authorization, idor, cors, owasp, a01
