import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useCachedQuery } from "./use-cached-query-DaopYbTj.mjs";
import { a as useT, u as useAuth } from "./router-z4LwQaWn.mjs";
import { a as getSales, d as getExpenses, h as getWithdrawals, i as getCashbox, g as getProducts, b as getParties } from "./queries-Lma9DoHe.mjs";
import { c as cashboxBalance } from "./cashbox-utils-BlSelpLt.mjs";
import { a as fmtMoney, f as fmtDateTime } from "./format-BibW3dNi.mjs";
import { C as Card } from "./card-RGlIzTYo.mjs";
import { u as useIsMobile } from "./use-mobile-D7iZtuRK.mjs";
import { r as resolvePermissions, c as canAccess } from "./permissions-Dq-yqX07.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import { W as Wallet, t as CircleAlert, u as TrendingUp, R as Receipt, B as Banknote, b as Package, c as ShoppingBag, U as Users, D as DollarSign, A as ArrowUpRight, v as ArrowDownRight } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, A as AreaChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as Area, P as PieChart, b as Pie, c as Cell, B as BarChart, d as Bar } from "../_libs/recharts.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./server-DaU8DV72.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/lodash.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
function startOf(days) {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
}
function todayStart() {
  const d = /* @__PURE__ */ new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
function dayLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
}
function groupByDay(sales, days) {
  const result = {};
  const from = startOf(days);
  for (let i = days - 1; i >= 0; i--) {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
    result[key] = {
      cash: 0,
      credit: 0,
      online: 0,
      profit: 0
    };
  }
  for (const s of sales) {
    if (new Date(s.created_at) < from) continue;
    const key = dayLabel(s.created_at);
    if (!result[key]) continue;
    const total = Number(s.sell_price) * s.qty;
    result[key][s.type] += total;
    result[key].profit += Number(s.profit);
  }
  return Object.entries(result).map(([date, v]) => ({
    date,
    ...v
  }));
}
function KPICard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
  trendUp,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 flex flex-col gap-3 hover:shadow-md transition-shadow", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-9 rounded-lg ${color} flex items-center justify-center`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4 text-white" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold tracking-tight", children: value }),
      sub && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: sub })
    ] }),
    trend && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-1 text-xs font-medium ${trendUp ? "text-emerald-600" : "text-red-500"}`, children: [
      trendUp ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "size-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownRight, { className: "size-3.5" }),
      trend
    ] })
  ] });
}
function ChartTooltip({
  active,
  payload,
  label
}) {
  if (!active || !payload?.length) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background border border-border rounded-lg shadow-lg p-3 text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold mb-1.5", children: label }),
    payload.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-2 rounded-full", style: {
        background: p.color
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground capitalize", children: [
        p.name,
        ":"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
        "৳",
        Number(p.value).toLocaleString()
      ] })
    ] }, p.name))
  ] });
}
function Dashboard() {
  const {
    t
  } = useT();
  const {
    user
  } = useAuth();
  const perms = resolvePermissions(user?.role ?? "employee", user?.permissions);
  const isMobile = useIsMobile();
  const sales = useCachedQuery(["sales"], getSales);
  const expenses = useCachedQuery(["expenses"], getExpenses);
  const withdrawals = useCachedQuery(["withdrawals"], getWithdrawals);
  const cashbox = useCachedQuery(["cashbox"], getCashbox);
  const products = useCachedQuery(["products"], getProducts);
  const parties = useCachedQuery(["parties"], getParties);
  const allSales = sales.data ?? [];
  const allExpenses = expenses.data ?? [];
  withdrawals.data ?? [];
  const today = todayStart();
  const week = startOf(7);
  const month = startOf(30);
  const cashToday = allSales.filter((s) => new Date(s.created_at) >= today && s.type === "cash").reduce((a, s) => a + Number(s.sell_price) * s.qty, 0);
  const creditToday = allSales.filter((s) => new Date(s.created_at) >= today && s.type === "credit").reduce((a, s) => a + Number(s.due_amount), 0);
  const onlineToday = allSales.filter((s) => new Date(s.created_at) >= today && s.type === "online").reduce((a, s) => a + Number(s.sell_price) * s.qty, 0);
  const profitWeek = allSales.filter((s) => new Date(s.created_at) >= week).reduce((a, s) => a + Number(s.profit), 0);
  const profitMonth = allSales.filter((s) => new Date(s.created_at) >= month).reduce((a, s) => a + Number(s.profit), 0);
  const totalDues = allSales.reduce((a, s) => a + Number(s.due_amount), 0);
  const expenseToday = allExpenses.filter((e) => new Date(e.created_at) >= today).reduce((a, e) => a + Number(e.amount), 0);
  const cashboxTotal = cashboxBalance(cashbox.data ?? []);
  const chartDays = isMobile ? 7 : 14;
  const dailyData = groupByDay(allSales, chartDays);
  const cashTotal = allSales.filter((s) => s.type === "cash").reduce((a, s) => a + Number(s.sell_price) * s.qty, 0);
  const creditTotal = allSales.filter((s) => s.type === "credit").reduce((a, s) => a + Number(s.sell_price) * s.qty, 0);
  const onlineTotal = allSales.filter((s) => s.type === "online").reduce((a, s) => a + Number(s.sell_price) * s.qty, 0);
  const pieData = [{
    name: t("cash"),
    value: cashTotal,
    color: "#6366f1"
  }, {
    name: t("credit"),
    value: creditTotal,
    color: "#f59e0b"
  }, {
    name: t("online_sell"),
    value: onlineTotal,
    color: "#10b981"
  }].filter((d) => d.value > 0);
  const recent = [...allSales].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 8);
  const productRevMap = {};
  for (const s of allSales) {
    productRevMap[s.product_name] = (productRevMap[s.product_name] ?? 0) + Number(s.sell_price) * s.qty;
  }
  const topProducts = Object.entries(productRevMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({
    name,
    value
  }));
  if (isMobile) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold", children: t("dashboard") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric"
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { label: t("cash_sale"), value: fmtMoney(cashToday), sub: t("today"), icon: Wallet, color: "bg-indigo-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { label: t("credit_sale"), value: fmtMoney(creditToday), sub: t("today"), icon: CircleAlert, color: "bg-amber-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { label: t("profit"), value: fmtMoney(profitWeek), sub: t("this_week"), icon: TrendingUp, color: "bg-emerald-500" }),
        canAccess(perms, "expenses") && /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { label: t("expense"), value: fmtMoney(expenseToday), sub: t("today"), icon: Receipt, color: "bg-rose-500" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        canAccess(perms, "expenses") ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cash-management/cashbox", className: "block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { label: t("cashbox"), value: fmtMoney(cashboxTotal), icon: Banknote, color: "bg-indigo-600", trendUp: cashboxTotal >= 0, trend: t("balance") }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { label: t("cash_sale"), value: fmtMoney(cashToday), sub: t("today"), icon: Wallet, color: "bg-indigo-600" }),
        canAccess(perms, "parties") && /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { label: t("due"), value: fmtMoney(totalDues), icon: CircleAlert, color: "bg-amber-600", trendUp: false })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold mb-3", children: [
          t("daily_sales_trend"),
          " (7d)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 180, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: dailyData, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "gcash", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: "#6366f1", stopOpacity: 0.3 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: "#6366f1", stopOpacity: 0 })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border))" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "date", tick: {
            fontSize: 9
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: {
            fontSize: 9
          }, tickFormatter: (v) => `৳${v}`, width: 45 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartTooltip, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "cash", stroke: "#6366f1", fill: "url(#gcash)", strokeWidth: 2, name: t("cash") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "online", stroke: "#10b981", fill: "none", strokeWidth: 2, name: t("online_sell") })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: [{
        to: "/products",
        icon: Package,
        label: t("products"),
        perm: "products"
      }, {
        to: "/sales",
        icon: ShoppingBag,
        label: t("sales"),
        perm: "sales"
      }, {
        to: "/parties",
        icon: Users,
        label: t("parties"),
        perm: "parties"
      }].filter((item) => canAccess(perms, item.perm)).map(({
        to,
        icon: Icon,
        label
      }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, className: "flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border bg-card hover:bg-accent transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-center", children: label })
      ] }, to)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: t("recent_activity") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "divide-y divide-border overflow-hidden", children: [
          recent.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-center text-sm text-muted-foreground", children: t("no_activity") }),
          recent.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium truncate text-sm", children: s.product_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                s.type === "cash" ? t("cash") : s.type === "online" ? t("online_sell") : t("credit"),
                " · ",
                fmtDateTime(s.created_at)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: fmtMoney(Number(s.sell_price) * s.qty) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-emerald-600", children: [
                "+",
                fmtMoney(s.profit)
              ] })
            ] })
          ] }, s.id))
        ] })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: t("dashboard") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/sales", className: "inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "size-4" }),
        t("new_sale")
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-5 gap-4", children: [
      canAccess(perms, "expenses") ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cash-management/cashbox", className: "block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { label: t("cashbox"), value: fmtMoney(cashboxTotal), icon: Banknote, color: "bg-indigo-500", trendUp: cashboxTotal >= 0, trend: t("balance") }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { label: t("cash_sale"), value: fmtMoney(cashToday), sub: t("today"), icon: Wallet, color: "bg-indigo-500", trendUp: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { label: t("cash_sale"), value: fmtMoney(cashToday), sub: t("today"), icon: DollarSign, color: "bg-emerald-500", trendUp: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { label: t("online_sell"), value: fmtMoney(onlineToday), sub: t("today"), icon: TrendingUp, color: "bg-sky-500", trendUp: true }),
      canAccess(perms, "parties") && /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { label: t("due"), value: fmtMoney(totalDues), icon: CircleAlert, color: "bg-amber-500", trendUp: false, trend: "Outstanding" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { label: t("profit"), value: fmtMoney(profitMonth), sub: t("this_month"), icon: Banknote, color: "bg-violet-500", trendUp: true })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { label: t("credit_sale"), value: fmtMoney(creditToday), sub: t("today"), icon: Receipt, color: "bg-rose-500", trendUp: false }),
      canAccess(perms, "expenses") && /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { label: t("expense"), value: fmtMoney(expenseToday), sub: t("today"), icon: Receipt, color: "bg-orange-500", trendUp: false }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { label: t("products"), value: String(products.data?.length ?? "—"), sub: "Total SKUs", icon: Package, color: "bg-teal-500", trendUp: true }),
      canAccess(perms, "parties") && /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { label: t("parties"), value: String(parties.data?.length ?? "—"), sub: "Total", icon: Users, color: "bg-pink-500", trendUp: true })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "col-span-2 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold", children: [
            t("daily_sales_trend"),
            " (14d)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full bg-indigo-500 inline-block" }),
              t("cash")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full bg-amber-500 inline-block" }),
              t("credit")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full bg-emerald-500 inline-block" }),
              t("online_sell")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 220, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: dailyData, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "gCash", x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: "#6366f1", stopOpacity: 0.25 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: "#6366f1", stopOpacity: 0 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "gCredit", x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: "#f59e0b", stopOpacity: 0.2 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: "#f59e0b", stopOpacity: 0 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "gOnline", x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: "#10b981", stopOpacity: 0.2 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: "#10b981", stopOpacity: 0 })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border))" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "date", tick: {
            fontSize: 11
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: {
            fontSize: 11
          }, tickFormatter: (v) => `৳${(v / 1e3).toFixed(0)}k`, width: 50 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartTooltip, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "cash", stroke: "#6366f1", fill: "url(#gCash)", strokeWidth: 2, name: t("cash") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "credit", stroke: "#f59e0b", fill: "url(#gCredit)", strokeWidth: 2, name: t("credit") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "online", stroke: "#10b981", fill: "url(#gOnline)", strokeWidth: 2, name: t("online_sell") })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold mb-4", children: t("payment_method_breakdown") }),
        pieData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-48 flex items-center justify-center text-sm text-muted-foreground", children: t("no_activity") }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 180, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: pieData, cx: "50%", cy: "50%", innerRadius: 50, outerRadius: 80, dataKey: "value", paddingAngle: 3, children: pieData.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: entry.color }, i)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (v) => `৳${Number(v).toLocaleString()}` })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 mt-2", children: pieData.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2.5 rounded-full", style: {
                background: d.color
              } }),
              d.name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: fmtMoney(d.value) })
          ] }, d.name)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold mb-4", children: "Top Products by Revenue" }),
        topProducts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-40 flex items-center justify-center text-sm text-muted-foreground", children: t("no_activity") }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 200, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: topProducts, layout: "vertical", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border))", horizontal: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { type: "number", tick: {
            fontSize: 10
          }, tickFormatter: (v) => `৳${(v / 1e3).toFixed(0)}k` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { type: "category", dataKey: "name", tick: {
            fontSize: 10
          }, width: 80 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (v) => `৳${Number(v).toLocaleString()}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "value", fill: "#6366f1", radius: [0, 4, 4, 0], name: "Revenue" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "col-span-2 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold", children: t("recent_activity") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/sales", className: "text-xs text-primary hover:underline", children: [
            t("view"),
            " all →"
          ] })
        ] }),
        recent.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-10 text-center text-sm text-muted-foreground", children: t("no_activity") }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 text-xs font-medium text-muted-foreground uppercase tracking-wide pb-2 border-b border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Product" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: "Amount" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: recent.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 py-2.5 text-sm items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium truncate pr-2", children: s.product_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.type === "cash" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" : s.type === "online" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"}`, children: s.type === "cash" ? t("cash") : s.type === "online" ? t("online_sell") : t("credit") }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: fmtDateTime(s.created_at) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: fmtMoney(Number(s.sell_price) * s.qty) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-emerald-600", children: [
                "+",
                fmtMoney(s.profit)
              ] })
            ] })
          ] }, s.id)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold mb-4", children: [
        t("profit"),
        " — ",
        t("daily_sales_trend"),
        " (14d)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 160, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: dailyData, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border))" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "date", tick: {
          fontSize: 11
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: {
          fontSize: 11
        }, tickFormatter: (v) => `৳${(v / 1e3).toFixed(0)}k`, width: 50 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartTooltip, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "profit", fill: "#10b981", radius: [4, 4, 0, 0], name: t("profit") })
      ] }) })
    ] })
  ] });
}
export {
  Dashboard as component
};
