import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useCachedQuery } from "@/hooks/use-cached-query";
import { PaginationBar, paginate } from "@/components/ui/pagination-bar";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getProducts, type Product } from "@/lib/queries";
import { useT } from "@/lib/i18n";
import { fmtMoney } from "@/lib/format";
import { ProductImage } from "@/components/product-image";
import { ProductDialog } from "@/components/product-dialog";
import { SaleDialog } from "@/components/sale-dialog";
import { PurchaseDialog } from "@/components/purchase-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { deleteProductFn } from "@/lib/rpc";

export const Route = createFileRoute("/_authenticated/products")({
  component: ProductsPage,
});

function ProductsPage() {
  const { t } = useT();
  const qc = useQueryClient();
  const isMobile = useIsMobile();
  const { data: productsData } = useCachedQuery(["products"], getProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [saleProduct, setSaleProduct] = useState<string | undefined>();
  const [saleOpen, setSaleOpen] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = isMobile ? 12 : 24;

  const allProducts = productsData ?? [];
  const filteredProducts = allProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );
  const { items: productsToShow, totalPages, safePage } = paginate(filteredProducts, page, pageSize);

  async function remove(p: Product) {
    if (!confirm(`${t("delete")}: ${p.name}?`)) return;
    try {
      await deleteProductFn({ data: { id: p.id } });
      toast.success(t("delete"));
      qc.invalidateQueries({ queryKey: ["products"] });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-bold">{t("products")}</h1>
        <div className="flex gap-1.5">
          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setBuyOpen(true)}>{t("buy")}</Button>
          <Button size="sm" className="h-8 text-xs" onClick={() => { setSaleProduct(undefined); setSaleOpen(true); }}>{t("sell")}</Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <Input className="pl-8 h-9 text-sm" placeholder={t("search_products")} value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
      </div>

      {!productsData && <p className="text-xs text-muted-foreground">{t("loading")}</p>}
      {productsData && productsData.length === 0 && (
        <Card className="p-6 text-center text-xs text-muted-foreground">{t("no_products")}</Card>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {productsToShow.map(p => (
          <Card key={p.id} className="overflow-hidden border-border/60">
            <ProductImage path={p.image_url} className="w-full aspect-square object-cover" />
            <div className="p-1.5 space-y-0.5">
              <div className="font-medium text-[10px] sm:text-xs truncate leading-tight">{p.name}</div>
              <div className="flex justify-between text-[9px] sm:text-[10px]">
                <span className="text-muted-foreground">{t("sell_price")}</span>
                <span className="font-semibold">{p.sell_price > 0 ? fmtMoney(p.sell_price) : "—"}</span>
              </div>
              <div className="flex justify-between text-[9px] sm:text-[10px]">
                <span className="text-muted-foreground">{t("stock")}</span>
                <span className={p.stock <= 0 ? "text-destructive font-semibold" : ""}>{p.stock}</span>
              </div>
              <div className="grid grid-cols-2 gap-0.5 pt-1">
                <Button size="sm" className="h-6 text-[9px] px-1" onClick={() => { setSaleProduct(p.id); setSaleOpen(true); }}>{t("sell")}</Button>
                <Button size="sm" variant="ghost" className="h-6 text-[9px] px-0" onClick={() => { setEditing(p); setOpen(true); }}><Pencil className="size-2.5" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <PaginationBar page={safePage} totalPages={totalPages} total={filteredProducts.length} pageSize={pageSize} onPageChange={setPage} />

      <FAB onClick={() => { setEditing(null); setOpen(true); }} />
      <ProductDialog open={open} onOpenChange={setOpen} product={editing} />
      <SaleDialog open={saleOpen} onOpenChange={setSaleOpen} presetProductId={saleProduct} />
      <PurchaseDialog open={buyOpen} onOpenChange={setBuyOpen} />
    </div>
  );
}

export function FAB({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="fixed mobile-fab-bottom right-3 z-20 size-12 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-lg shadow-primary/25 active:scale-95 transition">
      <Plus className="size-5" />
    </button>
  );
}
