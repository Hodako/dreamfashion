import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useT } from "@/lib/i18n";
import { toast } from "sonner";
import type { Product } from "@/lib/queries";
import { ImagePlus } from "lucide-react";

export function ProductDialog({
  open, onOpenChange, product,
}: {
  open: boolean; onOpenChange: (v: boolean) => void; product?: Product | null;
}) {
  const { t } = useT();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [buy, setBuy] = useState("");
  const [sell, setSell] = useState("");
  const [stock, setStock] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setName(product?.name ?? "");
      setBuy(String(product?.buy_price ?? ""));
      setSell(String(product?.sell_price ?? ""));
      setStock(String(product?.stock ?? ""));
      setFile(null);
    }
  }, [open, product]);

  const profit = (Number(sell) || 0) - (Number(buy) || 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      let image_url = product?.image_url ?? null;
      if (file) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("product-images").upload(path, file, { upsert: false });
        if (upErr) throw upErr;
        image_url = path;
      }
      const payload = {
        owner_id: user.id, name, image_url,
        buy_price: Number(buy) || 0, sell_price: Number(sell) || 0, stock: Number(stock) || 0,
      };
      const res = product
        ? await supabase.from("products").update(payload).eq("id", product.id)
        : await supabase.from("products").insert(payload);
      if (res.error) throw res.error;
      toast.success(t("save"));
      qc.invalidateQueries({ queryKey: ["products"] });
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message ?? String(err));
    } finally { setBusy(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{product ? t("edit") : t("add_product")}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <label className="flex items-center justify-center gap-2 border border-dashed border-border rounded-xl py-6 cursor-pointer hover:bg-secondary/50 transition">
            <ImagePlus className="size-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{file ? file.name : t("upload_image")}</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
          <Field label={t("product_name")}><Input required value={name} onChange={e=>setName(e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("buy_price")}><Input inputMode="decimal" value={buy} onChange={e=>setBuy(e.target.value)} /></Field>
            <Field label={t("sell_price")}><Input inputMode="decimal" value={sell} onChange={e=>setSell(e.target.value)} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("stock")}><Input inputMode="numeric" value={stock} onChange={e=>setStock(e.target.value)} /></Field>
            <Field label={t("profit")}><div className="h-9 px-3 grid items-center rounded-md bg-success/10 text-success font-semibold">৳{profit}</div></Field>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
            <Button type="submit" disabled={busy}>{busy?"…":t("save")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1"><Label className="text-xs text-muted-foreground">{label}</Label>{children}</div>;
}