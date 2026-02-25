---
name: secure-auth-setup
description: >
  Sets up secure authentication with password hashing,
  session management, and email verification.
  Covers OWASP A02 (Cryptographic Failures) and
  A07 (Identification and Authentication Failures).
compatibility: Designed for Claude Code
metadata:
  version: "1"
  owasp: "A02, A07"
---

## Triggers

- When implementing user registration or login
- When creating password handling logic
- When setting up session management

## Preconditions

- Backend framework is configured in project.config.json
- Authentication task is assigned
- Database schema includes users table

## Steps

1. Configure password hashing
   - Target: `backend/src/auth/**` or `src/app/api/auth/**`
   - Use bcrypt/argon2 with cost factor >= 10
   - Verify: No plain text or weak hash (MD5/SHA1) in auth code

2. Implement session token generation
   - Target: `backend/src/auth/**`
   - Use cryptographically secure random tokens (crypto.randomBytes)
   - Set httpOnly, secure, sameSite flags on session cookies
   - Verify: Session cookie attributes are secure

3. Implement login with rate limiting
   - Target: `backend/src/routes/auth/**`
   - Add rate limiter (max 5 attempts per 15 minutes per IP)
   - Return generic error message on failure
   - Verify: Rate limiter active, no username enumeration

4. Implement logout with session invalidation
   - Target: `backend/src/routes/auth/**`
   - Destroy server-side session on logout
   - Clear session cookie
   - Verify: Old session token is rejected after logout

5. Implement email verification guard
   - Target: `backend/src/middleware/**`
   - Unverified users cannot access protected routes
   - Verification tokens expire after configured duration
   - Verify: Unverified user request returns 403

## Tags

authentication, owasp, a02, a07, session-management
