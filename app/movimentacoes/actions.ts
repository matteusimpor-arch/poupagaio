"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function parseMoney(raw: string) {
  const normalized = raw.replace(/\s/g, "").replace(/^R\$/, "").replace(/\./g, "").replace(",", ".");
  return Number(normalized);
}

function paymentStatus(date: string) {
  const due = new Date(date + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.ceil((due.getTime() - today.getTime()) / 86400000);

  if (days < 0) return "late";
  if (days === 0) return "due_today";
  if (days <= 3) return "due_soon";
  return "pending";
}

export async function createTransaction(formData: FormData) {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) redirect("/login");

  const spaceId = text(formData, "space_id");
  const description = text(formData, "description");
  const dueDate = text(formData, "due_date");
  const amount = parseMoney(text(formData, "amount"));
  const kind = text(formData, "kind");

  if (!spaceId || description.length < 2 || !dueDate || !Number.isFinite(amount) || amount <= 0) {
    redirect("/movimentacoes?error=" + encodeURIComponent("Preencha data, descrição e valor corretamente."));
  }

  const { error } = await supabase.from("transactions").insert({
    space_id: spaceId,
    created_by: userId,
    kind,
    description,
    amount,
    category: text(formData, "category") || null,
    due_date: dueDate,
    status: kind === "income" ? "pending" : paymentStatus(dueDate),
    notes: text(formData, "notes") || null,
  });

  if (error) redirect("/movimentacoes?error=" + encodeURIComponent(error.message));

  revalidatePath("/");
  revalidatePath("/movimentacoes");
  redirect("/movimentacoes?success=" + encodeURIComponent("Lançamento adicionado."));
}

export async function markAsPaid(formData: FormData) {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) redirect("/login");

  const id = text(formData, "id");
  const spaceId = text(formData, "space_id");

  const { error } = await supabase
    .from("transactions")
    .update({ status: "paid", paid_at: new Date().toISOString(), paid_by: userId })
    .eq("id", id)
    .eq("space_id", spaceId);

  if (error) redirect("/movimentacoes?error=" + encodeURIComponent(error.message));

  revalidatePath("/");
  revalidatePath("/movimentacoes");
}
