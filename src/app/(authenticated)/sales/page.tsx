"use client";


import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getSales, type Sale } from "@/lib/queries";
import { useCachedQuery } from "@/hooks/use-cached-query";
import { PaginationBar, paginate } from "@/components/ui/pagination-bar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useT } from "@/lib/i18n";
import { fmtMoney, fmtDateTime } from "@/lib/format";
import { FAB } from "../products/page";
import { SaleDialog } from "@/components/sale-dialog";
import { RotateCcw, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createReturnFn, deleteSaleFn } from "@/lib/rpc";



export default function SalesPage() {
  const { t } = useT();
  const isMobile = useIsMobile();
  const { data } = useCachedQuery(["sales"], getSales);
  const [open, setOpen] = useState(false);
  const [returnSale, setReturnSale] = useState<Sale | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = isMobile ? 12 : 20;

  const q = search.trim().toLowerCase();
  const filter = (items: Sale[]) =>
    items.filter(s =>
      !q ||
      s.product_name.toLowerCase().includes(q) ||
      (s.parties?.name ?? "").toLowerCase().includes(q),
    );

  const cash = filter((data ?? []).filter(s => s.type === "cash"));
  const credit = filter((data ?? []).filter(s => s.type === "credit"));
  const online = filter((data ?? []).filter(s => s.type === "online"));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-bold font-serif">{t("sales")}</h1>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8 shrink-0"
          onClick={() => setSearchOpen(v => !v)}
          aria-label={t("search")}
        >
          <Search className="icon-sm" />
        </Button>
      </div>

      {(searchOpen || search) && (
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground z-10 pointer-events-none" />
          <Input
            style={{ paddingLeft: "2.5rem" }}
            className="pl-10 h-9 text-sm"
            placeholder={t("search_sales")}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            autoFocus={searchOpen}
          />
        </div>
      )}

      <Tabs defaultValue="cash" onValueChange={() => setPage(1)}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="cash">{t("cash_sale")}</TabsTrigger>
          <TabsTrigger value="credit">{t("credit_sale")}</TabsTrigger>
          <TabsTrigger value="online">{t("online_sell")}</TabsTrigger>
        </TabsList>
        <TabsContent value="cash" className="pt-3 space-y-2">
          <SalesTab items={cash} page={page} pageSize={pageSize} onPageChange={setPage} onReturn={setReturnSale} />
        </TabsContent>
        <TabsContent value="credit" className="pt-3 space-y-2">
          <SalesTab items={credit} page={page} pageSize={pageSize} onPageChange={setPage} credit onReturn={setReturnSale} />
        </TabsContent>
        <TabsContent value="online" className="pt-3 space-y-2">
          <SalesTab items={online} page={page} pageSize={pageSize} onPageChange={setPage} onReturn={setReturnSale} />
        </TabsContent>
      </Tabs>

      <FAB onClick={() => setOpen(true)} />
      <SaleDialog open={open} onOpenChange={setOpen} />
      {returnSale && (
        <ReturnDialog sale={returnSale} open={!!returnSale} onOpenChange={v => { if (!v) setReturnSale(null); }} />
      )}
    </div>
  );
}

function SalesTab({
  items, page, pageSize, onPageChange, credit, onReturn,
}: {
  items: Sale[];
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  credit?: boolean;
  onReturn: (sale: Sale) => void;
}) {
  const { t } = useT();
  const qc = useQueryClient();
  const { items: paged, totalPages, safePage } = paginate(items, page, pageSize);

  async function handleDelete(id: string) {
    if (!confirm(t("delete") + "?")) return;
    try {
      const res = await deleteSaleFn({ data: { id } });
      if (res && !res.success && 'error' in res) {
        throw new Error(res.error as string);
      }
      toast.success(t("delete") || "Deleted successfully");
      qc.invalidateQueries({ queryKey: ["sales"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["cashbox"] });
    } catch (err: any) {
      toast.error(err.message || String(err));
    }
  }

  if (items.length === 0) {
    return <Card className="p-8 text-center text-sm text-muted-foreground">{t("no_sales")}</Card>;
  }

  return (
    <>
      <Card className="divide-y divide-border overflow-hidden">
        {paged.map(s => (
          <div key={s.id} className="p-3 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="font-medium truncate text-sm">
                {s.product_name} <span className="text-muted-foreground text-xs">×{s.qty}</span>
                {s.returned && <span className="ml-1 text-xs text-destructive">({t("returned")})</span>}
              </div>
              <div className="text-xs text-muted-foreground">
                {credit && s.parties?.name ? `${s.parties.name} · ` : ""}{fmtDateTime(s.created_at)}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-semibold text-sm">{fmtMoney(Number(s.sell_price) * s.qty)}</div>
              {credit
                ? <div className="text-xs text-warning">{t("due")}: {fmtMoney(s.due_amount)}</div>
                : <div className="text-xs text-success">+{fmtMoney(s.profit)}</div>}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {s.product_id && !s.returned && (
                <Button size="sm" variant="outline" className="h-8 px-2" onClick={() => onReturn(s)}>
                  <RotateCcw className="size-3.5" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-destructive"
                onClick={() => handleDelete(s.id)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </Card>
      <PaginationBar page={safePage} totalPages={totalPages} total={items.length} pageSize={pageSize} onPageChange={onPageChange} />
    </>
  );
}

function ReturnDialog({
  sale, open, onOpenChange,
}: {
  sale: Sale;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { t } = useT();
  const qc = useQueryClient();
  const [qty, setQty] = useState(String(sale.qty));
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await createReturnFn({ data: { sale_id: sale.id, qty: Number(qty) || 0, note: note || null } });
      qc.invalidateQueries({ queryKey: ["sales"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["returns"] });
      toast.success(t("return_product"));
      onOpenChange(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("return_product")} — {sale.product_name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">{t("qty")} (max {sale.qty})</Label>
            <Input inputMode="numeric" value={qty} onChange={e => setQty(e.target.value)} max={sale.qty} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">{t("note")}</Label>
            <Input value={note} onChange={e => setNote(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
            <Button type="submit" disabled={busy}>{busy ? "…" : t("return_product")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
