# ADR 0002: Personal Study Domain Slice — Contracts, Validation, and Tests

- **Status**: Accepted
- **Date**: 2026-11-26
- **Deciders**: StudyOS founder + engineering copilot

## Context

The ground-stage scaffold had a credible UI shell, but the dashboard was a hardcoded literal in `src/app/page.tsx`, every non-home route was a placeholder, and there was no runtime validation, test runner, or persistence boundary. Adding features directly into pages would couple business rules to presentation and make future database/auth work risky. The blueprint's first vertical slice requires real tasks, study sessions, and a dashboard that an engineer can trust.

## Decision

Implement the **personal study foundation** as a domain-first vertical slice inside `src/modules/study/`:

- **Contracts**: Zod schemas define tasks, sessions, commands, and dashboard view models. Branded IDs prevent accidental ID mixing. All service inputs and outputs are parsed at runtime.
- **Ports**: `StudyRepository`, `Clock`, and `IdGenerator` are injected into `StudyService`. Business rules do not know where data is stored.
- **Adapter**: `createInMemoryStudyRepository` is a process-local development adapter with defensive copies. It is explicitly non-durable and is a placeholder for a Postgres adapter, not a persistence solution.
- **Service**: `StudyService` owns create/complete task, start/end session, and dashboard aggregation rules. Typed errors (`StudyValidationError`, `StudyNotFoundError`, `StudyConflictError`) replace generic failures.
- **UI**: Server components read the service directly; server actions mutate through the service and revalidate affected routes. Forms never construct domain entities.
- **Testing**: Vitest unit tests use a deterministic clock/ID generator and cover validation, ownership scoping, idempotency, invalid transitions, empty states, and aggregation. One flow test exercises create → start → complete → end → dashboard.
- **Identity**: A single demo owner ID is used until the auth module exists. This is not authentication and must never be treated as an authorization control.

## Consequences

### Positive

- Business rules are testable without React, Next.js, or a database.
- Replacing the in-memory adapter with Postgres requires no UI or service changes.
- Invalid input, invalid state transitions, and cross-owner access fail deterministically with typed errors.
- CI executes lint, typecheck, unit tests, and build for every PR.

### Negative / Risks

- In-memory state is lost on restart and is unsafe for multi-instance/serverless deployment. It must be replaced before any pilot.
- The demo owner ID means every visitor shares one workspace; this is intentional for ground-stage demos and becomes a privacy bug if shipped.
- Zod parsing adds a small runtime cost on every command boundary (acceptable at this scale).

## Compliance

- No `any`, explicit return types, and strict null checks in module code (enforced by `tsconfig.json` + CI typecheck).
- UI components import domain view models only; they never import the repository or write entities.
- ADR required before introducing the Postgres adapter, auth provider, or changing module boundaries.
- Complexity hygiene check and the 20-point review checklist run before marking slice work complete.
