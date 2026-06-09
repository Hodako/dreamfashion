import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as Button } from "./input-BH1plDoj.mjs";
import { R as Root2, T as Trigger, P as Portal, C as Content2 } from "../_libs/radix-ui__react-popover.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { g as Command, a as CommandInput, b as CommandList, c as CommandEmpty, d as CommandGroup, e as CommandItem } from "./command-DTp0i3KO.mjs";
import { a as fmtMoney } from "./format-BibW3dNi.mjs";
import { a as useT } from "./router-z4LwQaWn.mjs";
import { q as ChevronsUpDown, j as Check } from "../_libs/lucide-react.mjs";
const Popover = Root2;
const PopoverTrigger = Trigger;
const PopoverContent = reactExports.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = Content2.displayName;
function ProductSearchSelect({ products, value, onChange, showPrice, placeholder }) {
  const { t } = useT();
  const [open, setOpen] = reactExports.useState(false);
  const selected = products.find((p) => p.id === value);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", role: "combobox", "aria-expanded": open, className: "w-full justify-between font-normal h-9", children: [
      selected ? showPrice ? `${selected.name} · ${fmtMoney(selected.sell_price)}` : selected.name : placeholder ?? t("select_product"),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "ml-2 size-4 shrink-0 opacity-50" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-[var(--radix-popover-trigger-width)] p-0", align: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Command, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CommandInput, { placeholder: t("search") + "…" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandList, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CommandEmpty, { children: t("no_products") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CommandGroup, { children: products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          CommandItem,
          {
            value: p.name,
            onSelect: () => {
              onChange(p.id);
              setOpen(false);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: cn("mr-2 size-4", value === p.id ? "opacity-100" : "opacity-0") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate", children: p.name }),
              showPrice && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs ml-2", children: fmtMoney(p.sell_price) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs ml-2", children: [
                "(",
                p.stock,
                ")"
              ] })
            ]
          },
          p.id
        )) })
      ] })
    ] }) })
  ] });
}
export {
  ProductSearchSelect as P
};
