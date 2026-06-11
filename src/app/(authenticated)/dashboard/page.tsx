"use client";

import { useCachedQuery } from "@/hooks/use-cached-query";
import { useQueryClient } from "@tanstack/react-query";
import {
  TrendingUp, Wallet, AlertCircle, Receipt, ShoppingBag,
  Package, PlusCircle, ArrowUpRight, ArrowDownRight,
  DollarSign, Banknote, Users, Search, ChevronDown, ChevronUp,
  Trash2, Plus, Calendar, BarChart3, LineChart as LineChartIcon, AreaChart as AreaChartIcon, CheckSquare, Square
} from "lucide-react";
import { useT } from "@/lib/i18n";
import { getExpenses, getSales, getWithdrawals, getProducts, getParties, getCashbox, getReminders } from "@/lib/queries";
import { cashboxBalance } from "@/lib/cashbox-utils";
import { fmtMoney, fmtDateTime } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";
import { canAccess, resolvePermissions } from "@/lib/permissions";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createReminderFn, toggleReminderFn, deleteReminderFn } from "@/lib/rpc";

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line
} from "recharts";

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

function groupAllDataByDay(sales: any[], expenses: any[], days: number) {
  const result: Record<string, { date: string; sales: number; profit: number; expenses: number }> = {};
  const from = startOf(days);
  
  // Initialize range
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    result[key] = { date: key, sales: 0, profit: 0, expenses: 0 };
  }

  // Populate sales and profit
  for (const s of sales) {
    if (new Date(s.created_at) < from) continue;
    const key = dayLabel(s.created_at);
    if (result[key]) {
      const saleVal = Number(s.sell_price) * s.qty;
      result[key].sales += saleVal;
      result[key].profit += Number(s.profit);
    }
  }

  // Populate expenses
  for (const e of expenses) {
    if (new Date(e.created_at) < from) continue;
    const key = dayLabel(e.created_at);
    if (result[key]) {
      result[key].expenses += Number(e.amount);
    }
  }

  return Object.values(result);
}

// ── stat card ─────────────────────────────────────────────────────────────
function KPICard({
  label, value, sub, icon: Icon, trend, trendUp, color,
}: {
  label: string; value: string; sub?: string;
  icon: React.ElementType; trend?: string; trendUp?: boolean; color: string;
}) {
  return (
    <Card className="p-4 flex flex-col gap-2 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <div className={`size-8 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="size-4 text-white" />
        </div>
      </div>
      <div>
        <div className="text-xl font-bold tracking-tight">{value}</div>
        {sub && <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-[10px] font-medium ${trendUp ? "text-emerald-600" : "text-red-500"}`}>
          {trendUp ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
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
    <div className="bg-background border border-border rounded-lg shadow-lg p-2.5 text-xs">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-1.5">
          <div className="size-1.5 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="font-medium">৳{Number(p.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

// ── main dashboard ────────────────────────────────────────────────────────
export default function Dashboard() {
  const { t } = useT();
  const { user } = useAuth();
  const qc = useQueryClient();
  const perms = resolvePermissions(user?.role ?? "employee", user?.permissions);
  const isMobile = useIsMobile();
  
  // Data queries
  const sales = useCachedQuery(["sales"], getSales);
  const expenses = useCachedQuery(["expenses"], getExpenses);
  const withdrawals = useCachedQuery(["withdrawals"], getWithdrawals);
  const cashbox = useCachedQuery(["cashbox"], getCashbox);
  const products = useCachedQuery(["products"], getProducts);
  const parties = useCachedQuery(["parties"], getParties);
  const { data: reminders = [] } = useCachedQuery(["reminders"], getReminders);

  const allSales      = sales.data ?? [];
  const allExpenses   = expenses.data ?? [];
  const allWithdrawals = withdrawals.data ?? [];
  const allCashbox    = cashbox.data ?? [];
  const allParties    = parties.data ?? [];

  const [dateFilter, setDateFilter] = useState<{ from: string; to: string }>({ from: '', to: '' });
  const [showFilter, setShowFilter] = useState(false);

  // Custom Chart State
  const [chartMetric, setChartMetric] = useState<"sales" | "profit" | "expenses">("sales");
  const [chartType, setChartType] = useState<"area" | "bar" | "line">("area");
  const [chartRange, setChartRange] = useState<7 | 14 | 30>(7);

  // Custom Reminder State
  const [newReminderTitle, setNewReminderTitle] = useState("");
  const [newReminderDate, setNewReminderDate] = useState("");
  const [reminderBusy, setReminderBusy] = useState(false);

  // Collapsible sections on mobile
  const [collapsed, setCollapsed] = useState({
    kpis: false,
    graphs: false,
    reminders: false,
    recent: false,
    pie: false,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dashboardDateFilter');
      if (saved) {
        const parsed = JSON.parse(saved);
        setDateFilter(parsed);
      }
    } catch {}
  }, []);

  const applyFilter = (from: string, to: string) => {
    setDateFilter({ from, to });
    try {
      localStorage.setItem('dashboardDateFilter', JSON.stringify({ from, to }));
    } catch {}
  };

  const clearFilter = () => {
    setDateFilter({ from: '', to: '' });
    try {
      localStorage.removeItem('dashboardDateFilter');
    } catch {}
  };

  const today = todayStart();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const week = startOf(7);
  const month = startOf(30);

  // Compute filtered data based on date filter (if any)
  const filteredSales = allSales.filter(s => {
    const d = new Date(s.created_at);
    const showToday = !dateFilter.from && !dateFilter.to;
    const fromOk = showToday
      ? d >= today
      : !dateFilter.from || d >= new Date(dateFilter.from);
    const toOk = showToday
      ? d < tomorrow
      : !dateFilter.to || d <= new Date(dateFilter.to);
    return fromOk && toOk;
  });
  const filteredExpenses = allExpenses.filter(e => {
    const d = new Date(e.created_at);
    const showToday = !dateFilter.from && !dateFilter.to;
    const fromOk = showToday
      ? d >= today
      : !dateFilter.from || d >= new Date(dateFilter.from);
    const toOk = showToday
      ? d < tomorrow
      : !dateFilter.to || d <= new Date(dateFilter.to);
    return fromOk && toOk;
  });
  const filteredCashbox = allCashbox.filter(c => {
    const d = new Date(c.created_at);
    const showToday = !dateFilter.from && !dateFilter.to;
    const fromOk = showToday
      ? d >= today
      : !dateFilter.from || d >= new Date(dateFilter.from);
    const toOk = showToday
      ? d < tomorrow
      : !dateFilter.to || d <= new Date(dateFilter.to);
    return fromOk && toOk;
  });

  // KPIs
  const cashToday    = filteredSales.filter(s => new Date(s.created_at) >= today && s.type === "cash").reduce((a, s) => a + Number(s.sell_price) * s.qty, 0);
  const creditToday  = filteredSales.filter(s => new Date(s.created_at) >= today && s.type === "credit").reduce((a, s) => a + Number(s.due_amount), 0);
  const onlineToday  = filteredSales.filter(s => new Date(s.created_at) >= today && s.type === "online").reduce((a, s) => a + Number(s.sell_price) * s.qty, 0);
  
  // profit today
  const profitToday  = filteredSales.filter(s => new Date(s.created_at) >= today).reduce((a, s) => a + Number(s.profit), 0);
  const profitWeek   = filteredSales.filter(s => new Date(s.created_at) >= week).reduce((a, s) => a + Number(s.profit), 0);
  const profitMonth  = filteredSales.filter(s => new Date(s.created_at) >= month).reduce((a, s) => a + Number(s.profit), 0);
  
  const totalDues    = filteredSales.reduce((a, s) => a + Number(s.due_amount), 0);
  const expenseToday = filteredExpenses.filter(e => new Date(e.created_at) >= today).reduce((a, e) => a + Number(e.amount), 0);
  const cashboxTotal = cashboxBalance(filteredCashbox);

  // Stock Valuation
  const totalStockCostValuation = (products.data ?? []).filter(p => !p.archived).reduce((sum, p) => sum + (p.buy_price * p.stock), 0);
  const totalStockSaleValuation = (products.data ?? []).filter(p => !p.archived).reduce((sum, p) => sum + (p.sell_price * p.stock), 0);

  // Critical Stock List
  const lowStockProducts = (products.data ?? []).filter(p => !p.archived && p.stock <= (p.min_stock ?? 5));

  // Demanding Products
  const productQtyMap: Record<string, number> = {};
  filteredSales.forEach(s => {
    productQtyMap[s.product_name] = (productQtyMap[s.product_name] ?? 0) + s.qty;
  });
  const topDemandedProducts = Object.entries(productQtyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  // Custom graph data
  const customGraphData = groupAllDataByDay(allSales, allExpenses, chartRange);

  // Payment method breakdown for pie
  const cashTotal   = filteredSales.filter(s => s.type === "cash").reduce((a, s) => a + Number(s.sell_price) * s.qty, 0);
  const creditTotal = filteredSales.filter(s => s.type === "credit").reduce((a, s) => a + Number(s.sell_price) * s.qty, 0);
  const onlineTotal = filteredSales.filter(s => s.type === "online").reduce((a, s) => a + Number(s.sell_price) * s.qty, 0);
  const pieData = [
    { name: t("cash"),        value: cashTotal,   color: "#6366f1" },
    { name: t("credit"),      value: creditTotal, color: "#f59e0b" },
    { name: t("online_sell"), value: onlineTotal, color: "#10b981" },
  ].filter(d => d.value > 0);

  // Recent sales
  const recentSales = [...filteredSales].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 8);

  // Due alerts calculation
  const duesByParty: Record<string, number> = {};
  filteredSales.forEach(s => {
    if (s.party_id) duesByParty[s.party_id] = (duesByParty[s.party_id] ?? 0) + Number(s.due_amount);
  });
  const paidByParty: Record<string, number> = {};
  const allPayments = useCachedQuery(["all-payments"], () => Promise.resolve([])); // dummy or query
  
  const dueAlertParties = allParties.map(p => {
    const rawSales = allSales.filter(s => s.party_id === p.id).reduce((sum, s) => sum + Number(s.due_amount), 0);
    return { ...p, outstanding: rawSales };
  }).filter(p => p.outstanding > 0).slice(0, 4);

  // Custom Reminders Handlers
  async function handleAddReminder(e: React.FormEvent) {
    e.preventDefault();
    if (!newReminderTitle.trim()) return;
    setReminderBusy(true);
    try {
      await createReminderFn({
        data: {
          title: newReminderTitle.trim(),
          due_date: newReminderDate || new Date().toISOString().slice(0, 10),
        },
      });
      setNewReminderTitle("");
      setNewReminderDate("");
      qc.invalidateQueries({ queryKey: ["reminders"] });
      toast.success(t("save"));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setReminderBusy(false);
    }
  }

  async function handleToggleReminder(id: string, completed: boolean) {
    try {
      await toggleReminderFn({ data: { id, completed } });
      qc.invalidateQueries({ queryKey: ["reminders"] });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : String(err));
    }
  }

  async function handleDeleteReminder(id: string) {
    try {
      await deleteReminderFn({ data: { id } });
      qc.invalidateQueries({ queryKey: ["reminders"] });
      toast.success(t("delete"));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : String(err));
    }
  }

  // Render chart conditionally
  const ChartComponent = chartType === "bar" ? BarChart : chartType === "line" ? LineChart : AreaChart;
  const ChartDataElement = chartType === "bar" ? Bar : chartType === "line" ? Line : Area;

  const getMetricColor = () => {
    if (chartMetric === "profit") return "#10b981";
    if (chartMetric === "expenses") return "#ef4444";
    return "#6366f1";
  };

  // ── Mobile Layout ─────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-serif">{t("dashboard")}</h1>
            <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
          </div>
          <Button variant="ghost" size="icon" className="size-8" onClick={() => setShowFilter(!showFilter)} aria-label="Toggle filter">
            <Search className="size-4" />
          </Button>
        </div>

        {/* Date Filter */}
        {showFilter && (
          <Card className="p-3 bg-card border border-border">
            <div className="space-y-2">
              <div>
                <label className="text-[10px] text-muted-foreground block mb-0.5">Date from</label>
                <Input type="date" className="h-8 text-xs" value={dateFilter.from} onChange={e => applyFilter(e.target.value, dateFilter.to)} />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground block mb-0.5">Date to</label>
                <Input type="date" className="h-8 text-xs" value={dateFilter.to} onChange={e => applyFilter(dateFilter.from, e.target.value)} />
              </div>
              <div className="flex gap-1.5 pt-1">
                <Button onClick={() => applyFilter(dateFilter.from, dateFilter.to)} variant="default" size="sm" className="h-7 text-xs flex-1">
                  Apply
                </Button>
                <Button onClick={clearFilter} variant="outline" size="sm" className="h-7 text-xs flex-1">
                  Clear
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Collapsible KPIs Section */}
        <Card className="p-3 border border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Key Metrics</span>
            <Button variant="ghost" size="icon" className="size-7" onClick={() => setCollapsed(prev => ({ ...prev, kpis: !prev.kpis }))}>
              {collapsed.kpis ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
            </Button>
          </div>

          {!collapsed.kpis && (
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <KPICard label={t("profit")} value={fmtMoney(profitToday)} sub={t("today")} icon={TrendingUp} color="bg-emerald-500" />
                <KPICard label={t("cash_sale")} value={fmtMoney(cashToday)} sub={t("today")} icon={Wallet} color="bg-indigo-500" />
                <KPICard label={t("credit_sale")} value={fmtMoney(creditToday)} sub={t("today")} icon={AlertCircle} color="bg-amber-500" />
                {canAccess(perms, "expenses") && (
                  <KPICard label={t("expense")} value={fmtMoney(expenseToday)} sub={t("today")} icon={Receipt} color="bg-rose-500" />
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 border-t border-border/50 pt-2.5">
                {canAccess(perms, "expenses") ? (
                  <Link href="/cash-management/cashbox" className="block">
                    <KPICard label={t("cashbox")} value={fmtMoney(cashboxTotal)} icon={Banknote} color="bg-indigo-600" trendUp={cashboxTotal >= 0} trend={t("balance")} />
                  </Link>
                ) : (
                  <KPICard label={t("cash_sale")} value={fmtMoney(cashToday)} sub={t("today")} icon={Wallet} color="bg-indigo-600" />
                )}
                {canAccess(perms, "parties") && (
                  <KPICard label={t("due")} value={fmtMoney(totalDues)} icon={AlertCircle} color="bg-amber-600" trendUp={false} />
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Collapsible Valuation Cards */}
        <Card className="p-3 border border-border space-y-2">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Stock Valuation</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-secondary/50 rounded-lg">
              <div className="text-[9px] text-muted-foreground">Total Cost Value</div>
              <div className="font-bold text-sm mt-0.5">{fmtMoney(totalStockCostValuation)}</div>
            </div>
            <div className="p-2 bg-secondary/50 rounded-lg">
              <div className="text-[9px] text-muted-foreground">Total Retail Value</div>
              <div className="font-bold text-sm mt-0.5">{fmtMoney(totalStockSaleValuation)}</div>
            </div>
          </div>
        </Card>

        {/* Collapsible Custom Graph Panel */}
        <Card className="p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t("custom_graphs")}</span>
            <Button variant="ghost" size="icon" className="size-7" onClick={() => setCollapsed(prev => ({ ...prev, graphs: !prev.graphs }))}>
              {collapsed.graphs ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
            </Button>
          </div>

          {!collapsed.graphs && (
            <div className="space-y-3">
              {/* Chart Controls */}
              <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px]">
                <div className="flex bg-muted rounded p-0.5">
                  <button onClick={() => setChartMetric("sales")} className={`px-2 py-0.5 rounded ${chartMetric === "sales" ? "bg-background shadow font-medium" : ""}`}>Sales</button>
                  <button onClick={() => setChartMetric("profit")} className={`px-2 py-0.5 rounded ${chartMetric === "profit" ? "bg-background shadow font-medium" : ""}`}>Profit</button>
                  <button onClick={() => setChartMetric("expenses")} className={`px-2 py-0.5 rounded ${chartMetric === "expenses" ? "bg-background shadow font-medium" : ""}`}>Expenses</button>
                </div>
                <div className="flex bg-muted rounded p-0.5">
                  <button onClick={() => setChartType("area")} className={`p-1 rounded ${chartType === "area" ? "bg-background shadow" : ""}`} title="Area Chart"><AreaChartIcon className="size-3" /></button>
                  <button onClick={() => setChartType("bar")} className={`p-1 rounded ${chartType === "bar" ? "bg-background shadow" : ""}`} title="Bar Chart"><BarChart3 className="size-3" /></button>
                  <button onClick={() => setChartType("line")} className={`p-1 rounded ${chartType === "line" ? "bg-background shadow" : ""}`} title="Line Chart"><LineChartIcon className="size-3" /></button>
                </div>
                <div className="flex bg-muted rounded p-0.5">
                  <button onClick={() => setChartRange(7)} className={`px-1.5 py-0.5 rounded ${chartRange === 7 ? "bg-background shadow" : ""}`}>7d</button>
                  <button onClick={() => setChartRange(14)} className={`px-1.5 py-0.5 rounded ${chartRange === 14 ? "bg-background shadow" : ""}`}>14d</button>
                  <button onClick={() => setChartRange(30)} className={`px-1.5 py-0.5 rounded ${chartRange === 30 ? "bg-background shadow" : ""}`}>30d</button>
                </div>
              </div>

              {/* Chart Component */}
              <ResponsiveContainer width="100%" height={150}>
                <ChartComponent data={customGraphData}>
                  <defs>
                    <linearGradient id="gSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 8 }} />
                  <YAxis tick={{ fontSize: 8 }} tickFormatter={v => `৳${v}`} width={40} />
                  <Tooltip content={<ChartTooltip />} />
                  <ChartDataElement type="monotone" dataKey={chartMetric} stroke={getMetricColor()} fill={chartType === "area" ? (chartMetric === "profit" ? "url(#gProfit)" : chartMetric === "expenses" ? "url(#gExpense)" : "url(#gSales)") : undefined} strokeWidth={2} name={t(chartMetric)} />
                </ChartComponent>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Reminders & Checklist Panel */}
        <Card className="p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t("reminders")}</span>
            <Button variant="ghost" size="icon" className="size-7" onClick={() => setCollapsed(prev => ({ ...prev, reminders: !prev.reminders }))}>
              {collapsed.reminders ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
            </Button>
          </div>

          {!collapsed.reminders && (
            <div className="space-y-3">
              {/* Low stock automatic alerts */}
              {lowStockProducts.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[10px] text-destructive font-semibold uppercase">{t("low_stock_reminder")} ({lowStockProducts.length})</div>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {lowStockProducts.map(p => (
                      <div key={p.id} className="text-[10px] p-1.5 bg-rose-500/10 text-rose-700 dark:text-rose-300 rounded flex items-center justify-between">
                        <span>{p.name}</span>
                        <span>Stock: {p.stock} &lt;= {p.min_stock ?? 5}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Due parties collection alerts */}
              {dueAlertParties.length > 0 && (
                <div className="space-y-1 border-t border-border/50 pt-2">
                  <div className="text-[10px] text-amber-500 font-semibold uppercase">{t("due_reminder")}</div>
                  <div className="space-y-1">
                    {dueAlertParties.map(p => (
                      <Link key={p.id} href={`/parties/${p.id}`} className="block text-[10px] p-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded flex items-center justify-between active:scale-[0.99]">
                        <span className="font-medium">{p.name}</span>
                        <span>{fmtMoney(p.outstanding)}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom reminders checklist */}
              <div className="space-y-2 border-t border-border/50 pt-2">
                <div className="text-[10px] text-muted-foreground font-semibold uppercase">{t("custom_reminder")}</div>
                
                {/* Add Reminder Inline Form */}
                <form onSubmit={handleAddReminder} className="flex gap-1">
                  <Input required className="h-7 text-xs flex-1" placeholder={t("add_reminder")} value={newReminderTitle} onChange={e => setNewReminderTitle(e.target.value)} />
                  <Input type="date" className="h-7 text-xs w-24" value={newReminderDate} onChange={e => setNewReminderDate(e.target.value)} />
                  <Button type="submit" disabled={reminderBusy} size="sm" className="h-7 px-2"><Plus className="size-3.5" /></Button>
                </form>

                {/* Reminder Items */}
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {reminders.length === 0 && <p className="text-[10px] text-muted-foreground italic text-center py-2">No custom tasks</p>}
                  {reminders.map(r => (
                    <div key={r.id} className="flex items-center justify-between p-1.5 border border-border rounded text-[10px]">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <button type="button" onClick={() => handleToggleReminder(r.id, !r.completed)}>
                          {r.completed ? <CheckSquare className="size-3.5 text-primary shrink-0" /> : <Square className="size-3.5 text-muted-foreground shrink-0" />}
                        </button>
                        <span className={`truncate ${r.completed ? "line-through text-muted-foreground" : "font-medium"}`}>{r.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground">
                        <span>{r.due_date}</span>
                        <button type="button" className="text-destructive hover:scale-105 active:scale-95" onClick={() => handleDeleteReminder(r.id)}><Trash2 className="size-3" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { to: "/products", icon: Package, label: t("products"), perm: "products" as const },
            { to: "/sales", icon: ShoppingBag, label: t("sales"), perm: "sales" as const },
            { to: "/parties", icon: Users, label: t("parties"), perm: "parties" as const },
          ].filter(item => canAccess(perms, item.perm)).map(({ to, icon: Icon, label }) => (
            <Link key={to} href={to} className="flex flex-col items-center gap-1 p-2 rounded-xl border border-border bg-card hover:bg-accent transition-colors">
              <Icon className="size-4 text-primary" />
              <span className="text-[10px] font-medium text-center">{label}</span>
            </Link>
          ))}
        </div>

        {/* Demanded products list */}
        {topDemandedProducts.length > 0 && (
          <Card className="p-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-2 text-muted-foreground">{t("best_selling")} ({t("qty")})</h2>
            <div className="space-y-1.5">
              {topDemandedProducts.map((p, i) => (
                <div key={p.name} className="flex justify-between items-center text-xs p-1 px-2 bg-secondary/40 rounded">
                  <span className="truncate">{i+1}. {p.name}</span>
                  <span className="font-bold">{p.value} units</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Collapsible Recent Activity */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t("recent_activity")}</h2>
            <Button variant="ghost" size="icon" className="size-7" onClick={() => setCollapsed(prev => ({ ...prev, recent: !prev.recent }))}>
              {collapsed.recent ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
            </Button>
          </div>
          {!collapsed.recent && (
            <Card className="divide-y divide-border overflow-hidden">
              {recentSales.length === 0 && <div className="p-4 text-center text-xs text-muted-foreground">{t("no_activity")}</div>}
              {recentSales.map(s => (
                <div key={s.id} className="p-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{s.product_name}</div>
                    <div className="text-[10px] text-muted-foreground">{s.type === "cash" ? t("cash") : s.type === "online" ? t("online_sell") : t("credit")} · {fmtDateTime(s.created_at)}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-semibold">{fmtMoney(Number(s.sell_price) * s.qty)}</div>
                    <div className="text-[10px] text-emerald-600">+{fmtMoney(s.profit)}</div>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    );
  }

  // ── Desktop Layout ───────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-serif">{t("dashboard")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/sales" className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <ShoppingBag className="size-4" />
            {t("new_sale")}
          </Link>
        </div>
      </div>

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        <KPICard label={t("profit")} value={fmtMoney(profitToday)} sub={t("today")} icon={TrendingUp} color="bg-emerald-500" trendUp />
        {canAccess(perms, "expenses") ? (
          <Link href="/cash-management/cashbox" className="block">
            <KPICard label={t("cashbox")} value={fmtMoney(cashboxTotal)} icon={Banknote} color="bg-indigo-500" trendUp={cashboxTotal >= 0} trend={t("balance")} />
          </Link>
        ) : (
          <KPICard label={t("cash_sale")} value={fmtMoney(cashToday)} sub={t("today")} icon={Wallet} color="bg-indigo-500" trendUp />
        )}
        <KPICard label={t("cash_sale")} value={fmtMoney(cashToday)} sub={t("today")} icon={DollarSign} color="bg-indigo-600" trendUp />
        <KPICard label={t("online_sell")} value={fmtMoney(onlineToday)} sub={t("today")} icon={TrendingUp} color="bg-sky-500" trendUp />
        {canAccess(perms, "parties") && (
          <KPICard label={t("due")} value={fmtMoney(totalDues)} icon={AlertCircle} color="bg-amber-500" trendUp={false} trend="Outstanding" />
        )}
      </div>

      {/* Row 2: Secondary KPIs / Valuation */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard label={t("credit_sale")} value={fmtMoney(creditToday)} sub={t("today")} icon={Receipt} color="bg-rose-500" trendUp={false} />
        {canAccess(perms, "expenses") && (
          <KPICard label={t("expense")} value={fmtMoney(expenseToday)} sub={t("today")} icon={Receipt} color="bg-orange-500" trendUp={false} />
        )}
        <KPICard label="Inventory Valuation (Cost)" value={fmtMoney(totalStockCostValuation)} sub="Cost Worth of Stock" icon={Package} color="bg-teal-500" />
        <KPICard label="Inventory Valuation (Sale)" value={fmtMoney(totalStockSaleValuation)} sub="Selling Worth of Stock" icon={Package} color="bg-pink-500" />
      </div>

      {/* Row 3: Custom Graph + Pie */}
      <div className="grid grid-cols-3 gap-4">
        {/* Custom interactive graph */}
        <Card className="col-span-2 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">{t("custom_graphs")}</h2>
            
            {/* Chart Control Toolbar */}
            <div className="flex items-center gap-3 text-xs">
              {/* Metric Selectors */}
              <div className="flex bg-muted rounded p-0.5">
                <button onClick={() => setChartMetric("sales")} className={`px-2 py-0.5 rounded ${chartMetric === "sales" ? "bg-background shadow font-medium" : ""}`}>Sales</button>
                <button onClick={() => setChartMetric("profit")} className={`px-2 py-0.5 rounded ${chartMetric === "profit" ? "bg-background shadow font-medium" : ""}`}>Profit</button>
                <button onClick={() => setChartMetric("expenses")} className={`px-2 py-0.5 rounded ${chartMetric === "expenses" ? "bg-background shadow font-medium" : ""}`}>Expenses</button>
              </div>
              {/* Chart Style Selectors */}
              <div className="flex bg-muted rounded p-0.5">
                <button onClick={() => setChartType("area")} className={`p-1 rounded ${chartType === "area" ? "bg-background shadow" : ""}`} title="Area Chart"><AreaChartIcon className="size-3.5" /></button>
                <button onClick={() => setChartType("bar")} className={`p-1 rounded ${chartType === "bar" ? "bg-background shadow" : ""}`} title="Bar Chart"><BarChart3 className="size-3.5" /></button>
                <button onClick={() => setChartType("line")} className={`p-1 rounded ${chartType === "line" ? "bg-background shadow" : ""}`} title="Line Chart"><LineChartIcon className="size-3.5" /></button>
              </div>
              {/* Range Selectors */}
              <div className="flex bg-muted rounded p-0.5">
                <button onClick={() => setChartRange(7)} className={`px-2 py-0.5 rounded ${chartRange === 7 ? "bg-background shadow" : ""}`}>7 Days</button>
                <button onClick={() => setChartRange(14)} className={`px-2 py-0.5 rounded ${chartRange === 14 ? "bg-background shadow" : ""}`}>14 Days</button>
                <button onClick={() => setChartRange(30)} className={`px-2 py-0.5 rounded ${chartRange === 30 ? "bg-background shadow" : ""}`}>30 Days</button>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <ChartComponent data={customGraphData}>
              <defs>
                <linearGradient id="dSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="dProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="dExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `৳${v}`} width={50} />
              <Tooltip content={<ChartTooltip />} />
              <ChartDataElement type="monotone" dataKey={chartMetric} stroke={getMetricColor()} fill={chartType === "area" ? (chartMetric === "profit" ? "url(#dProfit)" : chartMetric === "expenses" ? "url(#dExpense)" : "url(#dSales)") : undefined} strokeWidth={2} name={t(chartMetric)} />
            </ChartComponent>
          </ResponsiveContainer>
        </Card>

        {/* Pie: Payment breakdown */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold mb-4">{t("payment_method_breakdown")}</h2>
            {pieData.length === 0 ? (
              <div className="h-44 flex items-center justify-center text-sm text-muted-foreground">{t("no_activity")}</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" paddingAngle={3}>
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => `৳${Number(v).toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {pieData.map(d => (
                    <div key={d.name} className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1">
                        <span className="size-2 rounded-full" style={{ background: d.color }} />
                        {d.name}
                      </span>
                      <span className="font-semibold">{fmtMoney(d.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Row 4: Reminders checklist panel + Low stock widgets + Top products */}
      <div className="grid grid-cols-3 gap-4">
        {/* Interactive Reminders / Tasks checklist */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-sm font-semibold flex items-center gap-1.5">
              <Calendar className="size-4 text-primary" /> {t("reminders")} & Tasks
            </h2>
          </div>

          <div className="space-y-3">
            {/* Low stock indicators */}
            {lowStockProducts.length > 0 && (
              <div className="space-y-1">
                <div className="text-[10px] text-destructive font-semibold uppercase">{t("low_stock_reminder")} ({lowStockProducts.length})</div>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {lowStockProducts.map(p => (
                    <div key={p.id} className="text-[10px] p-2 bg-rose-500/10 text-rose-700 dark:text-rose-300 rounded flex items-center justify-between">
                      <span className="font-medium">{p.name}</span>
                      <span>Stock: {p.stock} &lt;={p.min_stock ?? 5}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Outstanding customer collection alerts */}
            {dueAlertParties.length > 0 && (
              <div className="space-y-1">
                <div className="text-[10px] text-amber-500 font-semibold uppercase">{t("due_reminder")}</div>
                <div className="space-y-1">
                  {dueAlertParties.map(p => (
                    <Link key={p.id} href={`/parties/${p.id}`} className="block text-[10px] p-2 bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded flex items-center justify-between hover:bg-amber-500/15">
                      <span className="font-medium">{p.name}</span>
                      <span>{fmtMoney(p.outstanding)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Custom reminders list */}
            <div className="space-y-2 border-t pt-3.5">
              <div className="text-[10px] text-muted-foreground font-semibold uppercase">{t("custom_reminder")}</div>
              
              {/* Add form */}
              <form onSubmit={handleAddReminder} className="flex gap-1">
                <Input required className="h-8 text-xs flex-1" placeholder={t("add_reminder")} value={newReminderTitle} onChange={e => setNewReminderTitle(e.target.value)} />
                <Input type="date" className="h-8 text-xs w-28" value={newReminderDate} onChange={e => setNewReminderDate(e.target.value)} />
                <Button type="submit" disabled={reminderBusy} size="sm" className="h-8 px-2.5"><Plus className="size-4" /></Button>
              </form>

              {/* Items */}
              <div className="space-y-1.5 max-h-40 overflow-y-auto pt-1">
                {reminders.length === 0 && <p className="text-xs text-muted-foreground italic text-center py-2">No custom tasks</p>}
                {reminders.map(r => (
                  <div key={r.id} className="flex items-center justify-between p-2 border border-border rounded text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <button type="button" onClick={() => handleToggleReminder(r.id, !r.completed)}>
                        {r.completed ? <CheckSquare className="size-4 text-primary shrink-0" /> : <Square className="size-4 text-muted-foreground shrink-0" />}
                      </button>
                      <span className={`truncate ${r.completed ? "line-through text-muted-foreground" : "font-medium"}`}>{r.title}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 text-muted-foreground text-[10px]">
                      <span>{r.due_date}</span>
                      <button type="button" className="text-destructive hover:scale-105 active:scale-95" onClick={() => handleDeleteReminder(r.id)}><Trash2 className="size-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Best selling products bar chart */}
        <Card className="p-5">
          <h2 className="text-sm font-semibold mb-4">{t("best_selling")} (Revenue)</h2>
          {topDemandedProducts.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">{t("no_activity")}</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topDemandedProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9 }} tickFormatter={v => `৳${v}`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={80} />
                <Tooltip formatter={(v: any) => `৳${Number(v).toLocaleString()}`} />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} name="Sales revenue" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Recent Activity Table */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">{t("recent_activity")}</h2>
              <Link href="/sales" className="text-xs text-primary hover:underline">{t("view")} all →</Link>
            </div>
            {recentSales.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">{t("no_activity")}</div>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {recentSales.map(s => (
                  <div key={s.id} className="flex justify-between items-center py-1.5 border-b last:border-b-0 text-xs">
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold truncate">{s.product_name} <span className="text-muted-foreground">×{s.qty}</span></div>
                      <div className="text-[10px] text-muted-foreground">{fmtDateTime(s.created_at)}</div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <div className="font-bold">{fmtMoney(Number(s.sell_price) * s.qty)}</div>
                      <div className="text-[10px] text-emerald-600">+{fmtMoney(s.profit)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

