"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function login(formData: FormData) {
  const email = field(formData, "email");
  const password = field(formData, "password");
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/login?error=" + encodeURIComponent("E-mail ou senha inválidos."));

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const fullName = field(formData, "full_name");
  const email = field(formData, "email");
  const password = field(formData, "password");

  if (fullName.length < 3) redirect("/cadastro?error=" + encodeURIComponent("Informe seu nome completo."));
  if (password.length < 8) redirect("/cadastro?error=" + encodeURIComponent("A senha deve ter pelo menos 8 caracteres."));

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) redirect("/cadastro?error=" + encodeURIComponent(error.message));
  redirect("/login?message=" + encodeURIComponent("Cadastro criado. Confirme seu e-mail para entrar."));
}
