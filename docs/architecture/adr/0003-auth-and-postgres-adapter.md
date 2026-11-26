# ADR 0003: Authenticated Identity and Postgres Adapter

- **Status**: Accepted
- **Date**: 2026-11-26
- **Deciders**: StudyOS founder + engineering copilot

## Context

ADR 0002 delivered the personal study domain behind a repository port, but shipped with a process-local in-memory adapter and one shared demo identity. That is acceptable for demos and unacceptable for a pilot: data is lost on restart, every visitor shares a workspace, and no request is authenticated. The blueprint recommends managed auth (Supabase) and PostgreSQL as the system of record.

## Decision

- **Identity**: Supabase Auth with `@supabase/ssr` cookie sessions. The Next.js proxy (`src/proxy.ts`) refreshes sessions and redirects unauthenticated requests to `/login`. Server code derives `ownerId` from `auth.getUser()`; nothing trusts a client-supplied user ID.
- **Data**: PostgreSQL accessed with `pg` through a `QueryExecutor` port. `PostgresStudyRepository` implements `StudyRepository` with parameterized SQL and an explicit `owner_id = $1` predicate on every read, update, and upsert.
- **Transport**: the app connects through the Supabase Session pooler (IPv4-capable). `DATABASE_URL` holds the pooler URL and `DATABASE_PASSWORD` holds the raw password; the app URL-encodes it when composing the connection string. TLS is verified against the Supabase root CA in `certs/prod-ca-2021.crt`; certificate verification is never disabled.
- **Schema**: `database/migrations/0001_initial.sql` creates `profiles`, `tasks`, and `study_sessions` with indexes, row-level security policies for `authenticated`, and a trigger that creates a profile for each new auth user. `database/migrations/0002_least_privilege_grants.sql` removes Supabase's broad default `anon`/`authenticated` table grants and leaves only the CRUD privileges the app requires.
- **Boundary**: `StudyService` and UI components are unchanged. Only the `StudyServiceDependencies` composition and identity lookup change.
- **Secrets**: URL, anon key, pooler URL, and raw database password come from environment variables validated lazily by Zod. No service-role key is used by application code.
- **Degraded setup**: if Supabase env vars are absent, `/login` renders setup instructions instead of crashing; protected routes still redirect to `/login`.

## Consequences

### Positive

- Durable, owner-scoped data with no changes to domain rules or tests.
- Repository SQL is isolated behind a narrow executor interface and unit-testable without a live database.
- RLS policies protect Supabase API clients as a second authorization layer; direct `pg` queries still enforce ownership explicitly.
- Least-privilege grants reduce the impact of SQL injection and remove unnecessary `anon` access.
- Verified pooler TLS works on IPv4-only networks without weakening certificate checks.
- Pilot-ready identity flow (sign up, sign in, sign out) with server-side session verification.

### Negative / Risks

- Requires a Supabase project, two applied migrations, the Supabase CA file, and environment values before the app is usable.
- Direct `pg` connections use an owner role and therefore bypass RLS; application-side owner filters are mandatory and asserted in tests.
- The Session pooler is a dependency of the deployment network path; direct IPv6-only hostnames are not usable on IPv4-only machines.
- Auth and data are two integrations to configure; provider changes require a new ADR.

## Compliance

- Every repository test asserts that SQL carries an owner predicate and parameterized values.
- The proxy must cover all private routes; new public routes require an explicit allowlist change.
- CI runs lint, typecheck, unit tests, and build with no secrets present.
- No service-role key or raw credentials may be committed; `.env.example` documents required names only.
- TLS certificate verification must remain enabled, and migrations must preserve owner-predicated queries and least-privilege grants.
