# OWASP Security

This rule integrates OWASP security principles
and the OWASP Top 10 into the development workflow.

Reference: https://devguide.owasp.org/

## Applicability

This rule applies to all agents that write or audit
product code: implementer, security-auditor, reviewer,
refactorer, and verifier.

## Security Principles

The following OWASP principles govern code-level decisions.
These are constraints, not aspirational guidelines.

### Security by Default

- All features must be secure in their default configuration.
- Security must not require explicit opt-in by end users.
- If a feature has a secure and insecure variant,
  only the secure variant may be implemented.

### Defense in Depth

- No single security control may be the only protection.
- Input validation must occur at both frontend and backend.
- Authorization checks must exist at both route and data layer.

### Least Privilege

- Each component must have the minimum permissions required.
- Database queries must access only the data needed.
- API routes must enforce scoped authorization.

### Fail Safe

- Errors must not expose internal state, stack traces,
  or sensitive configuration.
- Authentication failures must default to denied.
- Database errors must not leak schema information.

### Complete Mediation

- Every request to a protected resource must be authorized.
- Authorization must not be cached or assumed
  from a previous request.
- All API endpoints must independently verify authorization.

### Economy of Mechanism

- Security implementations must be simple and auditable.
- Prefer well-tested library functions over custom crypto
  or custom auth.
- Minimize the attack surface by avoiding unnecessary endpoints.

### Leveraging Existing Components

- Use framework-provided security features
  (CSRF tokens, XSS sanitization, parameterized queries).
- Do not implement custom solutions for problems
  already solved by the framework or established libraries.

## OWASP Top 10 Checklist

The security-auditor must verify each applicable item.
The implementer must consider each item during development.

### A01: Broken Access Control

- [ ] Route-level authorization is enforced
- [ ] Data-level authorization prevents IDOR
  (user can only access own resources)
- [ ] Admin routes are protected by role check
- [ ] CORS is configured restrictively
- [ ] Directory listing and path traversal are prevented

### A02: Cryptographic Failures

- [ ] Passwords are hashed with bcrypt/scrypt/argon2
  (never plain text, never MD5/SHA1)
- [ ] Sensitive data in transit uses HTTPS
- [ ] Session tokens are cryptographically random
- [ ] No secrets in source code or logs
- [ ] Encryption keys are not hardcoded

### A03: Injection

- [ ] All database queries use parameterized statements
- [ ] User input in HTML is escaped/sanitized
- [ ] File paths from user input are validated
- [ ] Shell commands never include user input directly
- [ ] Content-Type headers are validated on uploads

### A04: Insecure Design

- [ ] Rate limiting is applied to auth and submission endpoints
- [ ] Business logic enforces security constraints
- [ ] Resource consumption limits exist
  (file size, request body, query complexity)

### A05: Security Misconfiguration

- [ ] Security headers are set
  (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
- [ ] Error messages do not reveal stack traces or internals
- [ ] Default credentials are not present
- [ ] Development-only features are disabled in production config
- [ ] Server identification headers are removed

### A06: Vulnerable and Outdated Components

- [ ] pnpm audit reports no known vulnerabilities
- [ ] Dependencies are at supported versions
- [ ] No deprecated packages with known CVEs
- [ ] Lockfile (pnpm-lock.yaml) is committed

### A07: Identification and Authentication Failures

- [ ] Password requirements enforce minimum complexity
- [ ] Session management uses secure, httpOnly cookies
- [ ] Session invalidation works on logout
- [ ] Email verification is required before full access
- [ ] Generic error messages prevent user enumeration

### A08: Software and Data Integrity Failures

- [ ] Dependencies are installed with lockfile
- [ ] No eval() or dynamic code execution from user input
- [ ] API responses are validated against expected schemas
- [ ] No untrusted data deserialization

### A09: Security Logging and Monitoring Failures

- [ ] Authentication events are logged
  (login, logout, failed attempts)
- [ ] Admin actions are logged
  (content deletion, account actions)
- [ ] Logs do not contain sensitive data
  (passwords, tokens, personal data)
- [ ] Authorization failures are logged

### A10: Server-Side Request Forgery (SSRF)

- [ ] URLs from user input are validated against allowlist
- [ ] Internal service addresses are not reachable
  via user-controlled URLs
- [ ] Image upload/fetch does not follow arbitrary redirects

## Implementer Obligations

When implementing any feature:

1. Review the relevant Top 10 items for the feature
2. Apply the security principles during design and coding
3. Use framework-provided security features when available
4. When in doubt about a security decision, flag it
   in the result file for the security-auditor to review

## Security-Auditor Obligations

When auditing any task:

1. Walk through all applicable Top 10 items
   using the checklist above
2. Report each finding with:
   - OWASP ID (e.g., A01, A03)
   - Severity (critical, high, medium, low)
   - Location (file and line)
   - Recommendation
3. Distinguish between violations (must fix)
   and recommendations (should consider)
4. Run pnpm audit for dependency vulnerabilities
5. Include owasp_coverage summary in result file

## Result Format Extension

The security-auditor result file includes
an additional `owasp_coverage` field:

```json
{
  "owasp_coverage": {
    "A01": "pass | fail | n/a",
    "A02": "pass | fail | n/a",
    "A03": "pass | fail | n/a",
    "A04": "pass | fail | n/a",
    "A05": "pass | fail | n/a",
    "A06": "pass | fail | n/a",
    "A07": "pass | fail | n/a",
    "A08": "pass | fail | n/a",
    "A09": "pass | fail | n/a",
    "A10": "pass | fail | n/a"
  },
  "findings": [
    {
      "owasp_id": "A03",
      "severity": "high",
      "location": "backend/src/routes/posts.ts:42",
      "description": "SQL query uses string concatenation",
      "recommendation": "Use parameterized query"
    }
  ]
}
```

This field is appended to the standard agent result format
defined in agent-orchestration.md.
