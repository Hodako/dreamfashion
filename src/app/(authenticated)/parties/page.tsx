"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronRight, UserPlus, Search, Users, Archive, Download } from "lucide-react";
import { getParties, getSales, getAllPayments, getAllPartyReceivables } from "@/lib/queries";
import { useCachedQuery } from "@/hooks/use-cached-query";
import { PaginationBar, paginate } from "@/components/ui/pagination-bar";
import { useT } from "@/lib/i18n";
import { fmtMoney } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { createPartyFn, archivePartyFn } from "@/lib/rpc";
import { setCachedData, refreshQueries } from "@/lib/optimistic-cache";
import type { Party } from "@/lib/queries";
import Link from "next/link";
import { downloadCsv, exportDateStamp } from "@/lib/export";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PartiesPage() {
  const { t } = useT();
  const parties = useCachedQuery(["parties"], getParties);
  const sales = useCachedQuery(["sales"], getSales);
  const allPayments = useCachedQuery(["all-payments"], getAllPayments);
  const allReceivables = useCachedQuery(["all-party-receivables"], getAllPartyReceivables);
  const qc = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
  const pageSize = 10;

  const duesByParty: Record<string, number> = {};
  (sales.data ?? []).forEach(s => {
    if (s.party_id) duesByParty[s.party_id] = (duesByParty[s.party_id] ?? 0) + Number(s.due_amount);
  });
  (allReceivables.data ?? []).forEach(r => {
    duesByParty[r.party_id] = (duesByParty[r.party_id] ?? 0) + Number(r.amount);
  });

  const paidByParty: Record<string, number> = {};
  (allPayments.data ?? []).forEach(p => {
    paidByParty[p.party_id] = (paidByParty[p.party_id] ?? 0) + Number(p.amount);
  });

  const extraByParty: Record<string, number> = {};
  (allReceivables.data ?? []).forEach(r => {
    extraByParty[r.party_id] = (extraByParty[r.party_id] ?? 0) + Number(r.amount);
  });

  const allPartyIds = new Set([...Object.keys(duesByParty), ...Object.keys(paidByParty)]);
  const totalOutstanding = [...allPartyIds].reduce((sum, pid) => {
    return sum + Math.max((duesByParty[pid] ?? 0) - (paidByParty[pid] ?? 0), 0);
  }, 0);

  const filtered = (parties.data ?? []).filter(p => {
    const matchesSearch = (p.name || "").toLowerCase().includes(search.toLowerCase()) || (p.phone ?? "").includes(search);
    const matchesTab = activeTab === "archived" ? p.archived === true : p.archived !== true;
    return matchesSearch && matchesTab;
  });

  const { items: pagedParties, totalPages, safePage } = paginate(filtered, page, pageSize);

  function partyOutstanding(partyId: string) {
    const raw = (duesByParty[partyId] ?? 0) + (extraByParty[partyId] ?? 0);
    return Math.max(raw - (paidByParty[partyId] ?? 0), 0);
  }

  function prefetchParty(p: Party) {
    setCachedData<Party>(qc, ["party", p.id], p);
  }

  async function toggleArchive(p: Party) {
    const nextVal = !p.archived;
    try {
      await archivePartyFn({ data: { id: p.id, archived: nextVal } });
      toast.success(nextVal ? t("archived") : t("active"));
      qc.invalidateQueries({ queryKey: ["parties"] });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : String(err));
    }
  }

  function exportParties() {
    const headers = ["ID", "Name", "Phone", "Outstanding Dues", "Archived"];
    const rows = filtered.map(p => [
      p.id,
      p.name,
      p.phone || "",
      partyOutstanding(p.id),
      p.archived ? "Yes" : "No"
    ]);
    downloadCsv(`parties_${activeTab}_${exportDateStamp()}.csv`, headers, rows);
    toast.success(t("download_csv"));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{t("party_collection")}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} {t("parties")}</p>
        </div>
        <div className="flex gap-1.5 items-center">
          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={exportParties}>
            <Download className="size-4 mr-1" />
            {t("download_csv")}
          </Button>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <UserPlus className="size-4 mr-1" />
            {t("add_party")}
          </Button>
        </div>
      </div>

      <Card className="p-3 border-primary/20">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-primary grid place-items-center shrink-0">
            <Users className="icon-sm text-primary-foreground" />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{t("total_owed")}</div>
            <div className="text-xl font-bold font-serif text-primary">{fmtMoney(totalOutstanding)}</div>
          </div>
        </div>
      </Card>

      <div className="sticky top-0 z-10 bg-background border-b pb-2 pt-3 px-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground z-10 pointer-events-none" />
          <Input
            className="pl-10"
            placeholder={t("search_parties")}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as any); setPage(1); }}>
        <TabsList className="grid grid-cols-2 w-full h-8 p-0.5 bg-muted/60">
          <TabsTrigger value="active" className="text-xs py-1">{t("active")}</TabsTrigger>
          <TabsTrigger value="archived" className="text-xs py-1">{t("archived")}</TabsTrigger>
        </TabsList>
      </Tabs>

      {parties.data && filtered.length === 0 && (
        <Card className="p-10 text-center">
          <Users className="size-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">{t("no_parties")}</p>
          <Button className="mt-4" onClick={() => setAddOpen(true)}>
            <UserPlus className="size-4 mr-1" /> {t("add_party")}
          </Button>
        </Card>
      )}

      <div className="space-y-1.5">
        {pagedParties.map(p => {
          const outstanding = partyOutstanding(p.id);
          return (
            <Link
              key={p.id}
              href={`/parties/${p.id}`}
              onMouseEnter={() => prefetchParty(p)}
              onTouchStart={() => prefetchParty(p)}
              className="block w-full text-left active:scale-[0.99] transition-transform"
            >
              <Card className={`overflow-hidden ${outstanding > 0 ? "border-primary/30" : "border-border"}`}>
                <div className="flex items-center p-3 gap-2.5">
                  <div className={`size-9 rounded-full grid place-items-center text-sm font-bold shrink-0 ${
                    outstanding > 0 ? "bg-primary/15 text-primary" : "bg-secondary text-secondary-foreground"
                  }`}>
                    {(p.name || "P").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm truncate">{p.name}</div>
                    {p.phone && <div className="text-[10px] text-muted-foreground">{p.phone}</div>}
                    <div className="text-[10px] text-primary mt-0.5">{t("view")} →</div>
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-2">
                    <div>
                      <div className={`text-sm font-bold ${outstanding > 0 ? "text-primary" : "text-success"}`}>
                        {fmtMoney(outstanding)}
                      </div>
                      <div className="text-[9px] text-muted-foreground">{outstanding > 0 ? t("outstanding") : t("clear")}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="size-7 p-0 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleArchive(p);
                      }}
                      title={p.archived ? t("restore") : t("archive")}
                    >
                      <Archive className="size-3.5" />
                    </Button>
                  </div>
                  <ChevronRight className="icon-sm text-muted-foreground shrink-0" />
                </div>
              </Card>
            </Link>
          );
        })}
        {filtered.length === 0 && search && (
          <p className="text-sm text-muted-foreground text-center py-6">{t("no_results")}</p>
        )}
      </div>

      <PaginationBar page={safePage} totalPages={totalPages} total={filtered.length} pageSize={pageSize} onPageChange={setPage} />

      <AddPartyDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}

function AddPartyDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { t } = useT();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    const phoneVal = phone.trim() || null;
    const tempId = `temp-${Date.now()}`;
    const optimistic: Party = { id: tempId, name: trimmedName, phone: phoneVal, created_at: new Date().toISOString() };

    setCachedData<Party[]>(qc, ["parties"], old => [...(old ?? []), optimistic].sort((a, b) => (a.name || "").localeCompare(b.name || "")));
    setName(""); setPhone("");
    onOpenChange(false);
    toast.success(`${trimmedName} — ${t("add_party")}`);

    setBusy(true);
    try {
      const saved = await createPartyFn({ data: { name: trimmedName, phone: phoneVal } });
      setCachedData<Party[]>(qc, ["parties"], old =>
        (old ?? []).map(p => (p.id === tempId ? { ...saved, id: saved.id } as Party : p)),
      );
      await refreshQueries(qc, ["parties"]);
    } catch (err: unknown) {
      setCachedData<Party[]>(qc, ["parties"], old => (old ?? []).filter(p => p.id !== tempId));
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="size-5" /> {t("add_party")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">{t("party_name")} *</Label>
            <Input required placeholder={t("party_name")} value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">{t("phone")}</Label>
            <Input inputMode="tel" placeholder={t("phone")} value={phone} onChange={e => setPhone(e.target.value)} />
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
