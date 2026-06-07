import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { getSales } from "@/lib/queries";
import { useT } from "@/lib/i18n";
import { fmtMoney, fmtDateTime } from "@/lib/format";
import { FAB } from "./products";
import { SaleDialog } from "@/components/sale-dialog";

export const Route = createFileRoute("/_authenticated/sales")({
  component: SalesPage,
});

function SalesPage() {
  const { t } = useT();
  const { data } = useQuery({ queryKey: ["sales"], queryFn: getSales });
  const [open, setOpen] = useState(false);

  const cash = (data ?? []).filter(s => s.type === "cash");
  const credit = (data ?? []).filter(s => s.type === "credit");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("sales")}</h1>
      <Tabs defaultValue="cash">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="cash">{t("cash_sale")}</TabsTrigger>
          <TabsTrigger value="credit">{t("credit_sale")}</TabsTrigger>
        </TabsList>
        <TabsContent value="cash" className="pt-3"><SalesList items={cash} /></TabsContent>
        <TabsContent value="credit" className="pt-3"><SalesList items={credit} credit /></TabsContent>
      </Tabs>
      <FAB onClick={() => setOpen(true)} />
      <SaleDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

function SalesList({ items, credit }: { items: ReturnType<typeof Array.prototype.slice> | any[]; credit?: boolean }) {
  const { t } = useT();
  if (!items || items.length === 0) return <Card className="p-8 text-center text-sm text-muted-foreground">{t("no_sales")}</Card>;
  return (
    <Card className="divide-y divide-border overflow-hidden">
      {items.map((s: any) => (
        <div key={s.id} className="p-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="font-medium truncate">{s.product_name} <span className="text-muted-foreground text-xs">×{s.qty}</span></div>
            <div className="text-xs text-muted-foreground">
              {credit && s.parties?.name ? `${s.parties.name} · ` : ""}{fmtDateTime(s.created_at)}
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold">{fmtMoney(Number(s.sell_price)*s.qty)}</div>
            {credit
              ? <div className="text-xs text-warning">{t("due")}: {fmtMoney(s.due_amount)}</div>
              : <div className="text-xs text-success">+{fmtMoney(s.profit)}</div>}
          </div>
        </div>
      ))}
    </Card>
  );
}