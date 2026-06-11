"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useT } from "@/lib/i18n";
import { toast } from "sonner";
import type { Product } from "@/lib/queries";
import { ImagePlus } from "lucide-react";
import { createProductFn, updateProductFn, uploadImageFn } from "@/lib/rpc";

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
  const [stock, setStock] = useState("0");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setName(product?.name ?? "");
      setBuy(String(product?.buy_price ?? ""));
      setStock(String(product?.stock ?? "0"));
      setFile(null);
    }
  }, [open, product]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      let image_url = product?.image_url ?? null;
      if (file) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        const upData = await uploadImageFn({ data: { base64, fileName: file.name } });
        image_url = upData.url;
      }

      const payload = {
        name,
        image_url,
        buy_price: Number(buy) || 0,
        sell_price: product?.sell_price ?? 0,
        stock: Number(stock) || 0,
      };

      if (product) {
        await updateProductFn({ data: { id: product.id, ...payload } });
      } else {
        await createProductFn({ data: { ...payload, sell_price: 0 } });
      }

      toast.success(t("save"));
      qc.invalidateQueries({ queryKey: ["products"] });
      onOpenChange(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally { setBusy(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{product ? t("edit") : t("add_product")}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <label className="flex items-center justify-center gap-2 border border-dashed border-border rounded-xl py-5 cursor-pointer hover:bg-secondary/50 transition">
            <ImagePlus className="size-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{file ? file.name : t("upload_image")}</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
          <Field label={t("product_name")}><Input required placeholder={t("product_name")} value={name} onChange={e => setName(e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("buy_price")}><Input inputMode="decimal" placeholder={t("buy_price")} value={buy} onChange={e => setBuy(e.target.value)} /></Field>
            <Field label={t("stock")}><Input inputMode="numeric" placeholder={t("stock")} value={stock} onChange={e => setStock(e.target.value)} /></Field>
          </div>
          {!product && (
            <p className="text-xs text-muted-foreground">{t("sell_price_on_purchase")}</p>
          )}
          {product && product.sell_price > 0 && (
            <p className="text-xs text-muted-foreground">{t("sell_price")}: ৳{product.sell_price}</p>
          )}
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
            <Button type="submit" disabled={busy}>{busy ? "…" : t("save")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1"><Label className="text-xs text-muted-foreground">{label}</Label>{children}</div>;
}
