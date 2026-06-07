import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronRight, UserPlus } from "lucide-react";
import { getParties, getSales, getPaymentsForParty } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useT } from "@/lib/i18n";
import { fmtMoney } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { FAB } from "./products";

export const Route = createFileRoute("/_authenticated/parties")({
  component: PartiesPage,
});

function PartiesPage() {
  const { t } = useT();
  const parties = useQuery({ queryKey: ["parties"], queryFn: getParties });
  const sales = useQuery({ queryKey: ["sales"], queryFn: getSales });
  const [open, setOpen] = useState(false);

  // Compute outstanding per party = sum(due_amount) on their credit sales − sum(payments).
  // (We'll just show sum of due_amount for now and subtract payments via a query per visible party.)
  const duesByParty: Record<string, number> = {};
  (sales.data ?? []).forEach(s => {
    if (s.party_id) duesByParty[s.party_id] = (duesByParty[s.party_id] ?? 0) + Number(s.due_amount);
  });

  const totalOwed = Object.values(duesByParty).reduce((a,b)=>a+b,0);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("party_collection")}</h1>

      <Card className="p-4 bg-gradient-to-br from-warning/15 to-warning/5 border-border/60">
        <div className="text-xs font-medium text-muted-foreground">{t("total_owed")}</div>
        <div className="text-2xl font-bold mt-1">{fmtMoney(totalOwed)}</div>
      </Card>

      {parties.data && parties.data.length === 0 && (
        <Card className="p-8 text-center text-sm text-muted-foreground">{t("no_parties")}</Card>
      )}

      <div className="space-y-2">
        {parties.data?.map(p => (
          <Link key={p.id} to="/parties/$id" params={{ id: p.id }}>
            <Card className="p-3 flex items-center justify-between hover:border-primary transition cursor-pointer">
              <div className="min-w-0">
                <div className="font-semibold truncate">{p.name}</div>
                {p.phone && <div className="text-xs text-muted-foreground">{p.phone}</div>}
              </div>
              <div className="flex items-center gap-2">
                <PartyOutstanding partyId={p.id} totalDues={duesByParty[p.id] ?? 0} />
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <FAB onClick={() => setOpen(true)} />
      <AddPartyDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

function PartyOutstanding({ partyId, totalDues }: { partyId: string; totalDues: number }) {
  const { data } = useQuery({ queryKey: ["payments", partyId], queryFn: () => getPaymentsForParty(partyId) });
  const paid = (data ?? []).reduce((a,p)=>a + Number(p.amount), 0);
  const out = Math.max(totalDues - paid, 0);
  return <span className={`text-sm font-semibold ${out>0?"text-warning":"text-success"}`}>{fmtMoney(out)}</span>;
}

function AddPartyDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v:boolean)=>void }) {
  const { t } = useT();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("parties").insert({ owner_id: user.id, name, phone: phone || null });
    setBusy(false);
    if (error) return toast.error(error.message);
    setName(""); setPhone("");
    qc.invalidateQueries({ queryKey: ["parties"] });
    toast.success(t("save"));
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><UserPlus className="size-5" />{t("add_party")}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1"><Label className="text-xs text-muted-foreground">{t("party_name")}</Label><Input required value={name} onChange={e=>setName(e.target.value)} /></div>
          <div className="space-y-1"><Label className="text-xs text-muted-foreground">{t("phone")}</Label><Input value={phone} onChange={e=>setPhone(e.target.value)} /></div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
            <Button type="submit" disabled={busy}>{busy?"…":t("save")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}