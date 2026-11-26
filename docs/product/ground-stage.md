# StudyOS Ground Stage

## Purpose

Establish a clean, buildable foundation for StudyOS before implementing core product features. This stage prioritizes architecture clarity, developer experience, and a credible product shell aligned with the master blueprint.

## Scope Completed

- Initialized public repository baseline (MIT license, README, env example)
- Scaffolded Next.js App Router + TypeScript + Tailwind CSS application
- Implemented responsive app shell and primary navigation
- Created placeholder routes for core product areas: Home, Study, Groups, Search, Calendar, AI, Profile
- Added initial design tokens reflecting the blueprint direction (calm, academic, navy/indigo)
- Documented architectural decisions (ADRs 0001–0003)
- Added basic quality scripts: lint, typecheck, test, build
- Delivered the personal study vertical slice: Zod contracts, repository ports, service rules, typed errors, and Vitest unit + flow tests
- Wired the Home dashboard and Study workspace to the service through server actions
- Added Supabase Auth sign-in/sign-up/sign-out, proxy-protected routes, and verified session-derived ownership
- Added Postgres schema, indexes, RLS policies, and an owner-scoped `StudyRepository` adapter
- Added a least-privilege grants migration (`0002`) that removes Supabase's broad default `anon`/`authenticated` grants
- Verified the full live flow against Supabase: sign-up/sign-in, profile trigger, task creation, focus session, owner scoping, and dashboard persistence
- Wired Postgres to the Supabase Session pooler with CA-verified TLS and a separately supplied raw password

## Explicit Non-Goals (for this stage)

- No profile editing, courses, or academic affiliations beyond email/name
- No real-time chat/WebSocket infrastructure
- No AI provider calls or RAG pipeline
- No file upload/storage pipeline
- No live video rooms
- No billing/payments

## Recommended Next Slice (vertical slice)

**Target: first social loop — groups and membership**

The personal study loop is authenticated and durable. The next slice should reuse the same domain-first pattern:

1. **Groups domain** - schemas, owner/role rules, and a `GroupRepository` port
2. **Create/join flow** - group identity (name, handle, course, level), membership, and invite codes
3. **Group surface** - replace the Groups placeholder with a real list/detail view
4. **Integration tests** - service + Postgres for task/session/group workflows, then E2E for sign-up → task → focus session
5. **Observability baseline** - error tracking and structured logging for critical paths

## Exit Criteria for Ground Stage

- App runs locally and builds cleanly (with or without Supabase env; protected routes redirect to sign-in)
- Lint, typecheck, and unit tests pass in CI
- Core routes/navigation are reachable, private routes require a verified session
- Study rules are covered by deterministic tests and isolated from presentation
- Migration applies cleanly and repository SQL is owner-scoped and tested
- Architecture and next steps are documented

## Verification Status (2026-11-26)

- Applied `0001_initial.sql` and `0002_least_privilege_grants.sql`; schema checks passed for tables, RLS, policies, indexes, grants, trigger, function, and extension.
- Verified live Supabase sign-up/sign-in, profile trigger, own-profile RLS read, task creation, focus session start/end, owner-scoping rejection, task completion, and dashboard stats.
- Verified authenticated HTTP routes: `/` and `/study` returned 200 for a live session, `/login` redirected to `/`, and the live task rendered on the dashboard.
- `npm run typecheck`, `npm run lint`, `npm test -- --run` (21/21), and a clean production build passed.
- Browser UI click-through was not performed; verification used authenticated HTTP requests plus live service/database tests.
