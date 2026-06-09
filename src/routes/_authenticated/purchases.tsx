import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPurchases } from "@/lib/queries";
import type { Purchase } from "@/lib/queries";
import { useCachedQuery } from "@/hooks/use-cached-query";
import { useT } from "@/lib/i18n";
import { fmtMoney, fmtDateTime } from "@/lib/format";
import { FAB } from "./products";
import { PurchaseDialog } from "@/components/purchase-dialog";
import { deletePurchaseFn } from "@/lib/rpc";
import { toast } from "sonner";
import { setCachedData, refreshQueries } from "@/lib/optimistic-cache";

export const Route = createFileRoute("/_authenticated/purchases")({
  component: PurchasesPage,
});

function PurchasesPage() {
  const { t } = useT();
  const qc = useQueryClient();
  const { data } = useCachedQuery(["purchases"], getPurchases);
  const [open, setOpen] = useState(false);

  async function handleDelete(purchase: Purchase) {
    if (!confirm(`${t("delete")} ${purchase.product_name}?`)) return;
    setCachedData<Purchase[]>(qc, ["purchases"], old => (old ?? []).filter(p => p.id !== purchase.id));
    try {
      await deletePurchaseFn({ data: { id: purchase.id } });
      await refreshQueries(qc, ["purchases"], ["products"]);
      toast.success(t("delete"));
    } catch (err: unknown) {
      await refreshQueries(qc, ["purchases"], ["products"]);
      toast.error(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="space-y-4 pb-4">
      <h1 className="text-2xl font-bold">{t("new_purchase")}</h1>
      {(!data || data.length === 0) && (
        <Card className="p-8 text-center text-sm text-muted-foreground">{t("no_activity")}</Card>
      )}
      <Card className="divide-y divide-border overflow-hidden">
        {data?.map(p => (
          <div key={p.id} className="p-3 flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="font-medium truncate">{p.product_name} ×{p.qty}</div>
              <div className="text-xs text-muted-foreground">{fmtDateTime(p.created_at)}</div>
            </div>
            <div className="font-semibold shrink-0">{fmtMoney(p.total)}</div>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-destructive shrink-0"
              onClick={() => handleDelete(p)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
      </Card>
      <FAB onClick={() => setOpen(true)} />
      <PurchaseDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
