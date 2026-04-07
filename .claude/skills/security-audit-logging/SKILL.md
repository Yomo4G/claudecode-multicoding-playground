---
name: security-audit-logging
description: "Implements structured logging for security-relevant events including authentication, authorization failures, and admin actions. Covers OWASP A09. Use when implementing authentication events, admin actions, or authorization checks."
user-invokable: false
compatibility: Designed for Claude Code
metadata:
  version: "1"
  owasp: "A09"
---

## Triggers

- When implementing authentication (login/logout)
- When implementing admin/moderation actions
- When security-auditor flags missing audit trails

## Preconditions

- Backend framework is configured
- Authentication system exists

## Steps

1. Create structured logging utility
   - Target: `backend/src/lib/audit-log.ts` or equivalent
   - Define log schema: timestamp, event_type, user_id,
     ip_address, result, details
   - Output to file or stdout (not database)
   - Verify: Logging utility exists with defined schema

2. Log authentication events
   - Target: `backend/src/routes/auth/**`
   - Log: login_success, login_failure, logout,
     registration, email_verification
   - Include IP address and timestamp
   - Verify: All auth events produce log entries

3. Log admin and moderation actions
   - Target: `backend/src/routes/admin/**`
   - Log: content_delete, account_suspend, report_review
   - Include admin user ID and target resource
   - Verify: All admin actions produce log entries

4. Ensure logs exclude sensitive data
   - Target: All logging calls
   - Never log: passwords, session tokens, email content
   - Redact or hash sensitive fields
   - Verify: grep for password/token in log output returns zero

5. Log authorization failures
   - Target: Authorization middleware
   - Log: forbidden_access with user_id, requested_resource, IP
   - Log: rate_limit_triggered with IP and endpoint
   - Verify: Unauthorized access attempts produce log entries

## Tags

logging, audit, monitoring, owasp, a09
