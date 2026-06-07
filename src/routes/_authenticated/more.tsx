import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Receipt, PiggyBank, ShoppingCart, HandCoins, ChevronRight, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { getWithdrawals } from "@/lib/queries";
import { fmtMoney, fmtDateTime } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/more")({
  component: MorePage,
});

function MorePage() {
  const { t } = useT();
  const links = [
    { to: "/purchases", icon: ShoppingCart, label: t("new_purchase") },
    { to: "/expenses", icon: Receipt, label: t("expenses") },
    { to: "/somiti", icon: PiggyBank, label: t("somiti") },
  ] as const;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("more")}</h1>
      <Card className="divide-y divide-border overflow-hidden">
        {links.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className="p-4 flex items-center justify-between hover:bg-secondary/50">
            <div className="flex items-center gap-3"><div className="size-9 rounded-lg bg-primary/10 text-primary grid place-items-center"><Icon className="size-4" /></div><span className="font-medium">{label}</span></div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </Link>
        ))}
      </Card>
      <WithdrawSection />
    </div>
  );
}

function WithdrawSection() {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const { data } = useQuery({ queryKey: ["withdrawals"], queryFn: getWithdrawals });
  const total = (data ?? []).reduce((a,w)=>a+Number(w.amount),0);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mt-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t("owner_withdraw")}</h2>
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}><HandCoins className="size-4 mr-1" />{t("add")}</Button>
      </div>
      <Card className="p-4 bg-gradient-to-br from-accent/30 to-secondary">
        <div className="text-xs font-medium text-muted-foreground">{t("total")}</div>
        <div className="text-xl font-bold mt-1">{fmtMoney(total)}</div>
      </Card>
      <Card className="divide-y divide-border overflow-hidden">
        {(data ?? []).slice(0, 8).map(w => (
          <div key={w.id} className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2"><Wallet className="size-4 text-muted-foreground" /><div><div className="font-medium text-sm">{w.note || t("owner_withdraw")}</div><div className="text-xs text-muted-foreground">{fmtDateTime(w.created_at)}</div></div></div>
            <div className="font-semibold">{fmtMoney(w.amount)}</div>
          </div>
        ))}
      </Card>
      <WithdrawDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

function WithdrawDialog({ open, onOpenChange }: { open:boolean; onOpenChange:(v:boolean)=>void }) {
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
    const { error } = await supabase.from("owner_withdrawals").insert({ owner_id: user.id, amount: Number(amount)||0, note: note||null });
    setBusy(false);
    if (error) return toast.error(error.message);
    setAmount(""); setNote("");
    qc.invalidateQueries({ queryKey: ["withdrawals"] });
    onOpenChange(false);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{t("owner_withdraw")}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1"><Label className="text-xs text-muted-foreground">{t("amount")}</Label><Input required inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value)} /></div>
          <div className="space-y-1"><Label className="text-xs text-muted-foreground">{t("note")}</Label><Input value={note} onChange={e=>setNote(e.target.value)} /></div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={()=>onOpenChange(false)}>{t("cancel")}</Button>
            <Button type="submit" disabled={busy}>{busy?"…":t("save")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}