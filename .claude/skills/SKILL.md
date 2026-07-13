---
name: postgres-api-backend
description: Use this skill sempre que Kaian precisar construir um backend com Postgres e API própria SEM usar Supabase (auth, ORM e queries feitos na mão). Cobre setup de Postgres via Neon no Vercel Marketplace, escolha de framework de API (Fastify/Express/NestJS), ORM (Prisma/Drizzle/SQL puro), autenticação com JWT própria, migrations e connection pooling em ambiente serverless. Acionar quando o usuário mencionar "Postgres sem Supabase", "backend próprio", "Neon", "Vercel Postgres", "autenticação com JWT", ou pedir para não depender de BaaS.
---

# Postgres + API Backend (sem Supabase)

Para projetos onde Kaian quer controle total do backend — sem auth gerenciado, sem RLS do Supabase, tudo construído na mão. Complementa a skill `backend-architect`: usar esta quando a decisão já foi "Postgres self-managed".

## 1. Banco: Postgres via Neon no Vercel

**Atenção**: "Vercel Postgres" foi descontinuado (dez/2024). O banco de dados Postgres do Vercel hoje é a integração nativa com **Neon**, instalada pelo Marketplace do Vercel. Funcionalmente é Postgres normal — serverless, com scale-to-zero e branching de banco por preview deployment.

Setup:
1. No dashboard Vercel: Storage → Marketplace → Neon → Install (billing unificado no Vercel)
2. Isso injeta `DATABASE_URL` (conexão pooled) e `DATABASE_URL_UNPOOLED` (conexão direta) nas env vars do projeto
3. Rodar `vercel env pull` localmente para puxar as variáveis

**Sempre usar `DATABASE_URL` (pooled)** nas queries da aplicação. A versão unpooled é só para migrations/ferramentas que exigem conexão direta.

## 2. Framework de API — perguntar antes de decidir

| Cenário | Framework |
|---|---|
| Endpoints simples/médios, serverless no Vercel (`/api`) | **Fastify** (leve, cold start rápido) |
| Legado ou equipe já acostumada | Express |
| Projeto grande, modular, múltiplos domínios | NestJS (ver ressalva de cold start em `backend-architect/references/vercel-deploy.md`) |

## 3. ORM/query builder — perguntar antes de decidir

| Opção | Quando usar |
|---|---|
| **Drizzle** | Padrão recomendado para serverless — leve, sem overhead de client generation, boa DX com TypeScript |
| **Prisma** | Projeto que já usa Prisma ou precisa de migrations muito visuais; atenção ao cold start (client gerado é mais pesado) |
| **SQL puro (`pg`)** | Poucas queries, controle total, sem abstração |

Ver `references/orm-setup.md` para setup de cada um.

## 4. Autenticação própria (sem Supabase Auth)

Sem BaaS, autenticação é responsabilidade da aplicação:
- Senhas: hash com `bcrypt` ou `argon2` (nunca reinventar)
- Sessão: JWT assinado (`jsonwebtoken`), token curto + refresh token, ou cookies httpOnly com sessão no banco
- Nunca guardar JWT secret no código — sempre env var

Ver `references/auth-jwt.md` para o padrão completo (registro, login, middleware de proteção de rota, refresh).

## 5. Migrations

- Drizzle Kit ou Prisma Migrate — nunca alterar schema em produção manualmente via SQL editor
- Rodar migration como parte do build (`vercel-build` script) ou via CI antes do deploy, nunca on-the-fly na function serverless

## 6. Connection pooling em serverless

Mesma regra da skill `backend-architect`: connections são caras em serverless. Reaproveitar o client entre invocações (client fora do handler, não dentro) e sempre usar a URL pooled.

## Depois de decidir

Resumir em poucas linhas: framework, ORM, estratégia de auth, e o motivo — antes de gerar código. Respostas curtas, esperar confirmação do Kaian.
