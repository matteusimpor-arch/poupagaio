import Link from "next/link";
import { ArrowLeft, LockKeyhole, Mail } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { login as loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

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
        <p>Acesse seu espaço financeiro com segurança.</p>
        {params.error && <div className="form-alert error" role="alert">{params.error}</div>}
        {params.message && <div className="form-alert success" role="status">{params.message}</div>}
        <form action={loginAction}>
          <label htmlFor="email">E-mail<span><Mail size={18}/><input id="email" name="email" type="email" placeholder="voce@email.com" autoComplete="email" required/></span></label>
          <label htmlFor="password">Senha<span><LockKeyhole size={18}/><input id="password" name="password" type="password" placeholder="Sua senha" autoComplete="current-password" required/></span></label>
          <button className="primary" type="submit">Entrar</button>
        </form>
        <div className="auth-divider"><span/>ou<span/></div>
        <Link href="/cadastro" className="secondary">Criar minha conta</Link>
      </section>
    </main>
  );
}
