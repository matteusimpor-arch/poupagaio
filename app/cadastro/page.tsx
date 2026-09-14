import Link from "next/link";
import { ArrowLeft, LockKeyhole, Mail, UserRound } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { signup } from "@/app/login/actions";

export default async function CadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

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
        {params.error && <div className="form-alert error" role="alert">{params.error}</div>}
        <form action={signup}>
          <label htmlFor="full_name">Nome completo<span><UserRound size={18}/><input id="full_name" name="full_name" placeholder="Seu nome" autoComplete="name" required/></span></label>
          <label htmlFor="email">E-mail<span><Mail size={18}/><input id="email" name="email" type="email" placeholder="voce@email.com" autoComplete="email" required/></span></label>
          <label htmlFor="password">Senha<span><LockKeyhole size={18}/><input id="password" name="password" type="password" placeholder="Mínimo de 8 caracteres" autoComplete="new-password" minLength={8} required/></span></label>
          <button className="primary" type="submit">Criar conta</button>
        </form>
      </section>
    </main>
  );
}
