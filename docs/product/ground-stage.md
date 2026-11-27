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
- Delivered the first social loop: groups, owner/member roles, invite-code creation/rotation, membership-aware queries, and a real Groups surface
- Added `0003_groups.sql` with RLS policies, a recursion-safe membership helper, and least-privilege grants
- Extracted shared `Clock`/`IdGenerator`, `QueryExecutor`, and one verified pooler pool for reuse across modules

## Explicit Non-Goals (for this stage)

- No profile editing, courses, or academic affiliations beyond email/name
- No real-time chat/WebSocket infrastructure
- No AI provider calls or RAG pipeline
- No file upload/storage pipeline
- No live video rooms
- No billing/payments

## Recommended Next Slice (vertical slice)

**Target: verification and observability baseline**

The personal and social loops are both authenticated and durable. The next slice should harden them before adding more group depth:

1. **Browser E2E** - Playwright journey for sign-up → task → focus session → group create → join with invite code
2. **Gated integration tests** - run the same service flows against Postgres in CI when credentials are available
3. **Observability baseline** - provider-agnostic structured logging for auth, server actions, and typed service failures
4. **Group depth** - then add discussions, shared resources, and role/moderation rules as a new domain slice

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

## Verification Status (2026-11-27)

- Applied `0003_groups.sql`; schema checks passed for tables, RLS, policies, indexes, constraints, grants, and the recursion-safe membership helper.
- Verified live group flow with three Supabase users: create, non-member denial, join, member listing, owner-only invite rotation, old-code invalidation, and member counts.
- Verified Supabase REST RLS: members read their groups, non-members see none, and `anon` receives no group or membership rows.
- Verified authenticated HTTP routes: `/groups` and a group detail page returned 200, `/groups` redirected unauthenticated requests to `/login`, `/login` redirected authenticated requests to `/`, and live groups rendered in the list and dashboard preview.
- `npm run typecheck`, `npm run lint`, `npm test -- --run` (35/35), and the production build passed.
