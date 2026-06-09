import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { C as Card } from "./card-RGlIzTYo.mjs";
import { B as Button } from "./input-BH1plDoj.mjs";
import { c as getPurchases } from "./queries-Lma9DoHe.mjs";
import { u as useCachedQuery } from "./use-cached-query-DaopYbTj.mjs";
import { a as useT, F as FAB, g as deletePurchaseFn } from "./router-z4LwQaWn.mjs";
import { f as fmtDateTime, a as fmtMoney } from "./format-BibW3dNi.mjs";
import { P as PurchaseDialog } from "./purchase-dialog-BBqwGIcd.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as setCachedData, r as refreshQueries } from "./optimistic-cache-Djd0Z039.mjs";
import "../_libs/seroval.mjs";
import { T as Trash2 } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "./server-DaU8DV72.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./dialog-DRM9Vy7D.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
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
import "./label-JU3yqRBo.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "./product-search-Cv9oWU97.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "./command-DTp0i3KO.mjs";
import "../_libs/cmdk.mjs";
function PurchasesPage() {
  const {
    t
  } = useT();
  const qc = useQueryClient();
  const {
    data
  } = useCachedQuery(["purchases"], getPurchases);
  const [open, setOpen] = reactExports.useState(false);
  async function handleDelete(purchase) {
    if (!confirm(`${t("delete")} ${purchase.product_name}?`)) return;
    setCachedData(qc, ["purchases"], (old) => (old ?? []).filter((p) => p.id !== purchase.id));
    try {
      await deletePurchaseFn({
        data: {
          id: purchase.id
        }
      });
      await refreshQueries(qc, ["purchases"], ["products"]);
      toast.success(t("delete"));
    } catch (err) {
      await refreshQueries(qc, ["purchases"], ["products"]);
      toast.error(err instanceof Error ? err.message : String(err));
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: t("new_purchase") }),
    (!data || data.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-8 text-center text-sm text-muted-foreground", children: t("no_activity") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "divide-y divide-border overflow-hidden", children: data?.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium truncate", children: [
          p.product_name,
          " ×",
          p.qty
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: fmtDateTime(p.created_at) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold shrink-0", children: fmtMoney(p.total) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "h-8 w-8 p-0 text-destructive shrink-0", onClick: () => handleDelete(p), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) })
    ] }, p.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FAB, { onClick: () => setOpen(true) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PurchaseDialog, { open, onOpenChange: setOpen })
  ] });
}
export {
  PurchasesPage as component
};
