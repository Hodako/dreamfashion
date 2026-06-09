import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-D_u1EXWn.mjs";
import { C as Card } from "./card-RGlIzTYo.mjs";
import { B as Button, I as Input } from "./input-BH1plDoj.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-DRM9Vy7D.mjs";
import { a as getSales } from "./queries-Lma9DoHe.mjs";
import { u as useCachedQuery } from "./use-cached-query-DaopYbTj.mjs";
import { p as paginate, P as PaginationBar } from "./pagination-bar-A21-yJPk.mjs";
import { u as useIsMobile } from "./use-mobile-D7iZtuRK.mjs";
import { a as useT, F as FAB, f as createReturnFn } from "./router-z4LwQaWn.mjs";
import { f as fmtDateTime, a as fmtMoney } from "./format-BibW3dNi.mjs";
import { S as SaleDialog } from "./sale-dialog-CYTS4pJM.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { h as Search, m as RotateCcw } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
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
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./product-search-Cv9oWU97.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "./command-DTp0i3KO.mjs";
import "../_libs/cmdk.mjs";
function SalesPage() {
  const {
    t
  } = useT();
  const isMobile = useIsMobile();
  const {
    data
  } = useCachedQuery(["sales"], getSales);
  const [open, setOpen] = reactExports.useState(false);
  const [returnSale, setReturnSale] = reactExports.useState(null);
  const [searchOpen, setSearchOpen] = reactExports.useState(false);
  const [search, setSearch] = reactExports.useState("");
  const [page, setPage] = reactExports.useState(1);
  const pageSize = isMobile ? 12 : 20;
  const q = search.trim().toLowerCase();
  const filter = (items) => items.filter((s) => !q || s.product_name.toLowerCase().includes(q) || (s.parties?.name ?? "").toLowerCase().includes(q));
  const cash = filter((data ?? []).filter((s) => s.type === "cash"));
  const credit = filter((data ?? []).filter((s) => s.type === "credit"));
  const online = filter((data ?? []).filter((s) => s.type === "online"));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold font-serif", children: t("sales") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", size: "icon", className: "size-8 shrink-0", onClick: () => setSearchOpen((v) => !v), "aria-label": t("search"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "icon-sm" }) })
    ] }),
    (searchOpen || search) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "pl-8 h-9 text-sm", placeholder: t("search_sales"), value: search, onChange: (e) => {
        setSearch(e.target.value);
        setPage(1);
      }, autoFocus: searchOpen })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "cash", onValueChange: () => setPage(1), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid grid-cols-3 w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "cash", children: t("cash_sale") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "credit", children: t("credit_sale") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "online", children: t("online_sell") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "cash", className: "pt-3 space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SalesTab, { items: cash, page, pageSize, onPageChange: setPage, onReturn: setReturnSale }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "credit", className: "pt-3 space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SalesTab, { items: credit, page, pageSize, onPageChange: setPage, credit: true, onReturn: setReturnSale }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "online", className: "pt-3 space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SalesTab, { items: online, page, pageSize, onPageChange: setPage, onReturn: setReturnSale }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FAB, { onClick: () => setOpen(true) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SaleDialog, { open, onOpenChange: setOpen }),
    returnSale && /* @__PURE__ */ jsxRuntimeExports.jsx(ReturnDialog, { sale: returnSale, open: !!returnSale, onOpenChange: (v) => {
      if (!v) setReturnSale(null);
    } })
  ] });
}
function SalesTab({
  items,
  page,
  pageSize,
  onPageChange,
  credit,
  onReturn
}) {
  const {
    t
  } = useT();
  const {
    items: paged,
    totalPages,
    safePage
  } = paginate(items, page, pageSize);
  if (items.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-8 text-center text-sm text-muted-foreground", children: t("no_sales") });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "divide-y divide-border overflow-hidden", children: paged.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium truncate text-sm", children: [
          s.product_name,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs", children: [
            "×",
            s.qty
          ] }),
          s.returned && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 text-xs text-destructive", children: [
            "(",
            t("returned"),
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          credit && s.parties?.name ? `${s.parties.name} · ` : "",
          fmtDateTime(s.created_at)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: fmtMoney(Number(s.sell_price) * s.qty) }),
        credit ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-warning", children: [
          t("due"),
          ": ",
          fmtMoney(s.due_amount)
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-success", children: [
          "+",
          fmtMoney(s.profit)
        ] })
      ] }),
      s.product_id && !s.returned && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "h-8 px-2 shrink-0", onClick: () => onReturn(s), children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "size-3.5" }) })
    ] }, s.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PaginationBar, { page: safePage, totalPages, total: items.length, pageSize, onPageChange })
  ] });
}
function ReturnDialog({
  sale,
  open,
  onOpenChange
}) {
  const {
    t
  } = useT();
  const qc = useQueryClient();
  const [qty, setQty] = reactExports.useState(String(sale.qty));
  const [note, setNote] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await createReturnFn({
        data: {
          sale_id: sale.id,
          qty: Number(qty) || 0,
          note: note || null
        }
      });
      qc.invalidateQueries({
        queryKey: ["sales"]
      });
      qc.invalidateQueries({
        queryKey: ["products"]
      });
      qc.invalidateQueries({
        queryKey: ["returns"]
      });
      toast.success(t("return_product"));
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
      t("return_product"),
      " — ",
      sale.product_name
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground", children: [
          t("qty"),
          " (max ",
          sale.qty,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { inputMode: "numeric", value: qty, onChange: (e) => setQty(e.target.value), max: sale.qty })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: t("note") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: note, onChange: (e) => setNote(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: t("cancel") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, children: busy ? "…" : t("return_product") })
      ] })
    ] })
  ] }) });
}
export {
  SalesPage as component
};
