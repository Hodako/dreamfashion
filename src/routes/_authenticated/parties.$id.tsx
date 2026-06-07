import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, ArrowDownToLine } from "lucide-react";
import { getPaymentsForParty, getSalesForParty, getParties } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useT } from "@/lib/i18n";
import { fmtMoney, fmtDateTime } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/parties/$id")({
  component: PartyDetail,
});

function PartyDetail() {
  const { id } = Route.useParams();
  const { t } = useT();
  const nav = useNavigate();
  const parties = useQuery({ queryKey: ["parties"], queryFn: getParties });
  const sales = useQuery({ queryKey: ["party-detail", "sales", id], queryFn: () => getSalesForParty(id) });
  const payments = useQuery({ queryKey: ["payments", id], queryFn: () => getPaymentsForParty(id) });
  const [open, setOpen] = useState(false);

  const party = parties.data?.find(p => p.id === id);
  const dueTotal = (sales.data ?? []).reduce((a,s)=>a + Number(s.due_amount), 0);
  const paidTotal = (payments.data ?? []).reduce((a,p)=>a + Number(p.amount), 0);
  const outstanding = Math.max(dueTotal - paidTotal, 0);

  type Entry = { id: string; date: string; label: string; amount: number; kind: "sale"|"payment" };
  const entries: Entry[] = [
    ...(sales.data ?? []).map(s => ({ id: "s"+s.id, date: s.created_at, label: `${s.product_name} ×${s.qty}`, amount: Number(s.due_amount), kind: "sale" as const })),
    ...(payments.data ?? []).map(p => ({ id: "p"+p.id, date: p.created_at, label: p.note || t("collect_payment"), amount: -Number(p.amount), kind: "payment" as const })),
  ].sort((a,b) => +new Date(b.date) - +new Date(a.date));

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={() => nav({ to: "/parties" })}><ArrowLeft className="size-4 mr-1" />{t("parties")}</Button>
      <div>
        <h1 className="text-2xl font-bold">{party?.name ?? "…"}</h1>
        {party?.phone && <p className="text-sm text-muted-foreground">{party.phone}</p>}
      </div>

      <Card className="p-4 bg-gradient-to-br from-warning/15 to-warning/5">
        <div className="text-xs font-medium text-muted-foreground">{t("outstanding")}</div>
        <div className="text-3xl font-bold mt-1">{fmtMoney(outstanding)}</div>
        <Button className="mt-3 w-full" onClick={() => setOpen(true)}>
          <ArrowDownToLine className="size-4 mr-1" />{t("collect_payment")}
        </Button>
      </Card>

      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t("history")}</h2>
        <Card className="divide-y divide-border overflow-hidden">
          {entries.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">{t("no_activity")}</div>}
          {entries.map(e => (
            <div key={e.id} className="p-3 flex items-center justify-between">
              <div className="min-w-0">
                <div className="font-medium truncate text-sm">{e.label}</div>
                <div className="text-xs text-muted-foreground">{fmtDateTime(e.date)}</div>
              </div>
              <div className={`text-sm font-semibold ${e.amount<0?"text-success":"text-warning"}`}>
                {e.amount<0 ? "−" : "+"}{fmtMoney(Math.abs(e.amount))}
              </div>
            </div>
          ))}
        </Card>
      </div>

      <CollectDialog partyId={id} open={open} onOpenChange={setOpen} />
    </div>
  );
}

function CollectDialog({ partyId, open, onOpenChange }: { partyId: string; open: boolean; onOpenChange: (v: boolean) => void }) {
  const { t } = useT();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("payments").insert({
      owner_id: user.id, party_id: partyId, amount: Number(amount) || 0, note: note || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setAmount(""); setNote("");
    qc.invalidateQueries({ queryKey: ["payments", partyId] });
    qc.invalidateQueries({ queryKey: ["payments"] });
    toast.success(t("save"));
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{t("collect_payment")}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1"><Label className="text-xs text-muted-foreground">{t("amount")}</Label><Input required inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value)} /></div>
          <div className="space-y-1"><Label className="text-xs text-muted-foreground">{t("note")}</Label><Input value={note} onChange={e=>setNote(e.target.value)} /></div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
            <Button type="submit" disabled={busy}>{busy?"…":t("save")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}