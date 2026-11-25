# StudyOS

> The social operating system for student learning.

StudyOS is a student-centered platform that brings personal study, study groups, planning, collaboration, knowledge search, and AI-assisted learning into one calm academic home.

This repository is in the **ground stage**: foundation scaffold, architecture decisions, and initial product shell based on `STUDYOS_Master_Blueprint.pptx`.

## Ground Stage (current)

What is included now:

- **Next.js + TypeScript + Tailwind CSS** app scaffold (App Router, `src/` structure)
- **StudyOS design foundation**: calm academic theme, responsive app shell, navigation
- **Initial route map**: Home, Study, Groups, Search, Calendar, AI, Profile
- **Dashboard shell**: blueprint-aligned home surface with placeholder/mock data
- **Architecture docs**: initial ADRs and ground-stage plan
- **Public repo baseline**: MIT license, env example, lint/typecheck scripts

What is intentionally **not** implemented yet:

- Authentication and user accounts
- Database/schema migrations
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
| Quality | ESLint + TypeScript typecheck | Baseline code quality and safety |
| Architecture | Modular monolith (single app) | Simple now; clear domain boundaries for future extraction |

Planned next integrations (per blueprint): PostgreSQL (+ pgvector), managed auth/realtime, object storage (R2/S3-compatible), AI provider abstraction/RAG, LiveKit for live rooms.

## Project Structure

```text
.
├── docs/
│   ├── architecture/adr/      # Architecture Decision Records
│   └── product/               # Product/ground-stage planning docs
├── src/
│   ├── app/                   # Next.js App Router routes
│   ├── components/            # UI and layout components
│   ├── lib/                   # Shared utilities
│   └── modules/               # Domain module boundaries (future implementation)
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

Open [http://localhost:3000](http://localhost:3000).

### Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Documentation

- [Ground Stage Plan](./docs/product/ground-stage.md)
- [ADR 0001 - Initial Foundation](./docs/architecture/adr/0001-initial-foundation.md)
- [Master Blueprint](./STUDYOS_Master_Blueprint.pptx)

## Roadmap Direction

The blueprint defines a phased release path:

1. **0.1 Foundation** - auth, profile, DB, design system *(current ground stage starts here)*
2. **0.2 Personal** - dashboard, tasks, timetable
3. **0.3 Groups** - create/join, roles, discussions
4. **0.4 Realtime** - chat + notifications
5. **0.5 AI** - tutor + basic planner
6. **0.6 Knowledge** - upload + RAG + citations
7. **0.7 Live** - study rooms + sessions
8. **1.0 Pilot** - polish + safety + analytics

## License

[MIT](./LICENSE)
