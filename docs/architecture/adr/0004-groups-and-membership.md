# ADR 0004: Groups and Membership Slice

- **Status**: Accepted
- **Date**: 2026-11-27
- **Deciders**: StudyOS founder + engineering copilot

## Context

The authenticated personal study loop is durable and tested, but `src/app/(app)/groups/page.tsx` is still a placeholder. The blueprint's next vertical slice is the first social loop: users should be able to create a study community, invite others with a capability code, and see only the groups they belong to.

## Decision

- **Module boundary**: add `src/modules/groups/` mirroring `src/modules/study/`: Zod contracts, branded IDs, typed errors, a `GroupRepository` port, an injected `GroupService`, an in-memory test adapter, and a Postgres adapter.
- **Roles**: a creator becomes the group `owner`; joiners receive `member`. Only the owner may rotate the invite code. Ownership transfer, role changes, and leaving are explicit non-goals.
- **Invite codes**: codes are 12 uppercase hex characters generated server-side. Only their SHA-256 hash is stored in `groups.invite_code_hash`; the plaintext is returned once on create or rotation. Joining resolves the hash, so an old code stops working immediately after rotation.
- **Actor identity**: every command takes `actorId` from `getAuthenticatedOwnerId()`. No client-supplied user ID is trusted. A creator is also inserted as an `owner` membership row.
- **Visibility**: `getGroupDetail` and `listMembers` verify caller membership in the service. Non-members receive the same not-found response as a missing group so group existence is not leaked.
- **Schema**: `database/migrations/0003_groups.sql` adds `groups` and `group_members`, with unique lowercased handles, unique invite-code hashes, membership uniqueness, level/role checks, and indexes. RLS policies protect Supabase REST clients; least-privilege grants expose only `SELECT/INSERT/UPDATE` on groups and `SELECT/INSERT` on memberships to `authenticated`, with no `anon` grants.
- **RLS recursion guard**: membership checks use `public.is_current_user_group_member(uuid)`, a `security definer`, `stable` function with a pinned `search_path`. A naive self-referencing policy on `group_members` caused infinite recursion; the helper runs as the table owner and takes only a group ID, so it cannot probe another user's membership.
- **Shared infrastructure**: extract shared `Clock`/`IdGenerator` ports to `src/lib/ports.ts`, the `QueryExecutor` type to `src/lib/database/query-executor.ts`, and one verified pooler pool to `src/lib/database/pool.ts`. Study and groups reuse the same CA-verified IPv4-capable connection.
- **UI**: the Groups route is replaced with a real list, create form, and join form; a dynamic detail route shows group context, members, and owner-only invite rotation. The Home dashboard groups preview reads live group data.

## Consequences

### Positive

- The first social loop is durable, owner-scoped, and testable without React or a database.
- Invite codes are capability secrets; storing only hashes prevents accidental recovery from a database read.
- Cross-user group visibility is denied deterministically and tested.
- RLS protects REST clients without recursive policies, while application SQL still scopes every membership-aware query by actor ID.
- Shared database and port infrastructure prevents a second pool or divergent TLS configuration.

### Negative / Risks

- Rotate-and-share is a deliberate UX trade-off: members cannot see a persistent invite code on the detail page; the owner must generate one when needed.
- The security-definer function runs with table-owner rights; its fixed `search_path` and narrow signature are required safety controls.
- Direct `pg` connections still bypass RLS, so application-side membership predicates remain mandatory and are asserted in repository tests.
- There is no ownership transfer, leave flow, moderation, discussion, or realtime yet.

## Compliance

- No `any`, explicit return types, strict null checks, and Zod validation at every service boundary.
- No business rules in UI components; actions only read forms, call the service, and revalidate routes.
- Repository tests assert actor/member predicates and parameterized values.
- RLS verification confirms member/non-member isolation and zero `anon` grants.
- Typecheck, lint, unit tests, and production build must pass before merge.
