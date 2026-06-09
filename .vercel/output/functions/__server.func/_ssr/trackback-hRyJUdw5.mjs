import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-D_u1EXWn.mjs";
import { C as Card } from "./card-RGlIzTYo.mjs";
import { B as Button, I as Input } from "./input-BH1plDoj.mjs";
import { a as useT } from "./router-z4LwQaWn.mjs";
import { u as useCachedQuery } from "./use-cached-query-DaopYbTj.mjs";
import { a as getSales, c as getPurchases, d as getExpenses, e as getReturns, b as getParties } from "./queries-Lma9DoHe.mjs";
import { a as fmtMoney, f as fmtDateTime } from "./format-BibW3dNi.mjs";
import { d as downloadCsv, e as exportDateStamp } from "./export-DyymHhD-.mjs";
import { p as paginate, P as PaginationBar } from "./pagination-bar-A21-yJPk.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import { l as Download, C as ChartColumn } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, A as AreaChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as Area } from "../_libs/recharts.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
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
function startOfRange(range) {
  const d = /* @__PURE__ */ new Date();
  d.setHours(0, 0, 0, 0);
  if (range === "week") d.setDate(d.getDate() - 7);
  if (range === "month") d.setDate(d.getDate() - 30);
  if (range === "all") return /* @__PURE__ */ new Date(0);
  return d;
}
function inRange(dateStr, range, from, to) {
  const d = new Date(dateStr);
  if (from && d < new Date(from)) return false;
  if (to && d > /* @__PURE__ */ new Date(to + "T23:59:59")) return false;
  return d >= startOfRange(range);
}
function TrackbackPage() {
  const {
    t
  } = useT();
  const [range, setRange] = reactExports.useState("month");
  const [from, setFrom] = reactExports.useState("");
  const [to, setTo] = reactExports.useState("");
  const [page, setPage] = reactExports.useState(1);
  const pageSize = 15;
  const sales = useCachedQuery(["sales"], getSales);
  const purchases = useCachedQuery(["purchases"], getPurchases);
  const expenses = useCachedQuery(["expenses"], getExpenses);
  const returns = useCachedQuery(["returns"], getReturns);
  const parties = useCachedQuery(["parties"], getParties);
  const filteredSales = reactExports.useMemo(() => (sales.data ?? []).filter((s) => inRange(s.created_at, range, from, to)), [sales.data, range, from, to]);
  const chartData = reactExports.useMemo(() => {
    const map = {};
    for (const s of filteredSales) {
      const key = new Date(s.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      });
      if (!map[key]) map[key] = {
        sales: 0,
        profit: 0
      };
      map[key].sales += Number(s.sell_price) * s.qty;
      map[key].profit += Number(s.profit);
    }
    return Object.entries(map).map(([date, v]) => ({
      date,
      ...v
    }));
  }, [filteredSales]);
  const totals = reactExports.useMemo(() => ({
    sales: filteredSales.reduce((a, s) => a + Number(s.sell_price) * s.qty, 0),
    profit: filteredSales.reduce((a, s) => a + Number(s.profit), 0),
    count: filteredSales.length
  }), [filteredSales]);
  const {
    items: pagedSales,
    totalPages,
    safePage
  } = paginate(filteredSales, page, pageSize);
  function exportSalesCsv() {
    downloadCsv(`sales-${exportDateStamp()}.csv`, ["Date", "Product", "Qty", "Type", "Total", "Profit", "Due"], filteredSales.map((s) => [fmtDateTime(s.created_at), s.product_name, s.qty, s.type, Number(s.sell_price) * s.qty, s.profit, s.due_amount]));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold font-serif", children: t("trackback") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
          t("reports"),
          " · ",
          t("all_records")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "h-8 text-xs shrink-0", onClick: exportSalesCsv, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "icon-sm mr-1" }),
        t("download_csv")
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3 shadow-sm space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground", children: t("filter_date") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: ["today", "week", "month", "all"].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: range === r ? "default" : "outline", className: "h-7 text-xs px-2.5", onClick: () => {
        setRange(r);
        setPage(1);
      }, children: r === "today" ? t("today") : r === "week" ? t("this_week") : r === "month" ? t("this_month") : t("all_records") }, r)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", className: "h-8 text-xs", value: from, onChange: (e) => setFrom(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", className: "h-8 text-xs", value: to, onChange: (e) => setTo(e.target.value) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3 shadow-sm text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase", children: t("total_sales") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold mt-0.5", children: fmtMoney(totals.sales) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3 shadow-sm text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase", children: t("profit") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-success mt-0.5", children: fmtMoney(totals.profit) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3 shadow-sm text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase", children: t("sales") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold mt-0.5", children: totals.count })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "icon-sm text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold", children: t("daily_sales_trend") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 160, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: chartData, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "tbSales", x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: "oklch(0.6209 0.1801 348.1385)", stopOpacity: 0.35 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: "oklch(0.6209 0.1801 348.1385)", stopOpacity: 0 })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "oklch(0.88 0.05 212 / 0.5)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "date", tick: {
          fontSize: 9
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: {
          fontSize: 9
        }, width: 40, tickFormatter: (v) => `৳${v}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (v) => fmtMoney(v) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "sales", stroke: "oklch(0.6209 0.1801 348.1385)", fill: "url(#tbSales)", strokeWidth: 2 })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "sales", onValueChange: () => setPage(1), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid grid-cols-4 w-full h-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "sales", className: "text-[10px] px-1", children: t("sales") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "purchases", className: "text-[10px] px-1", children: t("purchases") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "expenses", className: "text-[10px] px-1", children: t("expenses") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "returns", className: "text-[10px] px-1", children: t("returns") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "sales", className: "mt-3 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "divide-y divide-border overflow-hidden shadow-sm", children: [
          pagedSales.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-6 text-center text-xs text-muted-foreground", children: t("no_sales") }),
          pagedSales.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2.5 flex justify-between gap-2 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium truncate", children: [
                s.product_name,
                " ×",
                s.qty
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
                fmtDateTime(s.created_at),
                " · ",
                s.type
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold shrink-0", children: fmtMoney(Number(s.sell_price) * s.qty) })
          ] }, s.id))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PaginationBar, { page: safePage, totalPages, total: filteredSales.length, pageSize, onPageChange: setPage })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "purchases", className: "mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RecordList, { items: (purchases.data ?? []).filter((p) => inRange(p.created_at, range, from, to)), render: (p) => ({
        label: `${p.product_name} ×${p.qty}`,
        sub: fmtDateTime(p.created_at),
        amount: fmtMoney(p.total)
      }), empty: t("no_activity") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "expenses", className: "mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RecordList, { items: (expenses.data ?? []).filter((e) => inRange(e.created_at, range, from, to)), render: (e) => ({
        label: e.title,
        sub: fmtDateTime(e.created_at),
        amount: fmtMoney(e.amount)
      }), empty: t("no_activity") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "returns", className: "mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RecordList, { items: (returns.data ?? []).filter((r) => inRange(r.created_at, range, from, to)), render: (r) => ({
        label: `${r.product_name} ×${r.qty}`,
        sub: fmtDateTime(r.created_at),
        amount: t("returned")
      }), empty: t("no_activity") }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground text-center", children: [
      parties.data?.length ?? 0,
      " ",
      t("parties"),
      " · cached locally"
    ] })
  ] });
}
function RecordList({
  items,
  render,
  empty
}) {
  const [page, setPage] = reactExports.useState(1);
  const {
    items: paged,
    totalPages,
    safePage
  } = paginate(items, page, 15);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "divide-y divide-border overflow-hidden shadow-sm", children: [
      paged.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-6 text-center text-xs text-muted-foreground", children: empty }),
      paged.map((item) => {
        const {
          label,
          sub,
          amount
        } = render(item);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2.5 flex justify-between gap-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium truncate", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: sub })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold shrink-0", children: amount })
        ] }, item.id);
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PaginationBar, { page: safePage, totalPages, total: items.length, pageSize: 15, onPageChange: setPage })
  ] });
}
export {
  TrackbackPage as component
};
