---
name: security-headers-setup
description: "Configures HTTP security headers to prevent common web vulnerabilities including clickjacking, MIME sniffing, and content injection. Covers OWASP A05. Use when setting up backend server configuration or frontend build tool security headers."
user-invokable: false
compatibility: Designed for Claude Code
metadata:
  version: "1"
  owasp: "A05"
---

## Triggers

- When setting up the backend server configuration
- When configuring the frontend build tool (CSP meta tags)
- When security-auditor flags missing security headers

## Preconditions

- Backend server or framework is configured
- At least one route is serving responses

## Steps

1. Add Content-Security-Policy header
   - Target: Backend middleware or meta tags
   - Define script-src, style-src, img-src, connect-src
   - Disallow inline scripts unless framework requires
   - Verify: CSP header present in HTTP responses

2. Add Strict-Transport-Security header
   - Target: Backend middleware
   - Set max-age to at least 31536000 (1 year)
   - Include includeSubDomains
   - Verify: HSTS header present in responses

3. Add X-Frame-Options and X-Content-Type-Options
   - Target: Backend middleware
   - X-Frame-Options: DENY (no iframe embedding)
   - X-Content-Type-Options: nosniff
   - Verify: Both headers present

4. Configure error responses to hide internals
   - Target: Backend error handler middleware
   - Production errors return generic message only
   - Stack traces, query details, file paths are suppressed
   - Verify: Intentional error returns no internal details

5. Remove server identification headers
   - Target: Backend middleware
   - Remove X-Powered-By header
   - Remove Server header if possible
   - Verify: Response headers do not reveal server technology

## Tags

security-headers, csp, hsts, owasp, a05, misconfiguration
