# Study module

Implemented domain boundary for personal study.

- **Status**: Domain + durable Postgres adapter implemented (requires Supabase project and environment variables)
- **Contracts**: `domain.ts` (Zod schemas + entity/view models), `ports.ts` (repository/clock/id generator)
- **Logic**: `service.ts` owns task and focus-session rules; `guards.ts`, `streak.ts`, and `validation.ts` keep it small and testable
- **Durable adapter**: `postgres-repository.ts` — parameterized, owner-scoped SQL behind a testable `QueryExecutor`; `server/instance.ts` composes it with a `pg` pool
- **Test adapter**: `in-memory-repository.ts` is process-local and used by tests only
- **Tests**: `*.test.ts` cover domain rules, flow, SQL ownership predicates, row mapping, and safe error handling
- **Notes**: Owner identity always comes from the verified Supabase session (`src/lib/auth/session.ts`), never from client input. RLS policies in `database/migrations/0001_initial.sql` are a second layer; application-side owner filters are mandatory.
