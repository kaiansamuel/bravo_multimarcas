# PRD — Sistema de Gestão Interna Bravo Multimarcas

Projeto de portfólio Evolux · Categoria: Sistemas Sob Medida
Cliente fictício: rede de varejo multi-loja (moda/eletrônicos)
Documento de referência para desenvolvimento via Claude Code.

---

## 1. Contexto e objetivo

**Cliente fictício:** Bravo Multimarcas — rede de 6 lojas de moda e eletrônicos,
operação enxuta, sem ERP centralizado (cada loja controlava estoque em
planilha própria).

**Objetivo do projeto (case de portfólio Evolux):** demonstrar a entrega de um
**sistema de gestão interna sob medida** — não um site institucional, e sim
uma ferramenta de uso diário da equipe — cobrindo estoque multi-loja e
financeiro básico.

**Pilar do produto:** visão única. Hoje cada loja não sabe o estoque da
outra, e o financeiro é apurado no fim do mês. O sistema dá posição em tempo
real de estoque e caixa entre as 6 lojas.

---

## 2. Identidade de marca

### 2.1 Posicionamento e tom de voz

Prático e direto, linguagem de quem trabalha no balcão — não é discurso de
"transformação digital". Números primeiro, adjetivo depois. Se o texto pode
virar número (quantas lojas, quanto estoque, quanto em atraso), ele vira.

### 2.2 Conceito visual — "Etiqueta de preço"

Identidade derivada do vocabulário físico do varejo: etiqueta de preço,
código de barras, carimbo de conferência de estoque. Onde o case da Vetor
Metalúrgica usa linguagem de desenho técnico, esse usa linguagem de loja —
paleta quente (não a mesma dupla grafite+laranja do primeiro case, pra manter
o portfólio com identidades distintas entre si).

### 2.3 Paleta de cores

| Token | Hex | Uso |
|---|---|---|
| `charcoal-950` | `#17130F` | Fundo principal |
| `charcoal-900` | `#1F1911` | Fundo de seções alternadas |
| `charcoal-800` | `#2A2318` | Cards, superfícies elevadas |
| `charcoal-700` | `#3A3122` | Bordas, divisores |
| `gold` (acento) | `#E8B84B` | CTAs, destaques, valores positivos |
| `gold-dim` | `#C79A34` | Hover do acento |
| `wine` | `#8C3B4A` | Alertas, valores em atraso/negativos — único uso de "cor de problema" |
| `paper` | `#F3EFE7` | Texto principal (tom de papel de etiqueta, não branco puro) |
| `paper-muted` | `#A79C89` | Texto secundário |

Regra: `gold` é positivo (estoque ok, pago), `wine` é atenção (em atraso,
estoque baixo) — a paleta já comunica status sem precisar de ícone extra.

### 2.4 Tipografia

| Papel | Fonte | Peso/uso |
|---|---|---|
| Display (títulos) | **Oswald** | 600–700, uppercase, condensada — remete a carimbo/etiqueta |
| Corpo | **Inter** | 400–600 |
| Dados/técnico | **IBM Plex Mono** | SKU, código de barras, valores monetários em tabela |

### 2.5 Logo

Símbolo: um "B" desenhado como etiqueta de preço dobrada, com um furo circular
(o furo do barbante da etiqueta) no canto superior — reconhecível sem
precisar de legenda. Uma tira de código de barras minimalista (5-6 barras de
espessura variável) acompanha o wordmark, reforçando "varejo" sem clichê de
carrinho de compras.

Wordmark: **BRAVO** em Oswald 700 uppercase, **MULTIMARCAS** abaixo em mono,
tracking largo, tom `paper-muted`.

→ Arquivo em anexo: `logo-bravo-multimarcas.svg`

### 2.6 Elemento-assinatura

Cartão de etiqueta de preço "aberto" mostrando SKU, preço e código de barras
reais — usado no hero, no lugar do diagrama de viga do primeiro case. Mesma
lógica (peça central informativa, não ilustração decorativa), execução
diferente por categoria de produto.

### 2.7 Motion

Mesmo princípio do primeiro case: mínimo e funcional, sem animação ambiente.

---

## 3. Arquitetura técnica

Mesma stack validada no primeiro case (sem Supabase):

| Camada | Escolha |
|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind |
| Banco | Neon (Postgres via Vercel Marketplace, free tier) |
| ORM | Drizzle (`drizzle-orm/neon-http`) |
| Auth | JWT própria — bcrypt + jsonwebtoken, cookie httpOnly |
| API | Route Handlers em `/api` |
| Deploy | Vercel |

Diferença deste projeto: **multi-tenant leve** — cada usuário pertence a uma
`loja_id` (ou tem acesso a todas, se for gestor), então toda query de estoque
e financeiro filtra por loja(s) que o usuário pode ver. Ver seção 4.

Variáveis: `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`.

---

## 4. Modelagem de dados

```sql
usuarios
  id            uuid PK
  email         text UNIQUE NOT NULL
  senha_hash    text NOT NULL
  nome          text
  papel         text CHECK (papel IN ('gestor','operador'))  -- gestor vê todas as lojas
  loja_id       uuid FK -> lojas.id  -- null se papel = gestor
  criado_em     timestamptz DEFAULT now()

lojas
  id            uuid PK
  nome          text NOT NULL          -- ex: "Bravo Shopping Flamboyant"
  cidade        text

produtos
  id            uuid PK
  sku           text UNIQUE NOT NULL
  nome          text NOT NULL
  categoria     text
  preco         numeric NOT NULL

estoque
  id            uuid PK
  produto_id    uuid FK -> produtos.id
  loja_id       uuid FK -> lojas.id
  quantidade    integer NOT NULL DEFAULT 0
  atualizado_em timestamptz DEFAULT now()
  UNIQUE(produto_id, loja_id)

financeiro_lancamentos
  id            uuid PK
  loja_id       uuid FK -> lojas.id
  tipo          text CHECK (tipo IN ('pagar','receber'))
  descricao     text NOT NULL
  valor         numeric NOT NULL
  vencimento    date NOT NULL
  status        text CHECK (status IN ('pendente','pago','atrasado'))
  criado_em     timestamptz DEFAULT now()
```

Regra de acesso (validada no handler, sem RLS): `operador` só enxerga
`estoque`/`financeiro_lancamentos` da própria `loja_id`; `gestor` enxerga
todas as lojas e pode filtrar por uma específica.

---

## 5. Requisitos funcionais por página

### 5.1 Landing simples (`/`)
- Página institucional curta (não é o foco do case): headline sobre visão
  única de estoque/financeiro entre lojas, 3 blocos de módulo, CTA de login
- Sem blog nesse projeto — o case é o sistema, não o marketing

### 5.2 Login (`/login`)
- Mesmo padrão do primeiro case: email/senha, JWT + refresh em cookie httpOnly
- Redireciona pra `/dashboard`

### 5.3 Dashboard — visão geral (`/dashboard`)
- KPIs: total de SKUs em risco de ruptura (estoque baixo), total em atraso no
  financeiro, número de lojas ativas
- Se `papel = gestor`: seletor de loja (ou "todas"); se `operador`: fixo na
  própria loja, sem seletor visível

### 5.4 Estoque (`/dashboard/estoque`)
- Tabela: SKU, produto, loja, quantidade, badge de status (`gold` = ok,
  `wine` = abaixo do mínimo)
- Filtro por loja (gestor) e por categoria

### 5.5 Financeiro (`/dashboard/financeiro`)
- Duas listas: a pagar / a receber, com badge de status (pendente/pago/atrasado)
- Total pendente e total atrasado em destaque no topo

---

## 6. Requisitos não funcionais

- Responsivo mobile-first (operador de loja frequentemente acessa por celular)
- Nunca expor dados de uma loja pra usuário `operador` de outra loja — checagem
  de `loja_id` obrigatória em toda query, no backend, não só no frontend
- Senhas nunca em texto puro; access token 15min, refresh 7-30 dias
- Estados vazios em toda listagem (sem dado ainda) com instrução clara

---

## 7. Estrutura de pastas sugerida

```
app/
  page.tsx                        → landing simples
  login/page.tsx                    → login
  dashboard/layout.tsx                → shell protegido (seletor de loja se gestor)
  dashboard/page.tsx                   → KPIs gerais
  dashboard/estoque/page.tsx            → tabela de estoque
  dashboard/financeiro/page.tsx          → lançamentos financeiros
  api/auth/login/route.ts                 → POST login
  api/auth/logout/route.ts                 → POST logout
  api/auth/refresh/route.ts                 → POST refresh
  api/estoque/route.ts                       → GET estoque (filtrado por acesso)
  api/financeiro/route.ts                     → GET lançamentos (filtrado por acesso)
db/
  schema.ts, index.ts
middleware.ts                             → protege /dashboard e as rotas /api acima
components/
  SiteHeader.tsx, SiteFooter.tsx, PriceTagDiagram.tsx (assinatura), StoreSwitcher.tsx, LogoutButton.tsx
```

---

## 8. Fases de desenvolvimento sugeridas

1. Design system (tokens da seção 2.3–2.4) + logo
2. Landing simples (estática)
3. Neon + Drizzle: schema (`lojas`, `usuarios`, `produtos`, `estoque`,
   `financeiro_lancamentos`) + seed com 2-3 lojas de teste
4. Auth JWT com `papel`/`loja_id` no payload do token
5. Dashboard geral (KPIs)
6. Módulo Estoque
7. Módulo Financeiro
8. Revisão de isolamento de dados entre lojas (teste manual: logar como
   operador de loja A e confirmar que não vê dados da loja B)
9. Deploy Vercel

---

## 9. Fora de escopo (v1)

- Módulo de Vendas/PDV completo (só os dois módulos escolhidos: estoque + financeiro)
- Cadastro público de lojas/usuários (provisionado manualmente no banco)
- Exportação de relatórios (PDF/Excel)
- App mobile nativo — só responsivo web
