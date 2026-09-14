"use client";

import {
  ArrowDownLeft, ArrowUpRight, Bell, CalendarDays, CheckCircle2, ChevronLeft,
  ChevronRight, CreditCard, Heart, Home, Landmark, ListChecks, Menu, PiggyBank,
  Plus, Settings, Target, TrendingUp, WalletCards, X
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BrandMark } from "./brand-mark";

const navigation = [
  ["Início", Home, "/"], ["Movimentações", WalletCards, "/movimentacoes"],
  ["Planejamento", ListChecks, "#"], ["Investimentos", TrendingUp, "#"], ["Metas", Target, "#"]
] as const;

const accounts = [
  { name: "Conta demonstrativa", date: "18 set", value: "R$ 1.000,00", status: "soon", label: "Vence em 3 dias" },
  { name: "Internet", date: "20 set", value: "R$ 100,00", status: "pending", label: "Pendente" },
  { name: "Energia", date: "12 set", value: "R$ 150,00", status: "paid", label: "Pago" },
  { name: "Cartão de exemplo", date: "10 set", value: "R$ 500,00", status: "late", label: "Atrasado" },
];

const quick = [
  ["Entrada", ArrowDownLeft, "green"], ["Gasto", ArrowUpRight, "red"],
  ["Parcelamento", CreditCard, "orange"], ["Investimento", Landmark, "cyan"],
  ["Meta", Target, "gold"], ["Desejo", Heart, "purple"]
] as const;

export function DashboardShell() {
  const [active, setActive] = useState("Início");
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      <aside className={"sidebar " + (open ? "open" : "")}>
        <button className="close-menu" onClick={() => setOpen(false)} aria-label="Fechar menu"><X /></button>
        <BrandMark />
        <button className="space-switch">
          <span>ML</span><span><small>Espaço atual</small><strong>Espaço demonstrativo</strong></span>
        </button>
        <nav aria-label="Menu principal">
          {navigation.map(([label, Icon, href]) => (
            <Link key={label} href={href} className={active === label ? "active" : ""} onClick={() => { setActive(label); setOpen(false); }}>
              <Icon size={20}/>{label}
            </Link>
          ))}
        </nav>
        <Link className="account-link" href="/login"><Settings size={20}/> Conta e acesso</Link>
      </aside>
      {open && <button className="backdrop" aria-label="Fechar menu" onClick={() => setOpen(false)}/>}

      <main className="dashboard">
        <header className="topbar">
          <button className="menu-trigger" onClick={() => setOpen(true)} aria-label="Abrir menu"><Menu /></button>
          <div><small>Olá!</small><h1>{active}</h1></div>
          <div className="top-actions"><button aria-label="Notificações"><Bell size={19}/></button><span>PG</span></div>
        </header>

        <div className="month-select">
          <button aria-label="Mês anterior"><ChevronLeft/></button>
          <span><CalendarDays size={18}/> Setembro de 2026</span>
          <button aria-label="Próximo mês"><ChevronRight/></button>
        </div>

        <section className="balance">
          <div><small>Saldo disponível</small><strong>R$ 3.250,00</strong><span><TrendingUp size={15}/> 8,4% acima do mês passado</span></div>
          <PiggyBank className="balance-icon"/>
        </section>

        <section className="summary">
          <article><i className="income"><ArrowDownLeft/></i><span><small>Entradas</small><strong>R$ 6.000,00</strong></span></article>
          <article><i className="expense"><ArrowUpRight/></i><span><small>Gastos</small><strong>R$ 2.750,00</strong></span></article>
          <article><i className="investment"><Landmark/></i><span><small>Investido</small><strong>R$ 500,00</strong></span></article>
          <article><i className="saved"><PiggyBank/></i><span><small>Guardado</small><strong>R$ 800,00</strong></span></article>
        </section>

        <section>
          <div className="section-heading"><div><small>Lançamento rápido</small><h2>O que deseja adicionar?</h2></div></div>
          <div className="quick-grid">
            {quick.map(([label, Icon, tone]) => <button key={label} className={tone}><i><Icon size={20}/></i>{label}</button>)}
          </div>
        </section>

        <div className="dashboard-grid">
          <section className="panel">
            <div className="section-heading"><div><small>Contas do mês</small><h2>Próximos pagamentos</h2></div><button>Ver todas</button></div>
            <div className="account-list">
              {accounts.map(item => (
                <article className={item.status} key={item.name}>
                  <i/><span><strong>{item.name}</strong><small>{item.date}</small></span>
                  <b>{item.value}</b><em>{item.label}</em>
                </article>
              ))}
            </div>
          </section>
          <section className="panel goal">
            <div className="section-heading"><div><small>Meta em destaque</small><h2>Reserva de emergência</h2></div><Target/></div>
            <p><strong>R$ 4.500</strong> de R$ 10.000</p>
            <div className="progress"><i/></div>
            <div className="progress-label"><span>45% concluído</span><b>Faltam R$ 5.500</b></div>
            <button className="primary"><Plus size={18}/> Guardar dinheiro</button>
          </section>
        </div>

        <section className="monthly-goal">
          <i><CheckCircle2/></i>
          <div><small>Meta mensal</small><h2>Você está dentro do planejamento</h2><p>As contas pagas e os valores guardados acompanham a meta de setembro.</p></div>
          <span><strong>82%</strong><small>do mês concluído</small></span>
        </section>

        <footer className="legend">
          <span><i className="paid"/>Pago</span><span><i className="soon"/>Vence em breve</span>
          <span><i className="today"/>Vence hoje</span><span><i className="late"/>Atrasado</span>
          <span><i className="pending"/>Pendente</span>
        </footer>
      </main>
      <button className="floating" aria-label="Adicionar lançamento"><Plus/></button>
    </div>
  );
}
