import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getProducts, type Product } from "@/lib/queries";
import { useT } from "@/lib/i18n";
import { fmtMoney } from "@/lib/format";
import { ProductImage } from "@/components/product-image";
import { ProductDialog } from "@/components/product-dialog";
import { SaleDialog } from "@/components/sale-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/products")({
  component: ProductsPage,
});

function ProductsPage() {
  const { t } = useT();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["products"], queryFn: getProducts });
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [saleProduct, setSaleProduct] = useState<string | undefined>(undefined);
  const [saleType, setSaleType] = useState<"cash"|"credit">("cash");
  const [saleOpen, setSaleOpen] = useState(false);

  async function remove(p: Product) {
    if (!confirm(`${t("delete")}: ${p.name}?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success(t("delete"));
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("products")}</h1>
        <span className="text-sm text-muted-foreground">{data?.length ?? 0}</span>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">{t("loading")}</p>}
      {data && data.length === 0 && (
        <Card className="p-8 text-center text-sm text-muted-foreground">{t("no_products")}</Card>
      )}

      <div className="grid grid-cols-2 gap-3">
        {data?.map(p => (
          <Card key={p.id} className="overflow-hidden border-border/70">
            <ProductImage path={p.image_url} className="w-full aspect-square" />
            <div className="p-3 space-y-1">
              <div className="font-semibold text-sm truncate">{p.name}</div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-muted-foreground">{t("sell_price")}</span>
                <span className="font-semibold text-foreground">{fmtMoney(p.sell_price)}</span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-muted-foreground">{t("profit")}</span>
                <span className="text-success font-semibold">{fmtMoney(Number(p.sell_price)-Number(p.buy_price))}</span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-muted-foreground">{t("stock")}</span>
                <span className={`font-semibold ${p.stock<=0?"text-destructive":""}`}>{p.stock}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-2">
                <Button size="sm" className="h-8 text-xs" onClick={() => { setSaleProduct(p.id); setSaleType("cash"); setSaleOpen(true); }}>
                  {t("sell")}
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => { setSaleProduct(p.id); setSaleType("credit"); setSaleOpen(true); }}>
                  {t("credit")}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { setEditing(p); setOpen(true); }}><Pencil className="size-3" /></Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => remove(p)}><Trash2 className="size-3" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <FAB onClick={() => { setEditing(null); setOpen(true); }} />
      <ProductDialog open={open} onOpenChange={setOpen} product={editing} />
      <SaleDialog open={saleOpen} onOpenChange={setSaleOpen} presetType={saleType} presetProductId={saleProduct} />
    </div>
  );
}

export function FAB({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="fixed bottom-20 right-4 z-20 size-14 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition">
      <Plus className="size-6" />
    </button>
  );
}