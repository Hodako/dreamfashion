import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getExpenses } from "@/lib/queries";
import { useAuth } from "@/hooks/use-auth";
import { useT } from "@/lib/i18n";
import { fmtMoney, fmtDateTime } from "@/lib/format";
import { FAB } from "./products";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/expenses")({
  component: ExpensesPage,
});

function ExpensesPage() {
  const { t } = useT();
  const { data } = useQuery({ queryKey: ["expenses"], queryFn: getExpenses });
  const [open, setOpen] = useState(false);
  const total = (data ?? []).reduce((a,e)=>a+Number(e.amount),0);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("expenses")}</h1>
      <Card className="p-4 bg-gradient-to-br from-muted to-secondary">
        <div className="text-xs font-medium text-muted-foreground">{t("total")}</div>
        <div className="text-2xl font-bold mt-1">{fmtMoney(total)}</div>
      </Card>
      {(!data || data.length===0) && <Card className="p-8 text-center text-sm text-muted-foreground">{t("no_activity")}</Card>}
      <Card className="divide-y divide-border overflow-hidden">
        {data?.map(e => (
          <div key={e.id} className="p-3 flex items-center justify-between">
            <div><div className="font-medium">{e.title}</div><div className="text-xs text-muted-foreground">{fmtDateTime(e.created_at)}{e.note?` · ${e.note}`:""}</div></div>
            <div className="font-semibold text-destructive">−{fmtMoney(e.amount)}</div>
          </div>
        ))}
      </Card>
      <FAB onClick={() => setOpen(true)} />
      <ExpenseDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

function ExpenseDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v:boolean)=>void }) {
  const { t } = useT();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("expenses").insert({ owner_id: user.id, title, amount: Number(amount)||0, note: note||null });
    setBusy(false);
    if (error) return toast.error(error.message);
    setTitle(""); setAmount(""); setNote("");
    qc.invalidateQueries({ queryKey: ["expenses"] });
    onOpenChange(false);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{t("add_expense")}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1"><Label className="text-xs text-muted-foreground">{t("title")}</Label><Input required value={title} onChange={e=>setTitle(e.target.value)} /></div>
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