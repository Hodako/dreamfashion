"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCachedQuery } from "@/hooks/use-cached-query";
import { PaginationBar, paginate } from "@/components/ui/pagination-bar";
import { useState, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Plus, Pencil, Trash2, Search, Archive, Download, Eye, AlertCircle, MoreVertical, ShoppingCart, Minus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getProducts, getSales, type Product } from "@/lib/queries";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProductsPage() {
  const { t } = useT();
  const qc = useQueryClient();
  const isMobile = useIsMobile();
  const { data: productsData } = useCachedQuery(["products"], getProducts);
  const salesQuery = useCachedQuery(["sales"], getSales);

  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [saleProduct, setSaleProduct] = useState<string | undefined>();
  const [saleOpen, setSaleOpen] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"active" | "archived" | "low_stock">("active");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sellCart, setSellCart] = useState<{ product: Product; qty: number; sellPrice: number }[]>([]);

  const pageSize = isMobile ? 12 : 24;

  const allProducts = productsData ?? [];
  const salesData = salesQuery.data ?? [];

  // Valuations
  const totalCostValuation = allProducts.filter(p => !p.archived).reduce((sum, p) => sum + (p.buy_price * p.stock), 0);
  const totalSaleValuation = allProducts.filter(p => !p.archived).reduce((sum, p) => sum + (p.sell_price * p.stock), 0);
  const totalExpectedProfit = Math.max(totalSaleValuation - totalCostValuation, 0);

  // Compute popularity (quantity sold)
  const popularityMap = useMemo(() => {
    const map: Record<string, number> = {};
    salesData.forEach(s => {
      if (s.product_id) {
        map[s.product_id] = (map[s.product_id] ?? 0) + s.qty;
      }
    });
    return map;
  }, [salesData]);

  // Extract unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(allProducts.map(p => p.category).filter(Boolean))) as string[];
  }, [allProducts]);

  // Filters
  const searchFiltered = allProducts.filter(p =>
    (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
    Object.values(p.attributes || {}).some(val => val.toLowerCase().includes(search.toLowerCase())) ||
    (p.category || "").toLowerCase().includes(search.toLowerCase())
  );

  const filteredProducts = searchFiltered.filter(p => {
    const matchesTab = activeTab === "archived" ? p.archived === true : p.archived !== true;
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    const matchesLowStock = activeTab === "low_stock" ? p.stock <= (p.min_stock ?? 5) : true;
    return matchesTab && matchesCategory && matchesLowStock;
  });

  // Sort by popularity (descending)
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const popA = popularityMap[a.id] ?? 0;
      const popB = popularityMap[b.id] ?? 0;
      return popB - popA;
    });
  }, [filteredProducts, popularityMap]);

  const { items: productsToShow, totalPages, safePage } = paginate(sortedProducts, page, pageSize);

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
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <Input className="pl-8 h-9 text-sm" placeholder={t("search_products")} value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
      </div>

      {/* Category Pills Slider */}
      {categories.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 flex-nowrap scrollbar-none">
          <Button
            size="sm"
            variant={selectedCategory === null ? "default" : "outline"}
            className="h-7 text-[10px] rounded-full shrink-0 px-2.5"
            onClick={() => { setSelectedCategory(null); setPage(1); }}
          >
            {t("all")}
          </Button>
          {categories.map(cat => (
            <Button
              key={cat}
              size="sm"
              variant={selectedCategory === cat ? "default" : "outline"}
              className="h-7 text-[10px] rounded-full shrink-0 px-2.5"
              onClick={() => { setSelectedCategory(cat); setPage(1); }}
            >
              {cat}
            </Button>
          ))}
        </div>
      )}

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

      {/* Sell Basket Panel */}
      {sellCart.length > 0 && (
        <Card className="p-3 border-emerald-500/30 bg-emerald-500/5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShoppingCart className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-xs text-emerald-800 dark:text-emerald-300">
                {t("cart")} ({sellCart.reduce((sum, item) => sum + item.qty, 0)})
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 text-muted-foreground hover:text-destructive"
              onClick={() => setSellCart([])}
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="max-h-[160px] overflow-y-auto divide-y divide-border/60 pr-1">
            {sellCart.map((item, index) => (
              <div key={item.product.id} className="flex items-center justify-between py-1.5 text-xs gap-2">
                <span className="truncate flex-1 font-medium">{item.product.name}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setSellCart(prev =>
                        prev
                          .map((x, i) => (i === index ? { ...x, qty: x.qty - 1 } : x))
                          .filter(x => x.qty > 0)
                      );
                    }}
                    className="size-5 rounded bg-muted hover:bg-muted-foreground/15 grid place-items-center"
                  >
                    <Minus className="size-3" />
                  </button>
                  <span className="font-mono text-xs w-4 text-center">{item.qty}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSellCart(prev =>
                        prev.map((x, i) => (i === index ? { ...x, qty: Math.min(x.qty + 1, x.product.stock) } : x))
                      );
                    }}
                    disabled={item.qty >= item.product.stock}
                    className="size-5 rounded bg-muted hover:bg-muted-foreground/15 grid place-items-center disabled:opacity-40"
                  >
                    <Plus className="size-3" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="font-mono text-xs w-16 text-right">{fmtMoney(item.qty * item.sellPrice)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-5 text-destructive"
                    onClick={() => setSellCart(prev => prev.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-emerald-500/20 pt-2 text-xs">
            <div>
              <span className="text-muted-foreground">{t("total")}: </span>
              <span className="font-bold text-sm">{fmtMoney(sellCart.reduce((sum, item) => sum + item.qty * item.sellPrice, 0))}</span>
            </div>
            <Button
              size="sm"
              className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4"
              onClick={() => {
                setSaleOpen(true);
              }}
            >
              {t("sell_selected")}
            </Button>
          </div>
        </Card>
      )}

      {!productsData && <p className="text-xs text-muted-foreground">{t("loading")}</p>}
      {productsData && filteredProducts.length === 0 && (
        <Card className="p-6 text-center text-xs text-muted-foreground">{t("no_products")}</Card>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1.5 pt-1">
        {productsToShow.map(p => {
          const isLowStock = p.stock <= (p.min_stock ?? 5);
          return (
            <Card key={p.id} className={`overflow-hidden border-border/60 flex flex-col justify-between p-1 sm:p-1.5 gap-1 ${p.archived ? "opacity-60" : ""}`}>
              <div>
                <div className="relative rounded overflow-hidden">
                  <ProductImage path={p.image_url} className="w-full aspect-square object-cover" />
                  {!p.archived && isLowStock && (
                    <div className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-0.5 rounded-full shadow" title={t("critical_stock")}>
                      <AlertCircle className="size-3" />
                    </div>
                  )}
                  {p.category && (
                    <span className="absolute bottom-1 left-1 bg-black/60 text-[7px] text-white px-1 py-0.2 rounded font-medium truncate max-w-[80px]">
                      {p.category}
                    </span>
                  )}
                </div>
                <div className="p-1 space-y-0.5">
                  <div className="font-semibold text-[9px] sm:text-xs truncate leading-tight" title={p.name}>{p.name}</div>
                  
                  {/* Custom Attributes Badges */}
                  {p.attributes && Object.keys(p.attributes).length > 0 && (
                    <div className="flex flex-wrap gap-0.5 pt-0.5">
                      {Object.entries(p.attributes).map(([key, val]) => (
                        <span key={key} className="bg-secondary/70 text-[7px] px-1 py-0.2 rounded text-secondary-foreground truncate max-w-[80px]" title={`${key}: ${val}`}>
                          {val}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between text-[8px] sm:text-[10px] pt-1">
                    <span className="text-muted-foreground">{t("sell_price")}</span>
                    <span className="font-semibold">{p.sell_price > 0 ? fmtMoney(p.sell_price) : "—"}</span>
                  </div>
                  <div className="flex justify-between text-[8px] sm:text-[10px]">
                    <span className="text-muted-foreground">{t("stock")}</span>
                    <span className={isLowStock ? "text-destructive font-semibold" : ""}>{p.stock}</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-0.5 flex gap-1">
                {!p.archived ? (
                  <>
                    <Button
                      size="sm"
                      className="h-6 text-[8px] flex-1 px-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                      disabled={p.stock <= 0}
                      onClick={() => {
                        setSellCart(prev => {
                          const existing = prev.find(x => x.product.id === p.id);
                          if (existing) {
                            return prev.map(x => x.product.id === p.id ? { ...x, qty: Math.min(x.qty + 1, p.stock) } : x);
                          }
                          return [...prev, { product: p, qty: 1, sellPrice: p.sell_price || 0 }];
                        });
                        toast.success(`${p.name} -> ${t("cart")}`);
                      }}
                    >
                      + {t("sell")}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-6 shrink-0 text-muted-foreground hover:bg-muted">
                          <MoreVertical className="size-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem
                          onClick={() => {
                            setSaleProduct(p.id);
                            setSaleOpen(true);
                          }}
                          className="text-xs"
                          disabled={p.stock <= 0}
                        >
                          {t("sell")} (Direct)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setEditing(p); setOpen(true); }} className="text-xs">
                          <Pencil className="size-3 mr-1.5" /> {t("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleArchive(p)} className="text-xs">
                          <Archive className="size-3 mr-1.5" /> {t("archive")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline" className="h-6 text-[8px] flex-1" onClick={() => toggleArchive(p)}>{t("restore")}</Button>
                    <Button size="sm" variant="ghost" className="size-6 text-destructive shrink-0" onClick={() => remove(p)}>
                      <Trash2 className="size-3" />
                    </Button>
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <PaginationBar page={safePage} totalPages={totalPages} total={filteredProducts.length} pageSize={pageSize} onPageChange={setPage} />

      <FAB onClick={() => { setEditing(null); setOpen(true); }} />
      <ProductDialog open={open} onOpenChange={setOpen} product={editing} />
      <SaleDialog
        open={saleOpen}
        onOpenChange={(v) => {
          setSaleOpen(v);
          if (!v) {
            setSaleProduct(undefined);
            setSellCart([]);
          }
        }}
        presetProductId={saleProduct}
        presetCart={
          sellCart.length > 0
            ? sellCart.map(c => ({
                productId: c.product.id,
                qty: String(c.qty),
                sellPrice: String(c.sellPrice || c.product.sell_price),
              }))
            : undefined
        }
      />
      <PurchaseDialog open={buyOpen} onOpenChange={setBuyOpen} />
    </div>
  );
}

export function FAB({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="fixed mobile-fab-bottom right-3 z-20 size-10 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-lg shadow-primary/25 active:scale-95 transition">
      <Plus className="size-4.5" />
    </button>
  );
}
