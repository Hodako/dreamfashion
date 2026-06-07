import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: string; name: string; image_url: string | null;
  buy_price: number; sell_price: number; stock: number; created_at: string;
};
export type Party = { id: string; name: string; phone: string | null; created_at: string };
export type Sale = {
  id: string; product_id: string | null; product_name: string; qty: number;
  buy_price: number; sell_price: number; profit: number;
  type: "cash" | "credit"; party_id: string | null;
  paid_amount: number; due_amount: number; created_at: string;
  parties?: { name: string } | null;
};
export type Payment = { id: string; party_id: string; amount: number; note: string | null; created_at: string };
export type Purchase = { id: string; product_id: string | null; product_name: string; qty: number; unit_cost: number; total: number; note: string | null; created_at: string };
export type Expense = { id: string; title: string; amount: number; note: string | null; created_at: string };
export type Somiti = { id: string; kind: "deposit" | "withdraw"; amount: number; note: string | null; created_at: string };
export type Withdrawal = { id: string; amount: number; note: string | null; created_at: string };

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Product[];
}
export async function getParties(): Promise<Party[]> {
  const { data, error } = await supabase.from("parties").select("*").order("name");
  if (error) throw error;
  return (data ?? []) as Party[];
}
export async function getSales(): Promise<Sale[]> {
  const { data, error } = await supabase
    .from("sales").select("*, parties(name)")
    .order("created_at", { ascending: false }).limit(200);
  if (error) throw error;
  return (data ?? []) as Sale[];
}
export async function getPurchases(): Promise<Purchase[]> {
  const { data, error } = await supabase.from("purchases").select("*").order("created_at", { ascending: false }).limit(200);
  if (error) throw error;
  return (data ?? []) as Purchase[];
}
export async function getExpenses(): Promise<Expense[]> {
  const { data, error } = await supabase.from("expenses").select("*").order("created_at", { ascending: false }).limit(200);
  if (error) throw error;
  return (data ?? []) as Expense[];
}
export async function getSomiti(): Promise<Somiti[]> {
  const { data, error } = await supabase.from("somiti_entries").select("*").order("created_at", { ascending: false }).limit(200);
  if (error) throw error;
  return (data ?? []) as Somiti[];
}
export async function getWithdrawals(): Promise<Withdrawal[]> {
  const { data, error } = await supabase.from("owner_withdrawals").select("*").order("created_at", { ascending: false }).limit(200);
  if (error) throw error;
  return (data ?? []) as Withdrawal[];
}
export async function getPaymentsForParty(partyId: string): Promise<Payment[]> {
  const { data, error } = await supabase.from("payments").select("*").eq("party_id", partyId).order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Payment[];
}
export async function getSalesForParty(partyId: string): Promise<Sale[]> {
  const { data, error } = await supabase.from("sales").select("*").eq("party_id", partyId).order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Sale[];
}

/** Get signed url for an image stored under product-images bucket. */
export async function signedImage(path: string | null): Promise<string | null> {
  if (!path) return null;
  const { data } = await supabase.storage.from("product-images").createSignedUrl(path, 3600);
  return data?.signedUrl ?? null;
}