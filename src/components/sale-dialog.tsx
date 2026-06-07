import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useT } from "@/lib/i18n";
import { toast } from "sonner";
import { getParties, getProducts, type Product } from "@/lib/queries";
import { fmtMoney } from "@/lib/format";

export function SaleDialog({
  open, onOpenChange, presetType, presetProductId,
}: {
  open: boolean; onOpenChange: (v: boolean) => void;
  presetType?: "cash" | "credit"; presetProductId?: string;
}) {
  const { t } = useT();
  const { user } = useAuth();
  const qc = useQueryClient();
  const products = useQuery({ queryKey: ["products"], queryFn: getProducts });
  const parties = useQuery({ queryKey: ["parties"], queryFn: getParties });

  const [type, setType] = useState<"cash" | "credit">(presetType ?? "cash");
  const [productId, setProductId] = useState<string>("");
  const [qty, setQty] = useState("1");
  const [partyId, setPartyId] = useState<string>("");
  const [paid, setPaid] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setType(presetType ?? "cash");
      setProductId(presetProductId ?? "");
      setQty("1"); setPartyId(""); setPaid("");
    }
  }, [open, presetType, presetProductId]);

  const product: Product | undefined = products.data?.find(p => p.id === productId);
  const qtyNum = Number(qty) || 0;
  const sellTotal = (product?.sell_price ?? 0) * qtyNum;
  const buyTotal = (product?.buy_price ?? 0) * qtyNum;
  const profit = sellTotal - buyTotal;
  const paidNum = type === "cash" ? sellTotal : Number(paid) || 0;
  const due = Math.max(sellTotal - paidNum, 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !product) return;
    if (type === "credit" && !partyId) return toast.error(t("party") + " " + t("required"));
    setBusy(true);
    try {
      const { error } = await supabase.from("sales").insert({
        owner_id: user.id, product_id: product.id, product_name: product.name,
        qty: qtyNum, buy_price: product.buy_price, sell_price: product.sell_price,
        profit, type, party_id: type === "credit" ? partyId : null,
        paid_amount: paidNum, due_amount: due,
      });
      if (error) throw error;
      // Decrement stock
      await supabase.from("products").update({ stock: Math.max((product.stock ?? 0) - qtyNum, 0) }).eq("id", product.id);
      toast.success(t("record_sale"));
      qc.invalidateQueries({ queryKey: ["sales"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["party-detail"] });
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message ?? String(err));
    } finally { setBusy(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{t("new_sale")}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <Tabs value={type} onValueChange={(v)=>setType(v as any)}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="cash">{t("cash_sale")}</TabsTrigger>
              <TabsTrigger value="credit">{t("credit_sale")}</TabsTrigger>
            </TabsList>
          </Tabs>
          <Field label={t("select_product")}>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>
                {products.data?.map(p => <SelectItem key={p.id} value={p.id}>{p.name} · {fmtMoney(p.sell_price)}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("qty")}><Input inputMode="numeric" value={qty} onChange={e=>setQty(e.target.value)} /></Field>
            <Field label={t("profit")}><div className="h-9 px-3 grid items-center rounded-md bg-success/10 text-success font-semibold">{fmtMoney(profit)}</div></Field>
          </div>
          {type === "credit" && (
            <>
              <Field label={t("party")}>
                <Select value={partyId} onValueChange={setPartyId}>
                  <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                  <SelectContent>
                    {parties.data?.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label={t("paid_amount")}><Input inputMode="decimal" value={paid} onChange={e=>setPaid(e.target.value)} /></Field>
                <Field label={t("due_amount")}><div className="h-9 px-3 grid items-center rounded-md bg-warning/10 text-foreground font-semibold">{fmtMoney(due)}</div></Field>
              </div>
            </>
          )}
          <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border pt-3">
            <span>{t("total")}</span><span className="font-semibold text-foreground">{fmtMoney(sellTotal)}</span>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
            <Button type="submit" disabled={busy || !product}>{busy?"…":t("record_sale")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1"><Label className="text-xs text-muted-foreground">{label}</Label>{children}</div>;
}