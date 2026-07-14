import {
  pgTable,
  uuid,
  text,
  numeric,
  integer,
  date,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const lojas = pgTable("lojas", {
  id: uuid("id").defaultRandom().primaryKey(),
  nome: text("nome").notNull(),
  cidade: text("cidade"),
});

export const usuarios = pgTable("usuarios", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").unique().notNull(),
  senhaHash: text("senha_hash").notNull(),
  nome: text("nome"),
  papel: text("papel", { enum: ["gestor", "operador"] }).notNull(),
  lojaId: uuid("loja_id").references(() => lojas.id),
  criadoEm: timestamp("criado_em", { withTimezone: true }).defaultNow(),
});

export const produtos = pgTable("produtos", {
  id: uuid("id").defaultRandom().primaryKey(),
  sku: text("sku").unique().notNull(),
  nome: text("nome").notNull(),
  categoria: text("categoria"),
  preco: numeric("preco", { precision: 10, scale: 2 }).notNull(),
});

export const estoque = pgTable(
  "estoque",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    produtoId: uuid("produto_id")
      .references(() => produtos.id)
      .notNull(),
    lojaId: uuid("loja_id")
      .references(() => lojas.id)
      .notNull(),
    quantidade: integer("quantidade").notNull().default(0),
    atualizadoEm: timestamp("atualizado_em", { withTimezone: true }).defaultNow(),
  },
  (t) => [unique().on(t.produtoId, t.lojaId)]
);

export const refreshTokensRevogados = pgTable("refresh_tokens_revogados", {
  id: uuid("id").defaultRandom().primaryKey(),
  token: text("token").notNull(),
  revogadoEm: timestamp("revogado_em", { withTimezone: true }).defaultNow(),
});

export const financeiroLancamentos = pgTable("financeiro_lancamentos", {
  id: uuid("id").defaultRandom().primaryKey(),
  lojaId: uuid("loja_id")
    .references(() => lojas.id)
    .notNull(),
  tipo: text("tipo", { enum: ["pagar", "receber"] }).notNull(),
  descricao: text("descricao").notNull(),
  valor: numeric("valor", { precision: 10, scale: 2 }).notNull(),
  vencimento: date("vencimento").notNull(),
  status: text("status", { enum: ["pendente", "pago", "atrasado"] })
    .notNull()
    .default("pendente"),
  criadoEm: timestamp("criado_em", { withTimezone: true }).defaultNow(),
});
