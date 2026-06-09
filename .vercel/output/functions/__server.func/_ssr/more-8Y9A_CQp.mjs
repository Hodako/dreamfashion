import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { a as useT, u as useAuth, b as useTheme, m as createWithdrawalFn } from "./router-z4LwQaWn.mjs";
import { u as useIsMobile } from "./use-mobile-D7iZtuRK.mjs";
import { r as resolvePermissions, c as canAccess } from "./permissions-Dq-yqX07.mjs";
import { u as useCachedQuery } from "./use-cached-query-DaopYbTj.mjs";
import { C as Card } from "./card-RGlIzTYo.mjs";
import { B as Button, I as Input } from "./input-BH1plDoj.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-DRM9Vy7D.mjs";
import { d as getExpenses, f as getSomiti, h as getWithdrawals, b as getParties, a as getSales, c as getPurchases } from "./queries-Lma9DoHe.mjs";
import { a as fmtMoney, f as fmtDateTime } from "./format-BibW3dNi.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { d as downloadCsv, e as exportDateStamp } from "./export-DyymHhD-.mjs";
import "../_libs/seroval.mjs";
import { f as Settings, C as ChartColumn, D as DollarSign, B as Banknote, d as ShoppingCart, U as Users, R as Receipt, e as PiggyBank, r as HandCoins, l as Download, S as Sun, M as Moon, s as Monitor, i as ChevronRight } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "./server-DaU8DV72.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
function inRange(iso, from, to) {
  const d = iso.slice(0, 10);
  if (from && d < from) return false;
  if (to && d > to) return false;
  return true;
}
function defaultRange() {
  const to = /* @__PURE__ */ new Date();
  const from = /* @__PURE__ */ new Date();
  from.setDate(from.getDate() - 30);
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
}
function ReportsPanel() {
  const { t } = useT();
  const { user } = useAuth();
  const perms = resolvePermissions(user?.role ?? "employee", user?.permissions);
  const canView = canAccess(perms, "reports");
  const range = defaultRange();
  const [from, setFrom] = reactExports.useState(range.from);
  const [to, setTo] = reactExports.useState(range.to);
  const { data: sales = [] } = useCachedQuery(["sales"], getSales, { enabled: canView });
  const { data: purchases = [] } = useCachedQuery(["purchases"], getPurchases, { enabled: canView });
  const filteredSales = reactExports.useMemo(() => sales.filter((s) => inRange(s.created_at, from, to)), [sales, from, to]);
  const filteredPurchases = reactExports.useMemo(() => purchases.filter((p) => inRange(p.created_at, from, to)), [purchases, from, to]);
  const salesTotal = filteredSales.reduce((a, s) => a + Number(s.sell_price) * s.qty, 0);
  const salesProfit = filteredSales.reduce((a, s) => a + Number(s.profit), 0);
  const purchaseTotal = filteredPurchases.reduce((a, p) => a + Number(p.total), 0);
  function exportSales() {
    downloadCsv(
      `sales-${exportDateStamp()}.csv`,
      ["Date", "Product", "Qty", "Sell", "Profit", "Type", "Due"],
      filteredSales.map((s) => [
        fmtDateTime(s.created_at),
        s.product_name,
        s.qty,
        Number(s.sell_price) * s.qty,
        s.profit,
        s.type,
        s.due_amount
      ])
    );
  }
  function exportPurchases() {
    downloadCsv(
      `purchases-${exportDateStamp()}.csv`,
      ["Date", "Product", "Qty", "Unit cost", "Total"],
      filteredPurchases.map((p) => [
        fmtDateTime(p.created_at),
        p.product_name,
        p.qty,
        p.unit_cost,
        p.total
      ])
    );
  }
  if (!canView) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card p-3 space-y-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "size-4 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-sm", children: t("reports") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-[10px] text-muted-foreground", children: [
          t("filter_date"),
          " (from)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", className: "h-8 text-xs", value: from, onChange: (e) => setFrom(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-[10px] text-muted-foreground", children: [
          t("filter_date"),
          " (to)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", className: "h-8 text-xs", value: to, onChange: (e) => setTo(e.target.value) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 text-center text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-primary/10 p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-[10px]", children: t("sales") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm", children: fmtMoney(salesTotal) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[9px] text-muted-foreground", children: [
          filteredSales.length,
          " ",
          t("records")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-success/10 p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-[10px]", children: t("profit") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm text-success", children: fmtMoney(salesProfit) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-secondary p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-[10px]", children: t("purchases") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm", children: fmtMoney(purchaseTotal) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[9px] text-muted-foreground", children: [
          filteredPurchases.length,
          " ",
          t("records")
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "h-8 text-xs", onClick: exportSales, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3 mr-1" }),
        t("export_sales_csv")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "h-8 text-xs", onClick: exportPurchases, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3 mr-1" }),
        t("export_buys_csv")
      ] })
    ] })
  ] });
}
function usePartyOutstanding(enabled) {
  const parties = useCachedQuery(["parties"], getParties, {
    enabled
  });
  const sales = useCachedQuery(["sales"], getSales);
  const duesByParty = {};
  (sales.data ?? []).forEach((s) => {
    if (s.party_id) duesByParty[s.party_id] = (duesByParty[s.party_id] ?? 0) + Number(s.due_amount);
  });
  const totalRaw = Object.values(duesByParty).reduce((a, b) => a + b, 0);
  return {
    totalRaw,
    partyCount: parties.data?.length ?? 0,
    isLoading: parties.isLoading || sales.isLoading
  };
}
function SectionTitle({
  icon: Icon,
  title,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-7 rounded-lg ${color} flex items-center justify-center`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-3.5 text-white" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-sm", children: title })
  ] });
}
function NavCard({
  to,
  icon: Icon,
  label,
  badge,
  badgeColor = "text-warning"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to, className: "block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 flex items-center justify-between hover:bg-accent/50 transition-colors cursor-pointer active:scale-[0.98]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-lg bg-primary/10 text-primary grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm", children: label })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      badge && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-bold ${badgeColor}`, children: badge }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4 text-muted-foreground" })
    ] })
  ] }) });
}
function ThemeCard() {
  const {
    t
  } = useT();
  const {
    theme,
    setTheme
  } = useTheme();
  const modes = [{
    id: "light",
    icon: Sun,
    label: t("theme_light")
  }, {
    id: "dark",
    icon: Moon,
    label: t("theme_dark")
  }, {
    id: "system",
    icon: Monitor,
    label: t("theme_system")
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-sm", children: t("appearance") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: modes.map(({
      id,
      icon: Icon,
      label
    }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setTheme(id), className: `flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs font-medium transition-colors ${theme === id ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-accent/50"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }),
      label
    ] }, id)) })
  ] });
}
function MorePage() {
  const {
    t
  } = useT();
  const {
    user
  } = useAuth();
  const perms = resolvePermissions(user?.role ?? "employee", user?.permissions);
  const isMobile = useIsMobile();
  const showParties = canAccess(perms, "parties");
  const showExpenses = canAccess(perms, "expenses");
  const showReports = canAccess(perms, "reports");
  const showSettings = canAccess(perms, "settings");
  const showPurchases = canAccess(perms, "purchases");
  const expenses = useCachedQuery(["expenses"], getExpenses, {
    enabled: showExpenses
  });
  const somiti = useCachedQuery(["somiti"], getSomiti, {
    enabled: showExpenses
  });
  const withdrawals = useCachedQuery(["withdrawals"], getWithdrawals, {
    enabled: showExpenses
  });
  const {
    totalRaw: partyDues,
    partyCount
  } = usePartyOutstanding(showParties);
  const [withdrawOpen, setWithdrawOpen] = reactExports.useState(false);
  const totalExpense = (expenses.data ?? []).reduce((a, e) => a + Number(e.amount), 0);
  const somitiBalance = (somiti.data ?? []).reduce((a, e) => a + (e.kind === "deposit" ? 1 : -1) * Number(e.amount), 0);
  const totalWithdrawal = (withdrawals.data ?? []).reduce((a, w) => a + Number(w.amount), 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: t("more") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: user?.role === "owner" ? "Owner sections" : t("more") })
    ] }),
    showReports && /* @__PURE__ */ jsxRuntimeExports.jsx(ReportsPanel, {}),
    isMobile && /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeCard, {}),
    isMobile && (showSettings || showReports) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { icon: Settings, title: t("settings"), color: "bg-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        showSettings && /* @__PURE__ */ jsxRuntimeExports.jsx(NavCard, { to: "/settings", icon: Settings, label: t("settings") }),
        showReports && /* @__PURE__ */ jsxRuntimeExports.jsx(NavCard, { to: "/trackback", icon: ChartColumn, label: t("trackback") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/online-sells", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 hover:bg-accent/50 transition-colors cursor-pointer active:scale-[0.98]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-lg bg-emerald-500/10 text-emerald-600 grid place-items-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "size-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: t("online_sell") })
      ] }) }),
      showExpenses && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cash-management/cashbox", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 hover:bg-accent/50 transition-colors cursor-pointer active:scale-[0.98]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-lg bg-indigo-500/10 text-indigo-600 grid place-items-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { className: "size-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: t("cashbox") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground mt-0.5", children: [
          t("add_money"),
          " / ",
          t("take_money")
        ] })
      ] }) }),
      showPurchases && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/purchases", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 hover:bg-accent/50 transition-colors cursor-pointer active:scale-[0.98]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-lg bg-sky-500/10 text-sky-600 grid place-items-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "size-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: t("new_purchase") })
      ] }) }),
      isMobile && showReports && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/trackback", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card p-4 hover:bg-accent/50 transition-colors cursor-pointer active:scale-[0.98]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-lg bg-primary/15 text-primary grid place-items-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "size-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: t("trackback") })
      ] }) }),
      isMobile && showSettings && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/settings", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card p-4 hover:bg-accent/50 transition-colors cursor-pointer active:scale-[0.98]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-lg bg-primary/15 text-primary grid place-items-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "size-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: t("settings") })
      ] }) }),
      showParties && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/parties", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 hover:bg-accent/50 transition-colors cursor-pointer active:scale-[0.98]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-lg bg-amber-500/10 text-amber-600 grid place-items-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: t("party_collection") }),
        partyDues > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-bold text-amber-600 mt-1", children: [
          fmtMoney(partyDues),
          " বাকী"
        ] })
      ] }) })
    ] }),
    showParties && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { icon: Users, title: `${t("party_collection")} — ${partyCount} পার্টি`, color: "bg-amber-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: t("total_owed") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-amber-600 mt-0.5", children: fmtMoney(partyDues) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/parties", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "border-amber-500/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-3.5 mr-1" }),
          "সব পার্টি"
        ] }) })
      ] }) })
    ] }),
    showExpenses && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { icon: Receipt, title: "দোকান খরচ", color: "bg-rose-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 bg-gradient-to-br from-rose-500/10 to-rose-500/5 border-rose-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            t("total"),
            " খরচ"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-rose-600 mt-0.5", children: fmtMoney(totalExpense) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/expenses", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "border-rose-500/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "size-3.5 mr-1" }),
          "দেখুন"
        ] }) })
      ] }) }),
      (expenses.data ?? []).slice(0, 3).map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-1 py-1.5 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: e.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground ml-2", children: fmtDateTime(e.created_at) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-rose-600", children: [
          "−",
          fmtMoney(e.amount)
        ] })
      ] }, e.id))
    ] }),
    showExpenses && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { icon: PiggyBank, title: t("somiti"), color: "bg-violet-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 bg-gradient-to-br from-violet-500/10 to-violet-500/5 border-violet-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: t("balance") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-2xl font-bold mt-0.5 ${somitiBalance >= 0 ? "text-violet-600" : "text-destructive"}`, children: fmtMoney(somitiBalance) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/somiti", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "border-violet-500/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PiggyBank, { className: "size-3.5 mr-1" }),
            "দেখুন"
          ] }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { icon: HandCoins, title: t("owner_withdraw"), color: "bg-indigo-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              t("total"),
              " উত্তোলন"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-indigo-600 mt-0.5", children: fmtMoney(totalWithdrawal) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => setWithdrawOpen(true), className: "bg-indigo-600 hover:bg-indigo-700 text-white", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(HandCoins, { className: "size-3.5 mr-1" }),
            t("add")
          ] })
        ] }) }),
        (withdrawals.data ?? []).slice(0, 4).map((w) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-1 py-1.5 text-sm border-b border-border last:border-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: w.note || t("owner_withdraw") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground ml-2", children: fmtDateTime(w.created_at) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-indigo-600", children: fmtMoney(w.amount) })
        ] }, w.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(WithdrawDialog, { open: withdrawOpen, onOpenChange: setWithdrawOpen })
    ] })
  ] });
}
function WithdrawDialog({
  open,
  onOpenChange
}) {
  const {
    t
  } = useT();
  const qc = useQueryClient();
  const [amount, setAmount] = reactExports.useState("");
  const [note, setNote] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await createWithdrawalFn({
        data: {
          amount: Number(amount) || 0,
          note: note || null
        }
      });
      setAmount("");
      setNote("");
      qc.invalidateQueries({
        queryKey: ["withdrawals"]
      });
      onOpenChange(false);
      toast.success("টাকা উত্তোলন সম্পন্ন");
    } catch (err) {
      toast.error(err.message ?? String(err));
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: t("owner_withdraw") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground", children: [
          t("amount"),
          " (৳)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, inputMode: "decimal", placeholder: "0", value: amount, onChange: (e) => setAmount(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: t("note") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "কারণ লিখুন (optional)", value: note, onChange: (e) => setNote(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: t("cancel") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, children: busy ? "…" : t("save") })
      ] })
    ] })
  ] }) });
}
export {
  MorePage as component
};
