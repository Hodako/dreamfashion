import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-DRM9Vy7D.mjs";
import { I as Input, B as Button } from "./input-BH1plDoj.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { S as Select$1, a as SelectValue$1, b as SelectTrigger$1, c as SelectIcon, d as SelectPortal, e as SelectContent$1, f as SelectViewport, g as SelectItem$1, h as SelectItemIndicator, i as SelectItemText, j as SelectScrollUpButton$1, k as SelectScrollDownButton$1, l as SelectLabel$1, m as SelectSeparator$1 } from "../_libs/radix-ui__react-select.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { P as ProductSearchSelect } from "./product-search-Cv9oWU97.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger } from "./tabs-D_u1EXWn.mjs";
import { u as useCachedQuery } from "./use-cached-query-DaopYbTj.mjs";
import { a as useT, u as useAuth, k as createSaleFn } from "./router-z4LwQaWn.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { g as getProducts, b as getParties } from "./queries-Lma9DoHe.mjs";
import { a as fmtMoney } from "./format-BibW3dNi.mjs";
import { P as Plus, T as Trash2, o as ChevronDown, j as Check, p as ChevronUp } from "../_libs/lucide-react.mjs";
const Select = Select$1;
const SelectValue = SelectValue$1;
const SelectTrigger = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SelectTrigger$1,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectIcon, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectTrigger$1.displayName;
const SelectScrollUpButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectScrollUpButton$1,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
const SelectScrollDownButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectScrollDownButton$1,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
const SelectContent = reactExports.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectPortal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SelectContent$1,
  {
    ref,
    className: cn(
      "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SelectViewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectContent$1.displayName;
const SelectLabel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectLabel$1,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectLabel$1.displayName;
const SelectItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SelectItem$1,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItemIndicator, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectItem$1.displayName;
const SelectSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectSeparator$1,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectSeparator$1.displayName;
function SaleDialog({
  open,
  onOpenChange,
  presetType,
  presetProductId
}) {
  const { t } = useT();
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: products = [] } = useCachedQuery(["products"], getProducts);
  const { data: parties = [] } = useCachedQuery(["parties"], getParties);
  const [type, setType] = reactExports.useState(presetType ?? "cash");
  const [partyId, setPartyId] = reactExports.useState("");
  const [paid, setPaid] = reactExports.useState("");
  const [cart, setCart] = reactExports.useState([]);
  const [draft, setDraft] = reactExports.useState({ productId: "", qty: "1", sellPrice: "" });
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (open) {
      setType(presetType ?? "cash");
      setPartyId("");
      setPaid("");
      setCart(presetProductId ? [{ productId: presetProductId, qty: "1", sellPrice: "" }] : []);
      setDraft({ productId: "", qty: "1", sellPrice: "" });
    }
  }, [open, presetType, presetProductId]);
  reactExports.useEffect(() => {
    if (draft.productId && !draft.sellPrice) {
      const p = products.find((x) => x.id === draft.productId);
      if (p && p.sell_price > 0) setDraft((d) => ({ ...d, sellPrice: String(p.sell_price) }));
    }
  }, [draft.productId, draft.sellPrice, products]);
  function lineTotal(line) {
    const p = products.find((x) => x.id === line.productId);
    if (!p) return 0;
    const sell = Number(line.sellPrice) || p.sell_price || 0;
    return sell * (Number(line.qty) || 0);
  }
  const sellTotal = cart.reduce((a, l) => a + lineTotal(l), 0);
  const profitTotal = cart.reduce((a, l) => {
    const p = products.find((x) => x.id === l.productId);
    if (!p) return a;
    const sell = Number(l.sellPrice) || p.sell_price || 0;
    const qty = Number(l.qty) || 0;
    return a + (sell - p.buy_price) * qty;
  }, 0);
  const paidNum = type === "cash" || type === "online" ? sellTotal : Number(paid) || 0;
  const due = Math.max(sellTotal - paidNum, 0);
  function addToCart() {
    if (!draft.productId) return toast.error(t("select_product"));
    const qty = Number(draft.qty) || 0;
    if (qty <= 0) return;
    const sell = Number(draft.sellPrice);
    if (!sell || sell <= 0) return toast.error(t("sell_price") + " " + t("required"));
    setCart((prev) => [...prev, { ...draft }]);
    setDraft({ productId: "", qty: "1", sellPrice: "" });
  }
  async function submit(e) {
    e.preventDefault();
    if (!user || cart.length === 0) return toast.error(t("select_product"));
    if (type === "credit" && !partyId) return toast.error(t("party") + " " + t("required"));
    setBusy(true);
    try {
      const duePerItem = type === "credit" ? due / cart.length : 0;
      const paidPerItem = type === "credit" ? paidNum / cart.length : 0;
      for (const line of cart) {
        const product = products.find((p) => p.id === line.productId);
        const qtyNum = Number(line.qty) || 0;
        const sellPrice = Number(line.sellPrice) || product.sell_price || 0;
        const lineSell = sellPrice * qtyNum;
        const lineProfit = (sellPrice - product.buy_price) * qtyNum;
        await createSaleFn({
          data: {
            product_id: product.id,
            product_name: product.name,
            qty: qtyNum,
            buy_price: product.buy_price,
            sell_price: sellPrice,
            profit: lineProfit,
            type,
            party_id: type === "credit" ? partyId : null,
            paid_amount: type === "credit" ? paidPerItem : lineSell,
            due_amount: type === "credit" ? duePerItem : 0
          }
        });
      }
      toast.success(t("record_sale"));
      qc.invalidateQueries({ queryKey: ["sales"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["party-detail"] });
      qc.invalidateQueries({ queryKey: ["cashbox"] });
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md max-h-[90dvh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: t("new_sale") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tabs, { value: type, onValueChange: (v) => setType(v), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid grid-cols-3 w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "cash", children: t("cash_sale") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "credit", children: t("credit_sale") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "online", children: t("online_sell") })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border rounded-lg p-3 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("select_product"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductSearchSelect, { products, value: draft.productId, onChange: (v) => setDraft((d) => ({ ...d, productId: v })) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("qty"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { inputMode: "numeric", value: draft.qty, onChange: (e) => setDraft((d) => ({ ...d, qty: e.target.value })) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("sell_price"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { inputMode: "decimal", placeholder: "0", value: draft.sellPrice, onChange: (e) => setDraft((d) => ({ ...d, sellPrice: e.target.value })) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", size: "sm", className: "w-full", onClick: addToCart, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5 mr-1" }),
          t("add_to_cart")
        ] })
      ] }),
      cart.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground", children: [
          t("cart"),
          " (",
          cart.length,
          ")"
        ] }),
        cart.map((line, i) => {
          const p = products.find((x) => x.id === line.productId);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs border border-border rounded-md px-2 py-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate flex-1", children: [
              p?.name,
              " ×",
              line.qty
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium mx-2", children: fmtMoney(lineTotal(line)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "icon", className: "size-6 shrink-0", onClick: () => setCart((prev) => prev.filter((_, idx) => idx !== i)), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3" }) })
          ] }, i);
        })
      ] }),
      type === "credit" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("party"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: partyId, onValueChange: setPartyId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "—" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: parties.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id, children: p.name }, p.id)) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("paid_amount"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { inputMode: "decimal", value: paid, onChange: (e) => setPaid(e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("due_amount"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 px-3 grid items-center rounded-md bg-warning/10 font-semibold text-sm", children: fmtMoney(due) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm border-t border-border pt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: t("total") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: fmtMoney(sellTotal) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("profit") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-success font-medium", children: fmtMoney(profitTotal) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: t("cancel") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy || cart.length === 0, children: busy ? "…" : t("record_sale") })
      ] })
    ] })
  ] }) });
}
function Field({ label, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: label }),
    children
  ] });
}
export {
  SaleDialog as S
};
