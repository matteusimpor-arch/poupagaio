import Link from "next/link";
import { ArrowLeft, LockKeyhole, Mail, UserRound } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-hero">
        <BrandMark />
        <div><small>Finanças sem complicação</small><h1>Organize hoje.<br/>Voe mais longe.</h1><p>Seu dinheiro pessoal, compartilhado ou familiar em um único lugar.</p></div>
      </section>
      <section className="auth-card">
        <Link href="/"><ArrowLeft size={18}/> Voltar</Link>
        <small>Bem-vindo ao Poupagaio</small>
        <h2>Entre na sua conta</h2>
        <p>A autenticação será conectada ao Supabase na próxima fase.</p>
        <form>
          <label>E-mail<span><Mail size={18}/><input type="email" placeholder="voce@email.com"/></span></label>
          <label>Senha<span><LockKeyhole size={18}/><input type="password" placeholder="Sua senha"/></span></label>
          <button className="primary" type="button">Entrar</button>
        </form>
        <div className="auth-divider"><span/>ou<span/></div>
        <Link href="/cadastro" className="secondary">Criar minha conta</Link>
      </section>
    </main>
  );
}
