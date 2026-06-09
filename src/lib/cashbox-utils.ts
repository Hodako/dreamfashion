import type { CashboxEntry } from "@/lib/queries";

export type CashboxKind = CashboxEntry["kind"];

/** Signed amount for balance: inflows positive, outflows negative. */
export function cashboxDelta(kind: CashboxKind, amount: number): number {
  return kind === "deposit" || kind === "sale" ? Number(amount) : -Number(amount);
}

/** Sum all cashbox entries into current balance. */
export function cashboxBalance(entries: Pick<CashboxEntry, "kind" | "amount">[]): number {
  return entries.reduce((sum, e) => sum + cashboxDelta(e.kind, e.amount), 0);
}

/** Human label key suffix for a cashbox entry kind. */
export function cashboxKindLabel(kind: CashboxKind): "deposit" | "withdraw" | "sale" | "expense" {
  if (kind === "sale") return "sale";
  if (kind === "expense") return "expense";
  return kind === "deposit" ? "deposit" : "withdraw";
}
