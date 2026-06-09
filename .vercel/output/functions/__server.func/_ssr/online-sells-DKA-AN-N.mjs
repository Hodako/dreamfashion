import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-D_u1EXWn.mjs";
import { C as Card } from "./card-RGlIzTYo.mjs";
import { a as getSales } from "./queries-Lma9DoHe.mjs";
import { a as useT, F as FAB } from "./router-z4LwQaWn.mjs";
import { f as fmtDateTime, a as fmtMoney } from "./format-BibW3dNi.mjs";
import { S as SaleDialog } from "./sale-dialog-CYTS4pJM.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
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
import "../_libs/lucide-react.mjs";
import "./dialog-DRM9Vy7D.mjs";
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
import "./input-BH1plDoj.mjs";
import "../_libs/class-variance-authority.mjs";
import "./label-JU3yqRBo.mjs";
import "../_libs/radix-ui__react-label.mjs";
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
import "./use-cached-query-DaopYbTj.mjs";
function OnlineSellsPage() {
  const {
    t
  } = useT();
  const {
    data
  } = useQuery({
    queryKey: ["sales"],
    queryFn: getSales
  });
  const [open, setOpen] = reactExports.useState(false);
  const onlineSales = (data ?? []).filter((s) => s.type === "online");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: t("online_sell") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "all", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid grid-cols-2 w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "all", children: t("all") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "today", children: t("today") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "all", className: "pt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(OnlineSalesList, { items: onlineSales }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "today", className: "pt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(OnlineSalesList, { items: onlineSales.filter((s) => {
        const saleDate = new Date(s.created_at);
        const today = /* @__PURE__ */ new Date();
        return saleDate.toDateString() === today.toDateString();
      }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FAB, { onClick: () => setOpen(true), presetType: "online" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SaleDialog, { open, onOpenChange: setOpen, presetType: "online" })
  ] });
}
function OnlineSalesList({
  items
}) {
  const {
    t
  } = useT();
  if (!items || items.length === 0) return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-8 text-center text-sm text-muted-foreground", children: t("no_sales") });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "divide-y divide-border overflow-hidden", children: items.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium truncate", children: [
        s.product_name,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs", children: [
          "×",
          s.qty
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
        s.parties?.name ? `${s.parties.name} · ` : "",
        fmtDateTime(s.created_at)
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: fmtMoney(Number(s.sell_price) * s.qty) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-success", children: [
        "+",
        fmtMoney(s.profit)
      ] })
    ] })
  ] }, s.id)) });
}
export {
  OnlineSellsPage as component
};
