import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { C as Card } from "./card-RGlIzTYo.mjs";
import { B as Button, I as Input } from "./input-BH1plDoj.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-DRM9Vy7D.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger } from "./tabs-D_u1EXWn.mjs";
import { i as getCashbox } from "./queries-Lma9DoHe.mjs";
import { u as useCachedQuery } from "./use-cached-query-DaopYbTj.mjs";
import { a as useT, C as createCashboxFn } from "./router-z4LwQaWn.mjs";
import { a as fmtMoney, f as fmtDateTime } from "./format-BibW3dNi.mjs";
import { c as cashboxBalance, a as cashboxDelta } from "./cashbox-utils-BlSelpLt.mjs";
import { p as paginate, P as PaginationBar } from "./pagination-bar-A21-yJPk.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as setCachedData, r as refreshQueries } from "./optimistic-cache-Djd0Z039.mjs";
import "../_libs/seroval.mjs";
import { F as ArrowLeft, P as Plus, K as Minus, B as Banknote, u as TrendingUp, N as TrendingDown, l as Download } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "./server-DaU8DV72.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
function RangePill({
  label,
  active,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick, className: `px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`, children: label });
}
function kindLabel(t, kind) {
  if (kind === "sale") return t("sales");
  if (kind === "expense") return t("expense");
  if (kind === "deposit") return t("add_money");
  return t("take_money");
}
function CashboxDetailsPage() {
  const {
    t
  } = useT();
  const cashbox = useCachedQuery(["cashbox"], getCashbox);
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [dialogKind, setDialogKind] = reactExports.useState("deposit");
  const [range, setRange] = reactExports.useState("month");
  const [startDate, setStartDate] = reactExports.useState("");
  const [endDate, setEndDate] = reactExports.useState("");
  const [filterKind, setFilterKind] = reactExports.useState("all");
  const [page, setPage] = reactExports.useState(1);
  const pageSize = 12;
  const balance = cashboxBalance(cashbox.data ?? []);
  const {
    from,
    to
  } = reactExports.useMemo(() => {
    const end = /* @__PURE__ */ new Date();
    end.setHours(23, 59, 59, 999);
    if (range === "today") {
      const start2 = /* @__PURE__ */ new Date();
      start2.setHours(0, 0, 0, 0);
      return {
        from: start2,
        to: end
      };
    }
    const start = /* @__PURE__ */ new Date(0);
    if (range === "week") {
      start.setTime(Date.now());
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
    } else if (range === "month") {
      start.setTime(Date.now());
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
    } else if (range === "custom") {
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
  const filtered = reactExports.useMemo(() => {
    return (cashbox.data ?? []).filter((e) => {
      const dt = new Date(e.created_at);
      if (dt < from || dt > to) return false;
      if (filterKind !== "all" && e.kind !== filterKind) return false;
      return true;
    }).sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  }, [cashbox.data, from, to, filterKind]);
  const periodIn = filtered.filter((e) => e.kind === "deposit" || e.kind === "sale").reduce((a, e) => a + Number(e.amount), 0);
  const periodOut = filtered.filter((e) => e.kind === "withdraw" || e.kind === "expense").reduce((a, e) => a + Number(e.amount), 0);
  const periodNet = periodIn - periodOut;
  const {
    items: paged,
    totalPages,
    safePage
  } = paginate(filtered, page, pageSize);
  reactExports.useEffect(() => {
    setPage(1);
  }, [range, startDate, endDate, filterKind]);
  function exportCSV() {
    const rows = [["Date", "Time", "Type", "Note", "Amount", "Direction"]];
    filtered.forEach((e) => {
      const d = new Date(e.created_at);
      rows.push([d.toLocaleDateString(), d.toLocaleTimeString(), e.kind, e.note ?? "", String(e.amount), cashboxDelta(e.kind, e.amount) >= 0 ? "in" : "out"]);
    });
    rows.push([]);
    rows.push(["Summary", "", "", "Balance", String(balance), ""]);
    rows.push(["Period In", "", "", "", String(periodIn), ""]);
    rows.push(["Period Out", "", "", "", String(periodOut), ""]);
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], {
      type: "text/csv"
    }));
    a.download = `cashbox-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
    a.click();
  }
  const rangeLabel = range === "today" ? t("today") : range === "week" ? t("this_week") : range === "month" ? t("this_month") : range === "all" ? t("all") : t("custom");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cash-management", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4 mr-1" }),
      t("cash_management")
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl sm:text-2xl font-bold", children: t("cashbox") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t("cashbox_ledger") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => {
          setDialogKind("deposit");
          setDialogOpen(true);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5 mr-1" }),
          t("add_money")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => {
          setDialogKind("withdraw");
          setDialogOpen(true);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "size-3.5 mr-1" }),
          t("take_money")
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 glass-card border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-11 rounded-xl bg-indigo-500 grid place-items-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { className: "size-5 text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: t("balance") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl sm:text-3xl font-bold text-indigo-600", children: fmtMoney(balance) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 sm:gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3 sm:p-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-4 text-emerald-600 mx-auto mb-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: t("money_in") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm sm:text-base font-bold text-emerald-600", children: fmtMoney(periodIn) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-muted-foreground mt-0.5", children: rangeLabel })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3 sm:p-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "size-4 text-rose-600 mx-auto mb-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: t("money_out") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm sm:text-base font-bold text-rose-600", children: fmtMoney(periodOut) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-muted-foreground mt-0.5", children: rangeLabel })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3 sm:p-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-5 sm:mt-0", children: t("net_change") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-sm sm:text-base font-bold mt-1 ${periodNet >= 0 ? "text-emerald-600" : "text-rose-600"}`, children: [
          periodNet >= 0 ? "+" : "−",
          fmtMoney(Math.abs(periodNet))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-muted-foreground mt-0.5", children: rangeLabel })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RangePill, { label: t("today"), active: range === "today", onClick: () => setRange("today") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RangePill, { label: t("this_week"), active: range === "week", onClick: () => setRange("week") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RangePill, { label: t("this_month"), active: range === "month", onClick: () => setRange("month") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RangePill, { label: t("all"), active: range === "all", onClick: () => setRange("all") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RangePill, { label: t("custom"), active: range === "custom", onClick: () => setRange("custom") })
      ] }),
      range === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value), className: "flex-1 h-8 text-xs" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: endDate, onChange: (e) => setEndDate(e.target.value), className: "flex-1 h-8 text-xs" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: ["all", "sale", "expense", "deposit", "withdraw"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setFilterKind(k), className: `px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${filterKind === k ? "bg-primary/15 border-primary text-primary" : "border-border text-muted-foreground"}`, children: k === "all" ? t("all") : kindLabel(t, k) }, k)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: exportCSV, disabled: filtered.length === 0, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4 mr-1" }),
      t("export_csv")
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "divide-y divide-border overflow-hidden", children: [
      paged.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-sm text-muted-foreground", children: t("no_activity") }),
      paged.map((e) => {
        const delta = cashboxDelta(e.kind, e.amount);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm truncate", children: e.note || kindLabel(t, e.kind) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: fmtDateTime(e.created_at) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex mt-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${e.kind === "sale" || e.kind === "deposit" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"}`, children: kindLabel(t, e.kind) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-sm font-bold shrink-0 ${delta >= 0 ? "text-emerald-600" : "text-rose-600"}`, children: [
            delta >= 0 ? "+" : "−",
            fmtMoney(Math.abs(delta))
          ] })
        ] }, e.id);
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PaginationBar, { page: safePage, totalPages, total: filtered.length, pageSize, onPageChange: setPage }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CashboxDialog, { open: dialogOpen, onOpenChange: setDialogOpen, initialKind: dialogKind })
  ] });
}
function CashboxDialog({
  open,
  onOpenChange,
  initialKind
}) {
  const {
    t
  } = useT();
  const qc = useQueryClient();
  const [kind, setKind] = reactExports.useState(initialKind);
  const [amount, setAmount] = reactExports.useState("");
  const [note, setNote] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (open) {
      setKind(initialKind);
      setAmount("");
      setNote("");
    }
  }, [open, initialKind]);
  async function submit(e) {
    e.preventDefault();
    const amt = Number(amount) || 0;
    if (amt <= 0) return;
    const tempId = `temp-${Date.now()}`;
    const entry = {
      id: tempId,
      kind,
      amount: amt,
      note: note || null,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    setCachedData(qc, ["cashbox"], (old) => [entry, ...old ?? []]);
    onOpenChange(false);
    toast.success(t("save"));
    setBusy(true);
    try {
      const saved = await createCashboxFn({
        data: {
          kind,
          amount: amt,
          note: note || null
        }
      });
      setCachedData(qc, ["cashbox"], (old) => (old ?? []).map((item) => item.id === tempId ? {
        ...saved,
        id: saved.id
      } : item));
      await refreshQueries(qc, ["cashbox"]);
    } catch (err) {
      setCachedData(qc, ["cashbox"], (old) => (old ?? []).filter((item) => item.id !== tempId));
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: t("cashbox") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tabs, { value: kind, onValueChange: (v) => setKind(v), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid grid-cols-2 w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "deposit", children: t("add_money") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "withdraw", children: t("take_money") })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: t("amount") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, inputMode: "decimal", value: amount, onChange: (e) => setAmount(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: t("note") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: note, onChange: (e) => setNote(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: t("cancel") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, children: busy ? "…" : t("save") })
      ] })
    ] })
  ] }) });
}
export {
  CashboxDetailsPage as component
};
