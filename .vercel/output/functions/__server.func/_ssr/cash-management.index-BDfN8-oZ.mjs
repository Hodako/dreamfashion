import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { C as Card } from "./card-RGlIzTYo.mjs";
import { B as Button, I as Input } from "./input-BH1plDoj.mjs";
import { a as getSales, d as getExpenses, h as getWithdrawals, i as getCashbox } from "./queries-Lma9DoHe.mjs";
import { u as useCachedQuery } from "./use-cached-query-DaopYbTj.mjs";
import { a as useT } from "./router-z4LwQaWn.mjs";
import { a as fmtMoney } from "./format-BibW3dNi.mjs";
import { c as cashboxBalance } from "./cashbox-utils-BlSelpLt.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import { B as Banknote, i as ChevronRight, W as Wallet, u as TrendingUp, R as Receipt, t as CircleAlert, x as ArrowUp, y as ArrowDown, l as Download, z as Code } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, A as AreaChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as Area, P as PieChart, b as Pie, c as Cell, B as BarChart, d as Bar } from "../_libs/recharts.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./server-DaU8DV72.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
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
function ChartTip({
  active,
  payload,
  label
}) {
  if (!active || !payload?.length) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background border border-border rounded-lg shadow-lg p-3 text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold mb-1", children: label }),
    payload.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full inline-block", style: {
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
function KPI({
  label,
  value,
  icon: Icon,
  color,
  sub
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 sm:p-5 flex items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-10 sm:size-11 rounded-xl ${color} flex items-center justify-center shrink-0`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-5 text-white" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg sm:text-xl font-bold mt-0.5", children: value }),
      sub && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: sub })
    ] })
  ] });
}
function RangePill({
  label,
  active,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick, className: `px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`, children: label });
}
function CashManagementPage() {
  const {
    t
  } = useT();
  const sales = useCachedQuery(["sales"], getSales);
  const expenses = useCachedQuery(["expenses"], getExpenses);
  const withdrawals = useCachedQuery(["withdrawals"], getWithdrawals);
  const cashbox = useCachedQuery(["cashbox"], getCashbox);
  const balance = cashboxBalance(cashbox.data ?? []);
  const [range, setRange] = reactExports.useState("week");
  const [startDate, setStartDate] = reactExports.useState("");
  const [endDate, setEndDate] = reactExports.useState("");
  const {
    from,
    to
  } = reactExports.useMemo(() => {
    const end = /* @__PURE__ */ new Date();
    end.setHours(23, 59, 59, 999);
    const start = /* @__PURE__ */ new Date();
    if (range === "today") start.setHours(0, 0, 0, 0);
    if (range === "week") {
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
    }
    if (range === "month") {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
    }
    if (range === "custom") {
      return {
        from: startDate ? new Date(startDate) : /* @__PURE__ */ new Date(0),
        to: endDate ? /* @__PURE__ */ new Date(endDate + "T23:59:59") : end
      };
    }
    return {
      from: start,
      to: end
    };
  }, [range, startDate, endDate]);
  const inRange = (d) => {
    const dt = new Date(d);
    return dt >= from && dt <= to;
  };
  const filtSales = reactExports.useMemo(() => (sales.data ?? []).filter((s) => inRange(s.created_at)), [sales.data, from, to]);
  const filtExp = reactExports.useMemo(() => (expenses.data ?? []).filter((e) => inRange(e.created_at)), [expenses.data, from, to]);
  const filtWith = reactExports.useMemo(() => (withdrawals.data ?? []).filter((w) => inRange(w.created_at)), [withdrawals.data, from, to]);
  const cashSales = filtSales.filter((s) => s.type === "cash").reduce((a, s) => a + Number(s.sell_price) * s.qty, 0);
  const onlineSales = filtSales.filter((s) => s.type === "online").reduce((a, s) => a + Number(s.sell_price) * s.qty, 0);
  const creditSales = filtSales.filter((s) => s.type === "credit").reduce((a, s) => a + Number(s.due_amount), 0);
  const totalSales = cashSales + onlineSales + creditSales;
  const totalExp = filtExp.reduce((a, e) => a + Number(e.amount), 0);
  const totalWith = filtWith.reduce((a, w) => a + Number(w.amount), 0);
  const profit = filtSales.reduce((a, s) => a + Number(s.profit), 0);
  const dayCount = range === "today" ? 1 : range === "week" ? 7 : range === "month" ? 30 : 14;
  const dailyData = reactExports.useMemo(() => {
    const map = {};
    for (let i = dayCount - 1; i >= 0; i--) {
      const d = /* @__PURE__ */ new Date();
      d.setDate(d.getDate() - i);
      const k = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      });
      map[k] = {
        cash: 0,
        online: 0,
        credit: 0,
        expense: 0
      };
    }
    filtSales.forEach((s) => {
      const k = new Date(s.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      });
      if (!map[k]) return;
      if (s.type === "cash") map[k].cash += Number(s.sell_price) * s.qty;
      if (s.type === "online") map[k].online += Number(s.sell_price) * s.qty;
      if (s.type === "credit") map[k].credit += Number(s.due_amount);
    });
    filtExp.forEach((e) => {
      const k = new Date(e.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      });
      if (map[k]) map[k].expense += Number(e.amount);
    });
    return Object.entries(map).map(([date, v]) => ({
      date,
      ...v
    }));
  }, [filtSales, filtExp, dayCount]);
  const pieData = [{
    name: t("cash"),
    value: cashSales,
    color: "#6366f1"
  }, {
    name: t("online_sell"),
    value: onlineSales,
    color: "#10b981"
  }, {
    name: t("credit_sale"),
    value: creditSales,
    color: "#f59e0b"
  }].filter((d) => d.value > 0);
  const flowData = dailyData.map((d) => ({
    date: d.date,
    আয়: d.cash + d.online,
    খরচ: -d.expense
  }));
  function exportCSV() {
    const rows = [["Date", "Type", "Product", "Qty", "Amount", "Profit"]];
    filtSales.forEach((s) => rows.push([new Date(s.created_at).toLocaleDateString(), s.type, s.product_name, String(s.qty), String(Number(s.sell_price) * s.qty), String(s.profit)]));
    filtExp.forEach((e) => rows.push([new Date(e.created_at).toLocaleDateString(), "Expense", e.title, "1", String(e.amount), "0"]));
    filtWith.forEach((w) => rows.push([new Date(w.created_at).toLocaleDateString(), "Withdrawal", w.note ?? "Owner", "1", String(w.amount), "0"]));
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], {
      type: "text/csv"
    }));
    a.download = `cash-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
    a.click();
  }
  function exportJSON() {
    const data = {
      summary: {
        cashSales,
        onlineSales,
        creditSales,
        totalSales,
        totalExp,
        totalWith,
        cashboxBalance: balance,
        profit
      },
      sales: filtSales,
      expenses: filtExp,
      withdrawals: filtWith
    };
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    }));
    a.download = `cash-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
    a.click();
  }
  const rangeLabel = range === "today" ? t("today") : range === "week" ? t("this_week") : t("this_month");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 pb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 glass-card border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-xl bg-indigo-500 grid place-items-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { className: "size-5 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            t("cashbox"),
            " — ",
            t("balance")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-indigo-600 mt-0.5", children: fmtMoney(balance) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cash-management/cashbox", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "border-indigo-500/30", children: [
        t("view_details"),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4 ml-1" })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl sm:text-2xl font-bold", children: t("cash_management") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Sales & expense analytics" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RangePill, { label: t("today"), active: range === "today", onClick: () => setRange("today") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RangePill, { label: t("this_week"), active: range === "week", onClick: () => setRange("week") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RangePill, { label: t("this_month"), active: range === "month", onClick: () => setRange("month") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RangePill, { label: t("custom"), active: range === "custom", onClick: () => setRange("custom") }),
        range === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 w-full sm:w-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value), className: "flex-1 sm:w-36 h-8 text-xs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: endDate, onChange: (e) => setEndDate(e.target.value), className: "flex-1 sm:w-36 h-8 text-xs" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { label: t("cashbox"), value: fmtMoney(balance), icon: Wallet, color: "bg-indigo-500", sub: t("balance") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { label: t("total_sales"), value: fmtMoney(totalSales), icon: TrendingUp, color: "bg-emerald-500", sub: rangeLabel }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { label: t("expense"), value: fmtMoney(totalExp), icon: Receipt, color: "bg-rose-500", sub: rangeLabel }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { label: t("profit"), value: fmtMoney(profit), icon: CircleAlert, color: "bg-amber-500", sub: rangeLabel })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 sm:gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3 sm:p-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] sm:text-xs text-muted-foreground mb-1", children: t("cash") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm sm:text-lg font-bold text-indigo-600", children: fmtMoney(cashSales) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3 sm:p-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] sm:text-xs text-muted-foreground mb-1", children: t("online_sell") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm sm:text-lg font-bold text-emerald-600", children: fmtMoney(onlineSales) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3 sm:p-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] sm:text-xs text-muted-foreground mb-1", children: t("credit_sale") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm sm:text-lg font-bold text-amber-600", children: fmtMoney(creditSales) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "lg:col-span-2 p-4 sm:p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold mb-4", children: t("daily_sales_trend") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 220, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: dailyData, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "cmCash", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: "#6366f1", stopOpacity: 0.25 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: "#6366f1", stopOpacity: 0 })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border))" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "date", tick: {
            fontSize: 10
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: {
            fontSize: 10
          }, tickFormatter: (v) => `৳${(v / 1e3).toFixed(0)}k`, width: 48 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartTip, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "cash", stroke: "#6366f1", fill: "url(#cmCash)", strokeWidth: 2, name: t("cash") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "online", stroke: "#10b981", fill: "none", strokeWidth: 2, name: t("online_sell") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "expense", stroke: "#f43f5e", fill: "none", strokeWidth: 1.5, strokeDasharray: "4 2", name: t("expense") })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 sm:p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold mb-4", children: t("payment_method_breakdown") }),
        pieData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-48 flex items-center justify-center text-sm text-muted-foreground", children: t("no_activity") }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 170, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: pieData, cx: "50%", cy: "50%", innerRadius: 45, outerRadius: 75, dataKey: "value", paddingAngle: 3, children: pieData.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: entry.color }, i)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (v) => `৳${Number(v).toLocaleString()}` })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5 mt-1", children: pieData.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 sm:p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold", children: t("monthly_cash_flow") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "size-3 text-emerald-500" }),
            t("income")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "size-3 text-rose-500" }),
            t("expense")
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 200, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: flowData, barGap: 2, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border))" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "date", tick: {
          fontSize: 10
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: {
          fontSize: 10
        }, tickFormatter: (v) => `৳${Math.abs(v / 1e3).toFixed(0)}k`, width: 48 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartTip, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "আয়", fill: "#10b981", radius: [4, 4, 0, 0] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "খরচ", fill: "#f43f5e", radius: [4, 4, 0, 0] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-end gap-2 sm:gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: exportCSV, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4 mr-2" }),
        " ",
        t("export_csv")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: exportJSON, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "size-4 mr-2" }),
        " ",
        t("export_json")
      ] })
    ] })
  ] });
}
export {
  CashManagementPage as component
};
