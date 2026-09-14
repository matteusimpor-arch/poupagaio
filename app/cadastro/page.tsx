import Link from "next/link";
import { ArrowLeft, LockKeyhole, Mail, UserRound } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

export default function CadastroPage() {
  return (
    <main className="auth-page">
      <section className="auth-hero">
        <BrandMark />
        <div><small>Comece seu controle</small><h1>Seu dinheiro.<br/>Suas escolhas.</h1><p>Crie seu espaço pessoal e convide alguém quando desejar.</p></div>
      </section>
      <section className="auth-card">
        <Link href="/login"><ArrowLeft size={18}/> Voltar para entrar</Link>
        <small>Nova conta</small><h2>Crie seu cadastro</h2>
        <p>Você receberá automaticamente o espaço “Minhas finanças”.</p>
        <form>
          <label>Nome completo<span><UserRound size={18}/><input placeholder="Seu nome"/></span></label>
          <label>E-mail<span><Mail size={18}/><input type="email" placeholder="voce@email.com"/></span></label>
          <label>Senha<span><LockKeyhole size={18}/><input type="password" placeholder="Mínimo de 8 caracteres"/></span></label>
          <button className="primary" type="button">Criar conta</button>
        </form>
      </section>
    </main>
  );
}
