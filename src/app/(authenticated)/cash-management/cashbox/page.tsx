"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCashbox } from "@/lib/queries";
import type { CashboxEntry } from "@/lib/queries";
import { useCachedQuery } from "@/hooks/use-cached-query";
import { useT } from "@/lib/i18n";
import { fmtMoney, fmtDateTime } from "@/lib/format";
import { cashboxBalance, cashboxDelta } from "@/lib/cashbox-utils";
import { PaginationBar, paginate } from "@/components/ui/pagination-bar";
import { ArrowLeft, Plus, Minus, Download, Banknote, TrendingUp, TrendingDown } from "lucide-react";
import { createCashboxFn } from "@/lib/rpc";
import { toast } from "sonner";
import { setCachedData, refreshQueries } from "@/lib/optimistic-cache";



type Range = "today" | "week" | "month" | "all" | "custom";
type FilterKind = "all" | CashboxEntry["kind"];

function RangePill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
        active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
      }`}
    >
      {label}
    </button>
  );
}

function kindLabel(t: (k: string) => string, kind: CashboxEntry["kind"]) {
  if (kind === "sale") return t("sales");
  if (kind === "expense") return t("expense");
  if (kind === "deposit") return t("add_money");
  return t("take_money");
}

export default function CashboxDetailsPage() {
  const { t } = useT();
  const cashbox = useCachedQuery(["cashbox"], getCashbox);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogKind, setDialogKind] = useState<"deposit" | "withdraw">("deposit");
  const [range, setRange] = useState<Range>("month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterKind, setFilterKind] = useState<FilterKind>("all");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const balance = cashboxBalance(cashbox.data ?? []);

  const { from, to } = useMemo(() => {
    const end = new Date(); end.setHours(23, 59, 59, 999);
    if (range === "today") {
      const start = new Date(); start.setHours(0, 0, 0, 0);
      return { from: start, to: end };
    }
    const start = new Date(0);
    if (range === "week") { start.setTime(Date.now()); start.setDate(start.getDate() - 6); start.setHours(0, 0, 0, 0); }
    else if (range === "month") { start.setTime(Date.now()); start.setDate(1); start.setHours(0, 0, 0, 0); }
    else if (range === "custom") {
      return {
        from: startDate ? new Date(startDate) : new Date(0),
        to: endDate ? new Date(endDate + "T23:59:59") : end,
      };
    }
    return { from: start, to: end };
  }, [range, startDate, endDate]);

  const filtered = useMemo(() => {
    return (cashbox.data ?? [])
      .filter(e => {
        const dt = new Date(e.created_at);
        if (dt < from || dt > to) return false;
        if (filterKind !== "all" && e.kind !== filterKind) return false;
        return true;
      })
      .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  }, [cashbox.data, from, to, filterKind]);

  const periodIn = filtered.filter(e => e.kind === "deposit" || e.kind === "sale").reduce((a, e) => a + Number(e.amount), 0);
  const periodOut = filtered.filter(e => e.kind === "withdraw" || e.kind === "expense").reduce((a, e) => a + Number(e.amount), 0);
  const periodNet = periodIn - periodOut;

  const { items: paged, totalPages, safePage } = paginate(filtered, page, pageSize);

  useEffect(() => { setPage(1); }, [range, startDate, endDate, filterKind]);

  function exportCSV() {
    const rows = [["Date", "Time", "Type", "Note", "Amount", "Direction"]];
    filtered.forEach(e => {
      const d = new Date(e.created_at);
      rows.push([
        d.toLocaleDateString(),
        d.toLocaleTimeString(),
        e.kind,
        e.note ?? "",
        String(e.amount),
        cashboxDelta(e.kind, e.amount) >= 0 ? "in" : "out",
      ]);
    });
    rows.push([]);
    rows.push(["Summary", "", "", "Balance", String(balance), ""]);
    rows.push(["Period In", "", "", "", String(periodIn), ""]);
    rows.push(["Period Out", "", "", "", String(periodOut), ""]);
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `cashbox-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  const rangeLabel =
    range === "today" ? t("today") :
    range === "week" ? t("this_week") :
    range === "month" ? t("this_month") :
    range === "all" ? t("all") : t("custom");

  return (
    <div className="space-y-4 pb-4">
      <Link href="/cash-management">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="size-4 mr-1" />{t("cash_management")}
        </Button>
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">{t("cashbox")}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{t("cashbox_ledger")}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => { setDialogKind("deposit"); setDialogOpen(true); }}>
            <Plus className="size-3.5 mr-1" />{t("add_money")}
          </Button>
          <Button size="sm" variant="outline" onClick={() => { setDialogKind("withdraw"); setDialogOpen(true); }}>
            <Minus className="size-3.5 mr-1" />{t("take_money")}
          </Button>
        </div>
      </div>

      <Card className="p-4 glass-card border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-xl bg-indigo-500 grid place-items-center shrink-0">
            <Banknote className="size-5 text-white" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">{t("balance")}</div>
            <div className="text-2xl sm:text-3xl font-bold text-indigo-600">{fmtMoney(balance)}</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Card className="p-3 sm:p-4 text-center">
          <TrendingUp className="size-4 text-emerald-600 mx-auto mb-1" />
          <div className="text-[10px] text-muted-foreground">{t("money_in")}</div>
          <div className="text-sm sm:text-base font-bold text-emerald-600">{fmtMoney(periodIn)}</div>
          <div className="text-[9px] text-muted-foreground mt-0.5">{rangeLabel}</div>
        </Card>
        <Card className="p-3 sm:p-4 text-center">
          <TrendingDown className="size-4 text-rose-600 mx-auto mb-1" />
          <div className="text-[10px] text-muted-foreground">{t("money_out")}</div>
          <div className="text-sm sm:text-base font-bold text-rose-600">{fmtMoney(periodOut)}</div>
          <div className="text-[9px] text-muted-foreground mt-0.5">{rangeLabel}</div>
        </Card>
        <Card className="p-3 sm:p-4 text-center">
          <div className="text-[10px] text-muted-foreground mt-5 sm:mt-0">{t("net_change")}</div>
          <div className={`text-sm sm:text-base font-bold mt-1 ${periodNet >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {periodNet >= 0 ? "+" : "−"}{fmtMoney(Math.abs(periodNet))}
          </div>
          <div className="text-[9px] text-muted-foreground mt-0.5">{rangeLabel}</div>
        </Card>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <RangePill label={t("today")} active={range === "today"} onClick={() => setRange("today")} />
          <RangePill label={t("this_week")} active={range === "week"} onClick={() => setRange("week")} />
          <RangePill label={t("this_month")} active={range === "month"} onClick={() => setRange("month")} />
          <RangePill label={t("all")} active={range === "all"} onClick={() => setRange("all")} />
          <RangePill label={t("custom")} active={range === "custom"} onClick={() => setRange("custom")} />
        </div>
        {range === "custom" && (
          <div className="flex items-center gap-2">
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="flex-1 h-8 text-xs" />
            <span className="text-muted-foreground text-xs">—</span>
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="flex-1 h-8 text-xs" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(["all", "sale", "expense", "deposit", "withdraw"] as FilterKind[]).map(k => (
          <button
            key={k}
            type="button"
            onClick={() => setFilterKind(k)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
              filterKind === k ? "bg-primary/15 border-primary text-primary" : "border-border text-muted-foreground"
            }`}
          >
            {k === "all" ? t("all") : kindLabel(t, k)}
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={exportCSV} disabled={filtered.length === 0}>
          <Download className="size-4 mr-1" />{t("export_csv")}
        </Button>
      </div>

      <Card className="divide-y divide-border overflow-hidden">
        {paged.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">{t("no_activity")}</div>
        )}
        {paged.map(e => {
          const delta = cashboxDelta(e.kind, e.amount);
          return (
            <div key={e.id} className="p-3 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm truncate">{e.note || kindLabel(t, e.kind)}</div>
                <div className="text-xs text-muted-foreground">{fmtDateTime(e.created_at)}</div>
                <span className={`inline-flex mt-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  e.kind === "sale" || e.kind === "deposit"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                    : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                }`}>
                  {kindLabel(t, e.kind)}
                </span>
              </div>
              <div className={`text-sm font-bold shrink-0 ${delta >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {delta >= 0 ? "+" : "−"}{fmtMoney(Math.abs(delta))}
              </div>
            </div>
          );
        })}
      </Card>

      <PaginationBar page={safePage} totalPages={totalPages} total={filtered.length} pageSize={pageSize} onPageChange={setPage} />

      <CashboxDialog open={dialogOpen} onOpenChange={setDialogOpen} initialKind={dialogKind} />
    </div>
  );
}

function CashboxDialog({
  open, onOpenChange, initialKind,
}: { open: boolean; onOpenChange: (v: boolean) => void; initialKind: "deposit" | "withdraw" }) {
  const { t } = useT();
  const qc = useQueryClient();
  const [kind, setKind] = useState<"deposit" | "withdraw">(initialKind);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setKind(initialKind);
      setAmount("");
      setNote("");
    }
  }, [open, initialKind]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const amt = Number(amount) || 0;
    if (amt <= 0) return;
    const tempId = `temp-${Date.now()}`;
    const entry: CashboxEntry = { id: tempId, kind, amount: amt, note: note || null, created_at: new Date().toISOString() };

    setCachedData<CashboxEntry[]>(qc, ["cashbox"], old => [entry, ...(old ?? [])]);
    onOpenChange(false);
    toast.success(t("save"));

    setBusy(true);
    try {
      const saved = await createCashboxFn({ data: { kind, amount: amt, note: note || null } });
      setCachedData<CashboxEntry[]>(qc, ["cashbox"], old =>
        (old ?? []).map(item => (item.id === tempId ? { ...saved, id: saved.id } as CashboxEntry : item)),
      );
      await refreshQueries(qc, ["cashbox"]);
    } catch (err: unknown) {
      setCachedData<CashboxEntry[]>(qc, ["cashbox"], old => (old ?? []).filter(item => item.id !== tempId));
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{t("cashbox")}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <Tabs value={kind} onValueChange={v => setKind(v as "deposit" | "withdraw")}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="deposit">{t("add_money")}</TabsTrigger>
              <TabsTrigger value="withdraw">{t("take_money")}</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">{t("amount")}</Label>
            <Input required inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">{t("note")}</Label>
            <Input value={note} onChange={e => setNote(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
            <Button type="submit" disabled={busy}>{busy ? "…" : t("save")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}