import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { hash } from "bcrypt";
import {
  lojas,
  usuarios,
  produtos,
  estoque,
  financeiroLancamentos,
} from "./schema";

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  console.log("Seeding...");

  // Lojas
  const [loja1, loja2, loja3] = await db
    .insert(lojas)
    .values([
      { nome: "Bravo Shopping Flamboyant", cidade: "Goiânia" },
      { nome: "Bravo Centro", cidade: "Goiânia" },
      { nome: "Bravo Anápolis", cidade: "Anápolis" },
    ])
    .returning();

  console.log(`  3 lojas criadas`);

  // Usuarios
  const senhaGestor = await hash("gestor123", 10);
  const senhaOperador = await hash("operador123", 10);

  await db.insert(usuarios).values([
    {
      email: "gestor@bravo.com",
      senhaHash: senhaGestor,
      nome: "Carlos Gestor",
      papel: "gestor",
      lojaId: null,
    },
    {
      email: "operador@bravo.com",
      senhaHash: senhaOperador,
      nome: "Maria Operadora",
      papel: "operador",
      lojaId: loja1.id,
    },
  ]);

  console.log(`  2 usuários criados`);

  // Produtos
  const produtosData = [
    { sku: "CAM-BAS-001", nome: "Camiseta Básica Preta", categoria: "Moda", preco: "79.90" },
    { sku: "CAM-BAS-002", nome: "Camiseta Básica Branca", categoria: "Moda", preco: "79.90" },
    { sku: "CAL-JNS-001", nome: "Calça Jeans Slim", categoria: "Moda", preco: "189.90" },
    { sku: "FON-BLT-001", nome: "Fone Bluetooth TWS", categoria: "Eletrônicos", preco: "129.90" },
    { sku: "CAR-USB-001", nome: "Carregador USB-C 20W", categoria: "Eletrônicos", preco: "59.90" },
    { sku: "REL-DIG-001", nome: "Relógio Digital Esportivo", categoria: "Acessórios", preco: "149.90" },
    { sku: "BON-TRK-001", nome: "Boné Trucker", categoria: "Acessórios", preco: "49.90" },
    { sku: "MOC-COU-001", nome: "Mochila Couro Sintético", categoria: "Acessórios", preco: "219.90" },
  ];

  const produtosCriados = await db.insert(produtos).values(produtosData).returning();

  console.log(`  ${produtosCriados.length} produtos criados`);

  // Estoque — distribuir entre lojas com quantidades variadas
  const estoqueData = [];
  for (const produto of produtosCriados) {
    for (const loja of [loja1, loja2, loja3]) {
      // Gerar quantidade entre 0 e 50, com alguns em baixo estoque
      const qtd = Math.floor(Math.random() * 50);
      estoqueData.push({
        produtoId: produto.id,
        lojaId: loja.id,
        quantidade: qtd,
      });
    }
  }

  await db.insert(estoque).values(estoqueData);
  console.log(`  ${estoqueData.length} registros de estoque criados`);

  // Financeiro — lançamentos variados
  const hoje = new Date();
  const lancamentos = [
    { lojaId: loja1.id, tipo: "pagar" as const, descricao: "Aluguel Shopping Flamboyant", valor: "12000.00", vencimento: formatDate(addDays(hoje, -5)), status: "atrasado" as const },
    { lojaId: loja1.id, tipo: "pagar" as const, descricao: "Fornecedor Têxtil Sul", valor: "8500.00", vencimento: formatDate(addDays(hoje, 10)), status: "pendente" as const },
    { lojaId: loja1.id, tipo: "receber" as const, descricao: "Venda cartão - lote 0412", valor: "15200.00", vencimento: formatDate(addDays(hoje, 3)), status: "pendente" as const },
    { lojaId: loja2.id, tipo: "pagar" as const, descricao: "Conta de energia", valor: "2800.00", vencimento: formatDate(addDays(hoje, -2)), status: "atrasado" as const },
    { lojaId: loja2.id, tipo: "receber" as const, descricao: "Venda à vista - semana 27", valor: "9400.00", vencimento: formatDate(addDays(hoje, 0)), status: "pago" as const },
    { lojaId: loja2.id, tipo: "pagar" as const, descricao: "Fornecedor Eletrônicos SP", valor: "6200.00", vencimento: formatDate(addDays(hoje, 15)), status: "pendente" as const },
    { lojaId: loja3.id, tipo: "pagar" as const, descricao: "Aluguel Anápolis", valor: "5500.00", vencimento: formatDate(addDays(hoje, 5)), status: "pendente" as const },
    { lojaId: loja3.id, tipo: "receber" as const, descricao: "Venda PIX - semana 26", valor: "4300.00", vencimento: formatDate(addDays(hoje, -1)), status: "pago" as const },
    { lojaId: loja3.id, tipo: "pagar" as const, descricao: "IPTU parcela 7/12", valor: "980.00", vencimento: formatDate(addDays(hoje, -10)), status: "atrasado" as const },
  ];

  await db.insert(financeiroLancamentos).values(lancamentos);
  console.log(`  ${lancamentos.length} lançamentos financeiros criados`);

  console.log("Seed concluído!");
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

seed().catch((err) => {
  console.error("Erro no seed:", err);
  process.exit(1);
});
