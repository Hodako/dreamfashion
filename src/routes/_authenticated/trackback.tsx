import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, BarChart3 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useT } from "@/lib/i18n";
import { useCachedQuery } from "@/hooks/use-cached-query";
import { getSales, getPurchases, getExpenses, getReturns, getParties } from "@/lib/queries";
import { fmtMoney, fmtDateTime } from "@/lib/format";
import { downloadCsv, exportDateStamp } from "@/lib/export";
import { PaginationBar, paginate } from "@/components/ui/pagination-bar";

export const Route = createFileRoute("/_authenticated/trackback")({
  component: TrackbackPage,
});

type Range = "today" | "week" | "month" | "all";

function startOfRange(range: Range) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  if (range === "week") d.setDate(d.getDate() - 7);
  if (range === "month") d.setDate(d.getDate() - 30);
  if (range === "all") return new Date(0);
  return d;
}

function inRange(dateStr: string, range: Range, from?: string, to?: string) {
  const d = new Date(dateStr);
  if (from && d < new Date(from)) return false;
  if (to && d > new Date(to + "T23:59:59")) return false;
  return d >= startOfRange(range);
}

function TrackbackPage() {
  const { t } = useT();
  const [range, setRange] = useState<Range>("month");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const sales = useCachedQuery(["sales"], getSales);
  const purchases = useCachedQuery(["purchases"], getPurchases);
  const expenses = useCachedQuery(["expenses"], getExpenses);
  const returns = useCachedQuery(["returns"], getReturns);
  const parties = useCachedQuery(["parties"], getParties);

  const filteredSales = useMemo(
    () => (sales.data ?? []).filter(s => inRange(s.created_at, range, from, to)),
    [sales.data, range, from, to],
  );

  const chartData = useMemo(() => {
    const map: Record<string, { sales: number; profit: number }> = {};
    for (const s of filteredSales) {
      const key = new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (!map[key]) map[key] = { sales: 0, profit: 0 };
      map[key].sales += Number(s.sell_price) * s.qty;
      map[key].profit += Number(s.profit);
    }
    return Object.entries(map).map(([date, v]) => ({ date, ...v }));
  }, [filteredSales]);

  const totals = useMemo(() => ({
    sales: filteredSales.reduce((a, s) => a + Number(s.sell_price) * s.qty, 0),
    profit: filteredSales.reduce((a, s) => a + Number(s.profit), 0),
    count: filteredSales.length,
  }), [filteredSales]);

  const { items: pagedSales, totalPages, safePage } = paginate(filteredSales, page, pageSize);

  function exportSalesCsv() {
    downloadCsv(
      `sales-${exportDateStamp()}.csv`,
      ["Date", "Product", "Qty", "Type", "Total", "Profit", "Due"],
      filteredSales.map(s => [
        fmtDateTime(s.created_at),
        s.product_name,
        s.qty,
        s.type,
        Number(s.sell_price) * s.qty,
        s.profit,
        s.due_amount,
      ]),
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold font-serif">{t("trackback")}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{t("reports")} · {t("all_records")}</p>
        </div>
        <Button size="sm" variant="outline" className="h-8 text-xs shrink-0" onClick={exportSalesCsv}>
          <Download className="icon-sm mr-1" />
          {t("download_csv")}
        </Button>
      </div>

      {/* Date filters */}
      <Card className="p-3 shadow-sm space-y-2">
        <p className="text-xs font-medium text-muted-foreground">{t("filter_date")}</p>
        <div className="flex flex-wrap gap-1.5">
          {(["today", "week", "month", "all"] as Range[]).map(r => (
            <Button
              key={r}
              size="sm"
              variant={range === r ? "default" : "outline"}
              className="h-7 text-xs px-2.5"
              onClick={() => { setRange(r); setPage(1); }}
            >
              {r === "today" ? t("today") : r === "week" ? t("this_week") : r === "month" ? t("this_month") : t("all_records")}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input type="date" className="h-8 text-xs" value={from} onChange={e => setFrom(e.target.value)} />
          <Input type="date" className="h-8 text-xs" value={to} onChange={e => setTo(e.target.value)} />
        </div>
      </Card>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3 shadow-sm text-center">
          <p className="text-[10px] text-muted-foreground uppercase">{t("total_sales")}</p>
          <p className="text-sm font-bold mt-0.5">{fmtMoney(totals.sales)}</p>
        </Card>
        <Card className="p-3 shadow-sm text-center">
          <p className="text-[10px] text-muted-foreground uppercase">{t("profit")}</p>
          <p className="text-sm font-bold text-success mt-0.5">{fmtMoney(totals.profit)}</p>
        </Card>
        <Card className="p-3 shadow-sm text-center">
          <p className="text-[10px] text-muted-foreground uppercase">{t("sales")}</p>
          <p className="text-sm font-bold mt-0.5">{totals.count}</p>
        </Card>
      </div>

      {/* Live chart */}
      <Card className="p-3 shadow-sm">
        <div className="flex items-center gap-1.5 mb-2">
          <BarChart3 className="icon-sm text-primary" />
          <h2 className="text-sm font-semibold">{t("daily_sales_trend")}</h2>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="tbSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.6209 0.1801 348.1385)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="oklch(0.6209 0.1801 348.1385)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.05 212 / 0.5)" />
            <XAxis dataKey="date" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 9 }} width={40} tickFormatter={v => `৳${v}`} />
            <Tooltip formatter={(v: number) => fmtMoney(v)} />
            <Area type="monotone" dataKey="sales" stroke="oklch(0.6209 0.1801 348.1385)" fill="url(#tbSales)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Data tabs */}
      <Tabs defaultValue="sales" onValueChange={() => setPage(1)}>
        <TabsList className="grid grid-cols-4 w-full h-8">
          <TabsTrigger value="sales" className="text-[10px] px-1">{t("sales")}</TabsTrigger>
          <TabsTrigger value="purchases" className="text-[10px] px-1">{t("purchases")}</TabsTrigger>
          <TabsTrigger value="expenses" className="text-[10px] px-1">{t("expenses")}</TabsTrigger>
          <TabsTrigger value="returns" className="text-[10px] px-1">{t("returns")}</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="mt-3 space-y-2">
          <Card className="divide-y divide-border overflow-hidden shadow-sm">
            {pagedSales.length === 0 && (
              <p className="p-6 text-center text-xs text-muted-foreground">{t("no_sales")}</p>
            )}
            {pagedSales.map(s => (
              <div key={s.id} className="px-3 py-2.5 flex justify-between gap-2 text-xs">
                <div className="min-w-0">
                  <p className="font-medium truncate">{s.product_name} ×{s.qty}</p>
                  <p className="text-muted-foreground">{fmtDateTime(s.created_at)} · {s.type}</p>
                </div>
                <p className="font-semibold shrink-0">{fmtMoney(Number(s.sell_price) * s.qty)}</p>
              </div>
            ))}
          </Card>
          <PaginationBar page={safePage} totalPages={totalPages} total={filteredSales.length} pageSize={pageSize} onPageChange={setPage} />
        </TabsContent>

        <TabsContent value="purchases" className="mt-3">
          <RecordList
            items={(purchases.data ?? []).filter(p => inRange(p.created_at, range, from, to))}
            render={p => ({ label: `${p.product_name} ×${p.qty}`, sub: fmtDateTime(p.created_at), amount: fmtMoney(p.total) })}
            empty={t("no_activity")}
          />
        </TabsContent>

        <TabsContent value="expenses" className="mt-3">
          <RecordList
            items={(expenses.data ?? []).filter(e => inRange(e.created_at, range, from, to))}
            render={e => ({ label: e.title, sub: fmtDateTime(e.created_at), amount: fmtMoney(e.amount) })}
            empty={t("no_activity")}
          />
        </TabsContent>

        <TabsContent value="returns" className="mt-3">
          <RecordList
            items={(returns.data ?? []).filter(r => inRange(r.created_at, range, from, to))}
            render={r => ({ label: `${r.product_name} ×${r.qty}`, sub: fmtDateTime(r.created_at), amount: t("returned") })}
            empty={t("no_activity")}
          />
        </TabsContent>
      </Tabs>

      <p className="text-[10px] text-muted-foreground text-center">
        {parties.data?.length ?? 0} {t("parties")} · cached locally
      </p>
    </div>
  );
}

function RecordList<T extends { id: string }>({
  items, render, empty,
}: {
  items: T[];
  render: (item: T) => { label: string; sub: string; amount: string };
  empty: string;
}) {
  const [page, setPage] = useState(1);
  const { items: paged, totalPages, safePage } = paginate(items, page, 15);

  return (
    <div className="space-y-2">
      <Card className="divide-y divide-border overflow-hidden shadow-sm">
        {paged.length === 0 && <p className="p-6 text-center text-xs text-muted-foreground">{empty}</p>}
        {paged.map(item => {
          const { label, sub, amount } = render(item);
          return (
            <div key={item.id} className="px-3 py-2.5 flex justify-between gap-2 text-xs">
              <div className="min-w-0">
                <p className="font-medium truncate">{label}</p>
                <p className="text-muted-foreground">{sub}</p>
              </div>
              <p className="font-semibold shrink-0">{amount}</p>
            </div>
          );
        })}
      </Card>
      <PaginationBar page={safePage} totalPages={totalPages} total={items.length} pageSize={15} onPageChange={setPage} />
    </div>
  );
}
