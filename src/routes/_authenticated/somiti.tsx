import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getSomiti } from "@/lib/queries";
import { useT } from "@/lib/i18n";
import { fmtMoney, fmtDateTime } from "@/lib/format";
import { FAB } from "./products";
import { toast } from "sonner";
import { createSomitiFn } from "@/lib/rpc";

export const Route = createFileRoute("/_authenticated/somiti")({
  component: SomitiPage,
});

function SomitiPage() {
  const { t } = useT();
  const { data } = useQuery({ queryKey: ["somiti"], queryFn: getSomiti });
  const [open, setOpen] = useState(false);

  const balance = (data ?? []).reduce((a,e)=>a + (e.kind==="deposit"?1:-1)*Number(e.amount), 0);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("somiti")}</h1>
      <Card className="p-4 bg-gradient-to-br from-primary/10 to-success/10">
        <div className="text-xs font-medium text-muted-foreground">{t("balance")}</div>
        <div className="text-2xl font-bold mt-1">{fmtMoney(balance)}</div>
      </Card>
      {(!data || data.length===0) && <Card className="p-8 text-center text-sm text-muted-foreground">{t("no_activity")}</Card>}
      <Card className="divide-y divide-border overflow-hidden">
        {data?.map(e => (
          <div key={e.id} className="p-3 flex items-center justify-between">
            <div><div className="font-medium">{e.kind==="deposit"?t("deposit"):t("withdraw")}{e.note?` — ${e.note}`:""}</div><div className="text-xs text-muted-foreground">{fmtDateTime(e.created_at)}</div></div>
            <div className={`font-semibold ${e.kind==="deposit"?"text-success":"text-destructive"}`}>{e.kind==="deposit"?"+":"-"}{fmtMoney(e.amount)}</div>
          </div>
        ))}
      </Card>
      <FAB onClick={() => setOpen(true)} />
      <SomitiDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

function SomitiDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v:boolean)=>void }) {
  const { t } = useT();
  const qc = useQueryClient();
  const [kind, setKind] = useState<"deposit"|"withdraw">("deposit");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await createSomitiFn({ data: { kind, amount: Number(amount)||0, note: note||null } });
      setAmount(""); setNote("");
      qc.invalidateQueries({ queryKey: ["somiti"] });
      onOpenChange(false);
    } catch (err: any) { toast.error(err.message || "Failed to save"); }
    finally { setBusy(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{t("add_somiti")}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <Tabs value={kind} onValueChange={(v)=>setKind(v as any)}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="deposit">{t("deposit")}</TabsTrigger>
              <TabsTrigger value="withdraw">{t("withdraw")}</TabsTrigger>
            </TabsList>
          </Tabs>
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