# StudyOS

> The social operating system for student learning.

StudyOS is a student-centered platform that brings personal study, study groups, planning, collaboration, knowledge search, and AI-assisted learning into one calm academic home.

This repository is in the **ground stage**: foundation scaffold, architecture decisions, authenticated personal-study vertical slice, and initial product shell based on `STUDYOS_Master_Blueprint.pptx`.

## Ground Stage (current)

What is included now:

- **Next.js + TypeScript + Tailwind CSS** app scaffold (App Router, `src/` structure)
- **StudyOS design foundation**: calm academic theme, responsive app shell, navigation
- **Initial route map**: Home, Study, Groups, Search, Calendar, AI, Profile
- **Personal study slice**: validated task and focus-session domain, server actions, and a data-driven dashboard/study workspace
- **First social loop**: authenticated groups, owner/member roles, invite codes, membership-aware queries, and real Groups pages
- **Runtime contracts & tests**: Zod schemas, injected repository/clock/id ports, and Vitest unit + flow tests
- **Identity & persistence**: Supabase Auth (cookie sessions, protected routes) and an owner-scoped Postgres repository with migrations, RLS, verified TLS, and least-privilege grants
- **Architecture docs**: ADRs and ground-stage plan
- **Public repo baseline**: MIT license, env example, lint/typecheck scripts

What is intentionally **not** implemented yet:

- Profile editing, courses, and academic affiliations beyond email/name
- Real group/chat/realtime features
- AI/RAG integrations
- File uploads/object storage
- Live study rooms/video
- Payments/billing

## Tech Stack (ground stage decision)

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) + React + TypeScript | Fast product iteration, strong typing, single full-stack web app |
| Styling | Tailwind CSS v4 | Rapid, consistent UI implementation with tokenized theme |
| Icons | Lucide React | Clean, accessible SVG icon set |
| Validation | Zod | Runtime validation of commands, entities, environment, and service output |
| Auth | Supabase Auth + `@supabase/ssr` | Managed identity with verified cookie sessions |
| Data | PostgreSQL via `pg` | System of record with parameterized, owner-scoped SQL and RLS |
| Testing | Vitest | Fast unit and flow tests for domain rules and repository adapter |
| Quality | ESLint + TypeScript typecheck | Baseline code quality and safety |
| Architecture | Modular monolith (single app) | Simple now; clear domain boundaries for future extraction |

Planned next integrations (per blueprint): managed realtime, object storage (R2/S3-compatible), pgvector + AI provider abstraction/RAG, and LiveKit for live rooms.

## Project Structure

```text
.
├── certs/                     # Supabase root CA for verified Postgres TLS
├── database/migrations/       # Postgres schema, indexes, RLS policies, grants (study + groups)
├── docs/
│   ├── architecture/adr/      # Architecture Decision Records
│   └── product/               # Product/ground-stage planning docs
├── src/
│   ├── app/(app)/             # Authenticated routes inside the app shell
│   ├── app/login/             # Public sign-in / sign-up
│   ├── components/            # UI, layout, dashboard, study, and auth components
│   ├── lib/                   # Env validation, auth/session, Supabase client, utilities
│   ├── proxy.ts               # Session refresh + route protection
│   └── modules/               # Domain modules (study + groups implemented)
├── STUDYOS_Master_Blueprint.pptx
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install and run

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and add:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
DATABASE_URL=...        # Supabase Session pooler URL (IPv4); [YOUR-PASSWORD] may remain
DATABASE_PASSWORD=...   # Raw database password; do not URL-encode it here
DATABASE_SSL=require
```

Download the Supabase root CA from **Database → Settings → SSL Configuration** and save it as `certs/prod-ca-2021.crt`. Then apply `database/migrations/0001_initial.sql`, `database/migrations/0002_least_privilege_grants.sql`, and `database/migrations/0003_groups.sql`.

Use the **Session pooler** connection string, not the direct connection, on IPv4-only networks. The sign-in page renders setup instructions until the Supabase values exist.

Open [http://localhost:3000](http://localhost:3000).

### Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Documentation

- [Ground Stage Plan](./docs/product/ground-stage.md)
- [ADR 0001 - Initial Foundation](./docs/architecture/adr/0001-initial-foundation.md)
- [ADR 0002 - Personal Study Domain Slice](./docs/architecture/adr/0002-personal-study-domain-slice.md)
- [ADR 0003 - Auth and Postgres Adapter](./docs/architecture/adr/0003-auth-and-postgres-adapter.md)
- [ADR 0004 - Groups and Membership](./docs/architecture/adr/0004-groups-and-membership.md)
- [Master Blueprint](./STUDYOS_Master_Blueprint.pptx)

## Roadmap Direction

The blueprint defines a phased release path:

1. **0.1 Foundation** - auth, profile, DB, design system *(sign-in, protected routes, and study schema implemented)*
2. **0.2 Personal** - dashboard, tasks, timetable
3. **0.3 Groups** - create/join, roles, discussions *(create/join and roles implemented; discussions planned)*
4. **0.4 Realtime** - chat + notifications
5. **0.5 AI** - tutor + basic planner
6. **0.6 Knowledge** - upload + RAG + citations
7. **0.7 Live** - study rooms + sessions
8. **1.0 Pilot** - polish + safety + analytics

## License

[MIT](./LICENSE)
