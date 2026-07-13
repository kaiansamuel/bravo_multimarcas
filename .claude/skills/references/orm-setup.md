# Setup de ORM/query builder

## Drizzle (recomendado para serverless)

```
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
```

Estrutura:
```
/db
  schema.ts        # definição de tabelas
  index.ts         # client (usar driver @neondatabase/serverless para HTTP, ideal p/ serverless)
drizzle.config.ts
```

`db/index.ts`:
```ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
```

Migrations: `npx drizzle-kit generate` gera SQL a partir do schema, `npx drizzle-kit migrate` aplica.

## Prisma

```
npm install prisma @prisma/client
npx prisma init
```

Em serverless, usar o Prisma Accelerate ou o driver adapter para Neon (`@prisma/adapter-neon`) — sem isso, cada cold start recria conexões e estoura limite do Postgres.

`schema.prisma` — usar `directUrl` (unpooled) para migrations e `url` (pooled) para runtime:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL_UNPOOLED")
}
```

Migrations: `npx prisma migrate dev` (local), `npx prisma migrate deploy` (produção, rodar no build).

## SQL puro (pg)

```
npm install pg
```

```ts
import { Pool } from 'pg';

// client fora do handler — reaproveitado entre invocações
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function query(text: string, params?: any[]) {
  return pool.query(text, params);
}
```

Sem abstração de migration — versionar `.sql` manualmente em `/migrations` e aplicar com script próprio ou `node-pg-migrate`.
