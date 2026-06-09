import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-DRM9Vy7D.mjs";
import { B as Button, I as Input } from "./input-BH1plDoj.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { P as ProductSearchSelect } from "./product-search-Cv9oWU97.mjs";
import { u as useCachedQuery } from "./use-cached-query-DaopYbTj.mjs";
import { g as getProducts } from "./queries-Lma9DoHe.mjs";
import { a as useT, j as createPurchaseFn } from "./router-z4LwQaWn.mjs";
import { a as fmtMoney } from "./format-BibW3dNi.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { T as Trash2, P as Plus } from "../_libs/lucide-react.mjs";
function PurchaseDialog({ open, onOpenChange }) {
  const { t } = useT();
  const qc = useQueryClient();
  const { data: products = [] } = useCachedQuery(["products"], getProducts);
  const [lines, setLines] = reactExports.useState([{ productId: "", qty: "1", unitCost: "", sellPrice: "" }]);
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!open) setLines([{ productId: "", qty: "1", unitCost: "", sellPrice: "" }]);
  }, [open]);
  function updateLine(i, patch) {
    setLines((prev) => prev.map((l, idx) => {
      if (idx !== i) return l;
      const next = { ...l, ...patch };
      if (patch.productId) {
        const p = products.find((x) => x.id === patch.productId);
        if (p) {
          next.unitCost = String(p.buy_price || "");
          next.sellPrice = p.sell_price > 0 ? String(p.sell_price) : "";
        }
      }
      return next;
    }));
  }
  const grandTotal = lines.reduce((sum, l) => {
    const p = products.find((x) => x.id === l.productId);
    if (!p) return sum;
    return sum + (Number(l.qty) || 0) * (Number(l.unitCost) || 0);
  }, 0);
  async function submit(e) {
    e.preventDefault();
    const valid = lines.filter((l) => l.productId && Number(l.qty) > 0);
    if (valid.length === 0) return toast.error(t("select_product"));
    setBusy(true);
    try {
      for (const line of valid) {
        const p = products.find((x) => x.id === line.productId);
        const qty = Number(line.qty) || 0;
        const unit_cost = Number(line.unitCost) || 0;
        const sell_price = Number(line.sellPrice) || 0;
        await createPurchaseFn({
          data: {
            product_id: p.id,
            product_name: p.name,
            qty,
            unit_cost,
            sell_price: sell_price > 0 ? sell_price : void 0,
            total: qty * unit_cost
          }
        });
      }
      toast.success(t("save"));
      qc.invalidateQueries({ queryKey: ["purchases"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md max-h-[90dvh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: t("new_purchase") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
      lines.map((line, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border rounded-lg p-3 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-muted-foreground", children: [
            "#",
            i + 1
          ] }),
          lines.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "icon", className: "size-6", onClick: () => setLines((prev) => prev.filter((_, idx) => idx !== i)), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ProductSearchSelect, { products, value: line.productId, onChange: (v) => updateLine(i, { productId: v }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-muted-foreground", children: t("qty") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-8 text-xs", inputMode: "numeric", value: line.qty, onChange: (e) => updateLine(i, { qty: e.target.value }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-muted-foreground", children: t("buy_price") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-8 text-xs", inputMode: "decimal", value: line.unitCost, onChange: (e) => updateLine(i, { unitCost: e.target.value }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-muted-foreground", children: t("sell_price") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-8 text-xs", inputMode: "decimal", placeholder: "—", value: line.sellPrice, onChange: (e) => updateLine(i, { sellPrice: e.target.value }) })
          ] })
        ] })
      ] }, i)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", size: "sm", className: "w-full", onClick: () => setLines((prev) => [...prev, { productId: "", qty: "1", unitCost: "", sellPrice: "" }]), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5 mr-1" }),
        t("add_product")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm border-t border-border pt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: t("total") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: fmtMoney(grandTotal) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: t("cancel") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, children: busy ? "…" : t("save") })
      ] })
    ] })
  ] }) });
}
export {
  PurchaseDialog as P
};
