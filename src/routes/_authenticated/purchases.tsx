import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getProducts, getPurchases } from "@/lib/queries";
import { useAuth } from "@/hooks/use-auth";
import { useT } from "@/lib/i18n";
import { fmtMoney, fmtDateTime } from "@/lib/format";
import { FAB } from "./products";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/purchases")({
  component: PurchasesPage,
});

function PurchasesPage() {
  const { t } = useT();
  const { data } = useQuery({ queryKey: ["purchases"], queryFn: getPurchases });
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("new_purchase")}</h1>
      {(!data || data.length === 0) && <Card className="p-8 text-center text-sm text-muted-foreground">{t("no_activity")}</Card>}
      <Card className="divide-y divide-border overflow-hidden">
        {data?.map(p => (
          <div key={p.id} className="p-3 flex items-center justify-between">
            <div className="min-w-0">
              <div className="font-medium truncate">{p.product_name} ×{p.qty}</div>
              <div className="text-xs text-muted-foreground">{fmtDateTime(p.created_at)}</div>
            </div>
            <div className="font-semibold">{fmtMoney(p.total)}</div>
          </div>
        ))}
      </Card>
      <FAB onClick={() => setOpen(true)} />
      <PurchaseDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

function PurchaseDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v:boolean)=>void }) {
  const { t } = useT();
  const { user } = useAuth();
  const qc = useQueryClient();
  const products = useQuery({ queryKey: ["products"], queryFn: getProducts });
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState("1");
  const [cost, setCost] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!open) { setProductId(""); setQty("1"); setCost(""); }}, [open]);

  const product = products.data?.find(p => p.id === productId);
  const total = (Number(qty)||0) * (Number(cost)||0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !product) return;
    setBusy(true);
    try {
      const { error } = await supabase.from("purchases").insert({
        owner_id: user.id, product_id: product.id, product_name: product.name,
        qty: Number(qty)||0, unit_cost: Number(cost)||0, total,
      });
      if (error) throw error;
      await supabase.from("products").update({
        stock: (product.stock ?? 0) + (Number(qty)||0),
        buy_price: Number(cost) || product.buy_price,
      }).eq("id", product.id);
      toast.success(t("save"));
      qc.invalidateQueries({ queryKey: ["purchases"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      onOpenChange(false);
    } catch (err: any) { toast.error(err.message); }
    finally { setBusy(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{t("new_purchase")}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">{t("select_product")}</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>{products.data?.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs text-muted-foreground">{t("qty")}</Label><Input inputMode="numeric" value={qty} onChange={e=>setQty(e.target.value)} /></div>
            <div className="space-y-1"><Label className="text-xs text-muted-foreground">{t("unit_cost")}</Label><Input inputMode="decimal" value={cost} onChange={e=>setCost(e.target.value)} /></div>
          </div>
          <div className="flex items-center justify-between text-sm border-t border-border pt-3">
            <span className="text-muted-foreground">{t("total")}</span><span className="font-semibold">{fmtMoney(total)}</span>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
            <Button type="submit" disabled={busy || !product}>{busy?"…":t("save")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}