# ADR 0001: Initial Foundation — Modular Monolith Web App

- **Status**: Accepted
- **Date**: 2026-11-25
- **Deciders**: StudyOS founder + engineering copilot

## Context

StudyOS is a broad product vision (personal study, groups, chat, calendar, AI, knowledge, live rooms). The blueprint recommends moving fast while preserving clean boundaries and avoiding premature complexity. The project is currently pre-pilot with no production users.

## Decision

Start with a **single Next.js (App Router) TypeScript application** using a **modular monolith** structure.

### Chosen ground-stage stack

- **Web framework**: Next.js + React + TypeScript
- **Styling**: Tailwind CSS v4 with tokenized theme variables
- **Code quality**: ESLint + TypeScript strict checks
- **Package manager**: npm
- **Repo model**: Single app now; domain-oriented folders under `src/modules/` for future growth

### Deferred / planned integrations

- **Auth**: managed auth provider (e.g., Supabase Auth or equivalent) with app-layer authorization
- **Database**: PostgreSQL as system of record; pgvector when semantic retrieval is implemented
- **Realtime**: managed realtime for chat/notifications; evaluate Supabase Realtime first
- **Files**: S3-compatible object storage (Cloudflare R2 candidate)
- **AI/RAG**: provider abstraction, permission-filtered retrieval, citation-aware responses
- **Live rooms**: managed WebRTC/SFU (LiveKit candidate) after core retention is proven

## Consequences

### Positive

- Fast local development and deployment for a solo/small team
- One TypeScript codebase with shared types and simple debugging
- Clear path to add domain modules without distributed-system overhead
- Easy to validate product behavior before infrastructure investment

### Negative / Risks

- Module boundaries must be enforced by discipline (no premature spaghetti imports)
- Some future extraction to services/workers will require refactoring
- Managed-provider choices need adapter boundaries to avoid lock-in

## Guardrails

- Organize by domain capability (`auth`, `groups`, `study`, `ai`, etc.)
- Keep business rules out of UI components
- Treat permissions/security as first-class design constraints
- Add ADRs for major structural or vendor decisions
- Do not add microservices, multiple databases, or heavy infra before measured need
