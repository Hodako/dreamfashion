"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCachedQuery } from "@/hooks/use-cached-query";
import { PaginationBar, paginate } from "@/components/ui/pagination-bar";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Plus, Pencil, Trash2, Search, Archive, Download, Eye, AlertCircle } from "lucide-react";
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
import { deleteProductFn, archiveProductFn } from "@/lib/rpc";
import { downloadCsv, exportDateStamp } from "@/lib/export";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProductsPage() {
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
  const [activeTab, setActiveTab] = useState<"active" | "archived" | "low_stock">("active");
  const pageSize = isMobile ? 12 : 24;

  const allProducts = productsData ?? [];

  // Valuations
  const totalCostValuation = allProducts.filter(p => !p.archived).reduce((sum, p) => sum + (p.buy_price * p.stock), 0);
  const totalSaleValuation = allProducts.filter(p => !p.archived).reduce((sum, p) => sum + (p.sell_price * p.stock), 0);
  const totalExpectedProfit = Math.max(totalSaleValuation - totalCostValuation, 0);

  // Filters
  const searchFiltered = allProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    Object.values(p.attributes || {}).some(val => val.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredProducts = searchFiltered.filter(p => {
    if (activeTab === "archived") return p.archived === true;
    if (activeTab === "low_stock") return p.archived !== true && p.stock <= (p.min_stock ?? 5);
    return p.archived !== true;
  });

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

  async function toggleArchive(p: Product) {
    const nextVal = !p.archived;
    try {
      await archiveProductFn({ data: { id: p.id, archived: nextVal } });
      toast.success(nextVal ? t("archived") : t("active"));
      qc.invalidateQueries({ queryKey: ["products"] });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : String(err));
    }
  }

  function exportProducts() {
    const headers = ["ID", "Name", "Buy Price", "Sell Price", "Stock", "Min Stock Alert", "Attributes", "Archived"];
    const rows = filteredProducts.map(p => [
      p.id,
      p.name,
      p.buy_price,
      p.sell_price,
      p.stock,
      p.min_stock ?? 5,
      JSON.stringify(p.attributes || {}),
      p.archived ? "Yes" : "No"
    ]);
    downloadCsv(`products_${activeTab}_${exportDateStamp()}.csv`, headers, rows);
    toast.success(t("download_csv"));
  }

  return (
    <div className="space-y-3">
      {/* Valuation & Top Header */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Card className="p-2 sm:p-3 bg-gradient-to-br from-indigo-50/50 to-indigo-100/50 dark:from-indigo-950/20 dark:to-indigo-900/10 border-indigo-200/30">
          <div className="text-[8px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">{t("stock_value")} ({t("buy")})</div>
          <div className="text-xs sm:text-base font-bold font-serif text-indigo-700 dark:text-indigo-400 mt-0.5">{fmtMoney(totalCostValuation)}</div>
        </Card>
        <Card className="p-2 sm:p-3 bg-gradient-to-br from-emerald-50/50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/10 border-emerald-200/30">
          <div className="text-[8px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">{t("stock_value")} ({t("sell")})</div>
          <div className="text-xs sm:text-base font-bold font-serif text-emerald-700 dark:text-emerald-400 mt-0.5">{fmtMoney(totalSaleValuation)}</div>
        </Card>
        <Card className="p-2 sm:p-3 bg-gradient-to-br from-amber-50/50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 border-amber-200/30">
          <div className="text-[8px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">{t("profit")} (Expected)</div>
          <div className="text-xs sm:text-base font-bold font-serif text-amber-700 dark:text-amber-400 mt-0.5">{fmtMoney(totalExpectedProfit)}</div>
        </Card>
      </div>

      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg sm:text-xl font-bold">{t("products")}</h1>
        <div className="flex gap-1.5 items-center">
          <Button size="sm" variant="outline" className="h-8 text-[10px] sm:text-xs" onClick={exportProducts}>
            <Download className="size-3.5 mr-1" />
            {isMobile ? "" : t("download_csv")}
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-[10px] sm:text-xs" onClick={() => setBuyOpen(true)}>{t("buy")}</Button>
          <Button size="sm" className="h-8 text-[10px] sm:text-xs" onClick={() => { setSaleProduct(undefined); setSaleOpen(true); }}>{t("sell")}</Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <Input className="pl-8 h-9 text-sm" placeholder={t("search_products")} value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
      </div>

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as any); setPage(1); }}>
        <TabsList className="grid grid-cols-3 w-full h-8 p-0.5 bg-muted/60">
          <TabsTrigger value="active" className="text-xs py-1">{t("active")}</TabsTrigger>
          <TabsTrigger value="low_stock" className="text-xs py-1 flex items-center gap-1">
            {t("critical_stock")}
            {allProducts.filter(p => !p.archived && p.stock <= (p.min_stock ?? 5)).length > 0 && (
              <span className="size-1.5 bg-destructive rounded-full" />
            )}
          </TabsTrigger>
          <TabsTrigger value="archived" className="text-xs py-1">{t("archived")}</TabsTrigger>
        </TabsList>
      </Tabs>

      {!productsData && <p className="text-xs text-muted-foreground">{t("loading")}</p>}
      {productsData && filteredProducts.length === 0 && (
        <Card className="p-6 text-center text-xs text-muted-foreground">{t("no_products")}</Card>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 pt-1">
        {productsToShow.map(p => {
          const isLowStock = p.stock <= (p.min_stock ?? 5);
          return (
            <Card key={p.id} className={`overflow-hidden border-border/60 flex flex-col justify-between ${p.archived ? "opacity-60" : ""}`}>
              <div>
                <div className="relative">
                  <ProductImage path={p.image_url} className="w-full aspect-square object-cover" />
                  {!p.archived && isLowStock && (
                    <div className="absolute top-1.5 right-1.5 bg-destructive text-destructive-foreground p-1 rounded-full shadow" title={t("critical_stock")}>
                      <AlertCircle className="size-3.5" />
                    </div>
                  )}
                </div>
                <div className="p-1.5 space-y-0.5">
                  <div className="font-medium text-[10px] sm:text-xs truncate leading-tight" title={p.name}>{p.name}</div>
                  
                  {/* Custom Attributes Badges */}
                  {p.attributes && Object.keys(p.attributes).length > 0 && (
                    <div className="flex flex-wrap gap-0.5 pt-0.5 pb-1">
                      {Object.entries(p.attributes).map(([key, val]) => (
                        <span key={key} className="bg-secondary/70 text-[8px] px-1 py-0.2 rounded text-secondary-foreground truncate max-w-[80px]" title={`${key}: ${val}`}>
                          {val}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between text-[9px] sm:text-[10px]">
                    <span className="text-muted-foreground">{t("sell_price")}</span>
                    <span className="font-semibold">{p.sell_price > 0 ? fmtMoney(p.sell_price) : "—"}</span>
                  </div>
                  <div className="flex justify-between text-[9px] sm:text-[10px]">
                    <span className="text-muted-foreground">{t("stock")}</span>
                    <span className={isLowStock ? "text-destructive font-semibold" : ""}>{p.stock}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-1.5 pt-0">
                {!p.archived ? (
                  <div className="grid grid-cols-3 gap-0.5">
                    <Button size="sm" className="h-6 text-[9px] px-1 col-span-1" onClick={() => { setSaleProduct(p.id); setSaleOpen(true); }}>{t("sell")}</Button>
                    <Button size="sm" variant="ghost" className="h-6 text-[9px] px-0" onClick={() => { setEditing(p); setOpen(true); }}><Pencil className="size-3" /></Button>
                    <Button size="sm" variant="ghost" className="h-6 text-[9px] px-0 text-muted-foreground hover:text-destructive" onClick={() => toggleArchive(p)} title={t("archive")}><Archive className="size-3" /></Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-0.5">
                    <Button size="sm" variant="outline" className="h-6 text-[9px] px-1" onClick={() => toggleArchive(p)}>{t("restore")}</Button>
                    <Button size="sm" variant="ghost" className="h-6 text-[9px] px-0 text-destructive" onClick={() => remove(p)}><Trash2 className="size-3" /></Button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
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
