# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bravo Multimarcas — internal management system (not a marketing site) for a fictional 6-store retail chain (fashion/electronics). Portfolio piece for Evolux. Core value: unified real-time view of inventory and cash flow across all stores.

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind |
| Database | Neon (Postgres via Vercel Marketplace) |
| ORM | Drizzle (`drizzle-orm/neon-http`) |
| Auth | Custom JWT — bcrypt + jsonwebtoken, httpOnly cookies |
| API | Route Handlers in `/api` |
| Deploy | Vercel |

Env vars: `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`.

## Commands

```bash
npm run dev          # local dev server
npm run build        # production build
npm run lint         # ESLint
npx drizzle-kit push # push schema to Neon
npx drizzle-kit generate  # generate migrations
```

## Architecture

### Multi-tenant access control

Light multi-tenancy via `loja_id`. Two roles:
- **gestor**: sees all stores, can filter by specific one
- **operador**: restricted to their own `loja_id`

Access control is enforced **server-side in route handlers** (not RLS). Every query on `estoque` and `financeiro_lancamentos` must filter by the user's allowed store(s). Never expose data from store A to an operator of store B.

### Route structure

```
app/
  page.tsx                              # landing (static, minimal)
  login/page.tsx                        # email/password login
  dashboard/layout.tsx                  # protected shell (store switcher for gestor)
  dashboard/page.tsx                    # KPI overview
  dashboard/estoque/page.tsx            # inventory table
  dashboard/financeiro/page.tsx         # payables/receivables
  api/auth/{login,logout,refresh}/route.ts
  api/estoque/route.ts                  # GET filtered by access
  api/financeiro/route.ts               # GET filtered by access
db/
  schema.ts, index.ts                   # Drizzle schema & connection
middleware.ts                           # protects /dashboard and /api routes
```

### Data model (5 tables)

`usuarios` (id, email, senha_hash, nome, papel, loja_id), `lojas` (id, nome, cidade), `produtos` (id, sku, nome, categoria, preco), `estoque` (produto_id + loja_id unique, quantidade), `financeiro_lancamentos` (loja_id, tipo pagar/receber, valor, vencimento, status pendente/pago/atrasado).

## Design System

### Color semantics
- `gold (#E8B84B)` = positive (stock ok, paid) — CTAs, highlights
- `wine (#8C3B4A)` = attention (overdue, low stock) — only "problem" color
- Backgrounds: `charcoal-950 #17130F` (main), `charcoal-800 #2A2318` (cards)
- Text: `paper #F3EFE7` (primary), `paper-muted #A79C89` (secondary)

### Typography
- **Oswald** 600-700 uppercase: titles/display (stamp/label feel)
- **Inter** 400-600: body text
- **IBM Plex Mono**: SKUs, barcodes, monetary values in tables

### Tone
Practical, direct, shop-floor language. Numbers first, adjectives second. If text can become a number, it should.

## Key Constraints

- Mobile-first responsive (store operators use phones)
- Access tokens: 15min; refresh tokens: 7-30 days
- All listings must handle empty states with clear instructions
- No Supabase — raw Neon + Drizzle
- Out of scope (v1): sales/POS module, public registration, PDF/Excel export, native mobile app
