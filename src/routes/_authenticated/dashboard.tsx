import { createFileRoute } from "@tanstack/react-router";
import { useCachedQuery } from "@/hooks/use-cached-query";
import {
  TrendingUp, Wallet, AlertCircle, Receipt, ShoppingBag,
  Package, PlusCircle, ArrowUpRight, ArrowDownRight,
  DollarSign, Banknote, Users,
} from "lucide-react";
import { useT } from "@/lib/i18n";
import { getExpenses, getSales, getWithdrawals, getProducts, getParties, getCashbox } from "@/lib/queries";
import { cashboxBalance } from "@/lib/cashbox-utils";
import { fmtMoney, fmtDateTime } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";
import { canAccess, resolvePermissions } from "@/lib/permissions";
import { Link } from "@tanstack/react-router";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

// ── helpers ──────────────────────────────────────────────────────────────
function startOf(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
}
function todayStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
function dayLabel(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function groupByDay(sales: any[], days: number) {
  const result: Record<string, { cash: number; credit: number; online: number; profit: number }> = {};
  const from = startOf(days);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    result[key] = { cash: 0, credit: 0, online: 0, profit: 0 };
  }
  for (const s of sales) {
    if (new Date(s.created_at) < from) continue;
    const key = dayLabel(s.created_at);
    if (!result[key]) continue;
    const total = Number(s.sell_price) * s.qty;
    result[key][s.type as "cash" | "credit" | "online"] += total;
    result[key].profit += Number(s.profit);
  }
  return Object.entries(result).map(([date, v]) => ({ date, ...v }));
}

// ── stat card ─────────────────────────────────────────────────────────────
function KPICard({
  label, value, sub, icon: Icon, trend, trendUp, color,
}: {
  label: string; value: string; sub?: string;
  icon: React.ElementType; trend?: string; trendUp?: boolean; color: string;
}) {
  return (
    <Card className="p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div className={`size-9 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="size-4 text-white" />
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? "text-emerald-600" : "text-red-500"}`}>
          {trendUp ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
          {trend}
        </div>
      )}
    </Card>
  );
}

// ── custom tooltip ────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background border border-border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="size-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="font-medium">৳{Number(p.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

// ── main dashboard ────────────────────────────────────────────────────────
function Dashboard() {
  const { t } = useT();
  const { user } = useAuth();
  const perms = resolvePermissions(user?.role ?? "employee", user?.permissions);
  const isMobile = useIsMobile();
  const sales = useCachedQuery(["sales"], getSales);
  const expenses = useCachedQuery(["expenses"], getExpenses);
  const withdrawals = useCachedQuery(["withdrawals"], getWithdrawals);
  const cashbox = useCachedQuery(["cashbox"], getCashbox);
  const products = useCachedQuery(["products"], getProducts);
  const parties = useCachedQuery(["parties"], getParties);

  const allSales      = sales.data ?? [];
  const allExpenses   = expenses.data ?? [];
  const allWithdrawals = withdrawals.data ?? [];

  const today   = todayStart();
  const week    = startOf(7);
  const month   = startOf(30);

  // KPIs
  const cashToday    = allSales.filter(s => new Date(s.created_at) >= today && s.type === "cash").reduce((a, s) => a + Number(s.sell_price) * s.qty, 0);
  const creditToday  = allSales.filter(s => new Date(s.created_at) >= today && s.type === "credit").reduce((a, s) => a + Number(s.due_amount), 0);
  const onlineToday  = allSales.filter(s => new Date(s.created_at) >= today && s.type === "online").reduce((a, s) => a + Number(s.sell_price) * s.qty, 0);
  const profitWeek   = allSales.filter(s => new Date(s.created_at) >= week).reduce((a, s) => a + Number(s.profit), 0);
  const profitMonth  = allSales.filter(s => new Date(s.created_at) >= month).reduce((a, s) => a + Number(s.profit), 0);
  const totalDues    = allSales.reduce((a, s) => a + Number(s.due_amount), 0);
  const expenseToday = allExpenses.filter(e => new Date(e.created_at) >= today).reduce((a, e) => a + Number(e.amount), 0);
  const cashboxTotal = cashboxBalance(cashbox.data ?? []);

  // Chart data
  const chartDays  = isMobile ? 7 : 14;
  const dailyData  = groupByDay(allSales, chartDays);

  // Payment breakdown for pie
  const cashTotal   = allSales.filter(s => s.type === "cash").reduce((a, s) => a + Number(s.sell_price) * s.qty, 0);
  const creditTotal = allSales.filter(s => s.type === "credit").reduce((a, s) => a + Number(s.sell_price) * s.qty, 0);
  const onlineTotal = allSales.filter(s => s.type === "online").reduce((a, s) => a + Number(s.sell_price) * s.qty, 0);
  const pieData = [
    { name: t("cash"),        value: cashTotal,   color: "#6366f1" },
    { name: t("credit"),      value: creditTotal, color: "#f59e0b" },
    { name: t("online_sell"), value: onlineTotal, color: "#10b981" },
  ].filter(d => d.value > 0);

  // Recent sales
  const recent = [...allSales].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 8);

  // Top products by revenue
  const productRevMap: Record<string, number> = {};
  for (const s of allSales) {
    productRevMap[s.product_name] = (productRevMap[s.product_name] ?? 0) + Number(s.sell_price) * s.qty;
  }
  const topProducts = Object.entries(productRevMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  // ── Mobile layout ─────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold">{t("dashboard")}</h1>
          <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
        </div>

        {/* KPI 2-col grid */}
        <div className="grid grid-cols-2 gap-3">
          <KPICard label={t("cash_sale")} value={fmtMoney(cashToday)} sub={t("today")} icon={Wallet} color="bg-indigo-500" />
          <KPICard label={t("credit_sale")} value={fmtMoney(creditToday)} sub={t("today")} icon={AlertCircle} color="bg-amber-500" />
          <KPICard label={t("profit")} value={fmtMoney(profitWeek)} sub={t("this_week")} icon={TrendingUp} color="bg-emerald-500" />
          {canAccess(perms, "expenses") && (
            <KPICard label={t("expense")} value={fmtMoney(expenseToday)} sub={t("today")} icon={Receipt} color="bg-rose-500" />
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {canAccess(perms, "expenses") ? (
            <Link to="/cash-management/cashbox" className="block">
              <KPICard label={t("cashbox")} value={fmtMoney(cashboxTotal)} icon={Banknote} color="bg-indigo-600" trendUp={cashboxTotal >= 0} trend={t("balance")} />
            </Link>
          ) : (
            <KPICard label={t("cash_sale")} value={fmtMoney(cashToday)} sub={t("today")} icon={Wallet} color="bg-indigo-600" />
          )}
          {canAccess(perms, "parties") && (
            <KPICard label={t("due")} value={fmtMoney(totalDues)} icon={AlertCircle} color="bg-amber-600" trendUp={false} />
          )}
        </div>

        {/* 7-day area chart */}
        <Card className="p-4">
          <h2 className="text-sm font-semibold mb-3">{t("daily_sales_trend")} (7d)</h2>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="gcash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} tickFormatter={v => `৳${v}`} width={45} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="cash" stroke="#6366f1" fill="url(#gcash)" strokeWidth={2} name={t("cash")} />
              <Area type="monotone" dataKey="online" stroke="#10b981" fill="none" strokeWidth={2} name={t("online_sell")} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Quick links */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { to: "/products", icon: Package, label: t("products"), perm: "products" as const },
            { to: "/sales", icon: ShoppingBag, label: t("sales"), perm: "sales" as const },
            { to: "/parties", icon: Users, label: t("parties"), perm: "parties" as const },
          ].filter(item => canAccess(perms, item.perm)).map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border bg-card hover:bg-accent transition-colors">
              <Icon className="size-5 text-primary" />
              <span className="text-xs font-medium text-center">{label}</span>
            </Link>
          ))}
        </div>

        {/* Recent activity */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t("recent_activity")}</h2>
          <Card className="divide-y divide-border overflow-hidden">
            {recent.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">{t("no_activity")}</div>}
            {recent.map(s => (
              <div key={s.id} className="p-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium truncate text-sm">{s.product_name}</div>
                  <div className="text-xs text-muted-foreground">{s.type === "cash" ? t("cash") : s.type === "online" ? t("online_sell") : t("credit")} · {fmtDateTime(s.created_at)}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold text-sm">{fmtMoney(Number(s.sell_price) * s.qty)}</div>
                  <div className="text-xs text-emerald-600">+{fmtMoney(s.profit)}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>

      </div>
    );
  }

  // ── Desktop layout (Google Analytics style) ───────────────────────────
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("dashboard")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/sales" className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <ShoppingBag className="size-4" />
            {t("new_sale")}
          </Link>
        </div>
      </div>

      {/* ── Row 1: 5 KPI cards ── */}
      <div className="grid grid-cols-5 gap-4">
        {canAccess(perms, "expenses") ? (
          <Link to="/cash-management/cashbox" className="block">
            <KPICard label={t("cashbox")} value={fmtMoney(cashboxTotal)} icon={Banknote} color="bg-indigo-500" trendUp={cashboxTotal >= 0} trend={t("balance")} />
          </Link>
        ) : (
          <KPICard label={t("cash_sale")} value={fmtMoney(cashToday)} sub={t("today")} icon={Wallet} color="bg-indigo-500" trendUp />
        )}
        <KPICard label={t("cash_sale")} value={fmtMoney(cashToday)} sub={t("today")} icon={DollarSign} color="bg-emerald-500" trendUp />
        <KPICard label={t("online_sell")} value={fmtMoney(onlineToday)} sub={t("today")} icon={TrendingUp} color="bg-sky-500" trendUp />
        {canAccess(perms, "parties") && (
          <KPICard label={t("due")} value={fmtMoney(totalDues)} icon={AlertCircle} color="bg-amber-500" trendUp={false} trend="Outstanding" />
        )}
        <KPICard label={t("profit")} value={fmtMoney(profitMonth)} sub={t("this_month")} icon={Banknote} color="bg-violet-500" trendUp />
      </div>

      {/* ── Row 2: secondary KPIs ── */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard label={t("credit_sale")} value={fmtMoney(creditToday)} sub={t("today")} icon={Receipt} color="bg-rose-500" trendUp={false} />
        {canAccess(perms, "expenses") && (
          <KPICard label={t("expense")} value={fmtMoney(expenseToday)} sub={t("today")} icon={Receipt} color="bg-orange-500" trendUp={false} />
        )}
        <KPICard label={t("products")} value={String(products.data?.length ?? "—")} sub="Total SKUs" icon={Package} color="bg-teal-500" trendUp />
        {canAccess(perms, "parties") && (
          <KPICard label={t("parties")} value={String(parties.data?.length ?? "—")} sub="Total" icon={Users} color="bg-pink-500" trendUp />
        )}
      </div>

      {/* ── Row 3: Area chart + Pie ── */}
      <div className="grid grid-cols-3 gap-4">
        {/* 14-day area chart */}
        <Card className="col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">{t("daily_sales_trend")} (14d)</h2>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-indigo-500 inline-block" />{t("cash")}</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-amber-500 inline-block" />{t("credit")}</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-emerald-500 inline-block" />{t("online_sell")}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="gCash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gCredit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gOnline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `৳${(v / 1000).toFixed(0)}k`} width={50} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="cash" stroke="#6366f1" fill="url(#gCash)" strokeWidth={2} name={t("cash")} />
              <Area type="monotone" dataKey="credit" stroke="#f59e0b" fill="url(#gCredit)" strokeWidth={2} name={t("credit")} />
              <Area type="monotone" dataKey="online" stroke="#10b981" fill="url(#gOnline)" strokeWidth={2} name={t("online_sell")} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie: payment breakdown */}
        <Card className="p-5">
          <h2 className="text-sm font-semibold mb-4">{t("payment_method_breakdown")}</h2>
          {pieData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">{t("no_activity")}</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => `৳${Number(v).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full" style={{ background: d.color }} />
                      {d.name}
                    </span>
                    <span className="font-semibold">{fmtMoney(d.value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* ── Row 4: Top products bar + Recent transactions ── */}
      <div className="grid grid-cols-3 gap-4">
        {/* Top products bar chart */}
        <Card className="p-5">
          <h2 className="text-sm font-semibold mb-4">Top Products by Revenue</h2>
          {topProducts.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">{t("no_activity")}</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => `৳${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
                <Tooltip formatter={(v: any) => `৳${Number(v).toLocaleString()}`} />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Recent transactions table */}
        <Card className="col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">{t("recent_activity")}</h2>
            <Link to="/sales" className="text-xs text-primary hover:underline">{t("view")} all →</Link>
          </div>
          {recent.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">{t("no_activity")}</div>
          ) : (
            <div className="overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-4 text-xs font-medium text-muted-foreground uppercase tracking-wide pb-2 border-b border-border">
                <span>Product</span>
                <span>Type</span>
                <span>Date</span>
                <span className="text-right">Amount</span>
              </div>
              <div className="divide-y divide-border">
                {recent.map(s => (
                  <div key={s.id} className="grid grid-cols-4 py-2.5 text-sm items-center">
                    <span className="font-medium truncate pr-2">{s.product_name}</span>
                    <span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        s.type === "cash" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" :
                        s.type === "online" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" :
                        "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                      }`}>
                        {s.type === "cash" ? t("cash") : s.type === "online" ? t("online_sell") : t("credit")}
                      </span>
                    </span>
                    <span className="text-muted-foreground text-xs">{fmtDateTime(s.created_at)}</span>
                    <div className="text-right">
                      <div className="font-semibold">{fmtMoney(Number(s.sell_price) * s.qty)}</div>
                      <div className="text-xs text-emerald-600">+{fmtMoney(s.profit)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* ── Row 5: Profit trend bar ── */}
      <Card className="p-5">
        <h2 className="text-sm font-semibold mb-4">{t("profit")} — {t("daily_sales_trend")} (14d)</h2>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `৳${(v / 1000).toFixed(0)}k`} width={50} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} name={t("profit")} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
