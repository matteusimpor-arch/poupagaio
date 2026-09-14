import Link from "next/link";
import { ArrowLeft, Check, Plus, ReceiptText } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { createClient } from "@/lib/supabase/server";
import { createTransaction, markAsPaid } from "./actions";

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  scheduled: "Agendado",
  due_soon: "Vence em breve",
  due_today: "Vence hoje",
  late: "Atrasado",
  paid: "Pago",
  cancelled: "Cancelado",
};

export default async function MovimentacoesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  const { data: membership } = await supabase
    .from("space_members")
    .select("space_id")
    .eq("user_id", userId!)
    .limit(1)
    .maybeSingle();

  const spaceId = membership?.space_id ?? "";
  const { data: transactions } = spaceId
    ? await supabase
        .from("transactions")
        .select("id, space_id, description, amount, due_date, kind, status, category")
        .eq("space_id", spaceId)
        .order("due_date", { ascending: false })
        .limit(50)
    : { data: [] };

  return (
    <main className="transactions-page">
      <header className="simple-header">
        <BrandMark />
        <Link href="/"><ArrowLeft size={18}/> Voltar ao início</Link>
      </header>

      <section className="transactions-title">
        <div><small>Controle mensal</small><h1>Movimentações</h1><p>Registre entradas, gastos e parcelas usando somente as informações essenciais.</p></div>
        <span><ReceiptText/></span>
      </section>

      {params.error && <div className="form-alert error" role="alert">{params.error}</div>}
      {params.success && <div className="form-alert success" role="status">{params.success}</div>}

      <div className="transactions-grid">
        <section className="panel transaction-form">
          <div className="section-heading"><div><small>Novo registro</small><h2>Adicionar movimentação</h2></div><Plus/></div>
          <form action={createTransaction}>
            <input type="hidden" name="space_id" value={spaceId}/>
            <label>Tipo
              <select name="kind" required>
                <option value="income">Entrada</option>
                <option value="fixed_expense">Gasto fixo</option>
                <option value="variable_expense">Gasto variável</option>
                <option value="installment">Parcela</option>
              </select>
            </label>
            <label>Data<input name="due_date" type="date" required/></label>
            <label>Descrição<input name="description" placeholder="Ex.: Internet" minLength={2} required/></label>
            <label>Valor<input name="amount" inputMode="decimal" placeholder="R$ 0,00" required/></label>
            <details>
              <summary>Mais opções</summary>
              <label>Categoria<input name="category" placeholder="Ex.: Moradia"/></label>
              <label>Observação<textarea name="notes" placeholder="Informação opcional"/></label>
            </details>
            <button className="primary" disabled={!spaceId}>Adicionar lançamento</button>
          </form>
          {!spaceId && <p className="empty-note">Seu espaço financeiro ainda não foi localizado.</p>}
        </section>

        <section className="panel">
          <div className="section-heading"><div><small>Setembro</small><h2>Últimos lançamentos</h2></div></div>
          <div className="transaction-list">
            {transactions?.length ? transactions.map((item) => (
              <article key={item.id}>
                <i className={item.kind === "income" ? "income-dot" : "expense-dot"}/>
                <div><strong>{item.description}</strong><small>{item.category || "Sem categoria"} · {new Date(item.due_date + "T00:00:00").toLocaleDateString("pt-BR")}</small></div>
                <span className={item.kind === "income" ? "positive" : "negative"}>
                  {item.kind === "income" ? "+" : "-"} {Number(item.amount).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
                <em className={"transaction-status " + item.status}>{statusLabels[item.status] ?? item.status}</em>
                {item.status !== "paid" && item.kind !== "income" && (
                  <form action={markAsPaid}>
                    <input type="hidden" name="id" value={item.id}/>
                    <input type="hidden" name="space_id" value={item.space_id}/>
                    <button title="Marcar como pago" aria-label={"Marcar " + item.description + " como pago"}><Check size={17}/></button>
                  </form>
                )}
              </article>
            )) : <div className="empty-state"><ReceiptText/><strong>Nenhum lançamento</strong><p>Adicione a primeira movimentação deste espaço.</p></div>}
          </div>
        </section>
      </div>
    </main>
  );
}
