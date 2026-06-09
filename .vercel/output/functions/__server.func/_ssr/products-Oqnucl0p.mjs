import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { u as useCachedQuery } from "./use-cached-query-DaopYbTj.mjs";
import { p as paginate, P as PaginationBar } from "./pagination-bar-A21-yJPk.mjs";
import { u as useIsMobile } from "./use-mobile-D7iZtuRK.mjs";
import { B as Button, I as Input } from "./input-BH1plDoj.mjs";
import { s as signedImage, g as getProducts } from "./queries-Lma9DoHe.mjs";
import { a as useT, u as useAuth, d as uploadImageFn, h as updateProductFn, i as createProductFn } from "./router-z4LwQaWn.mjs";
import { a as fmtMoney } from "./format-BibW3dNi.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-DRM9Vy7D.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { S as SaleDialog } from "./sale-dialog-CYTS4pJM.mjs";
import { P as PurchaseDialog } from "./purchase-dialog-BBqwGIcd.mjs";
import { C as Card } from "./card-RGlIzTYo.mjs";
import "../_libs/seroval.mjs";
import { P as Plus, h as Search, n as Pencil, b as Package, I as ImagePlus } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/tailwind-merge.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
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
import "./tabs-D_u1EXWn.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
function ProductImage({ path, className = "" }) {
  const [url, setUrl] = reactExports.useState(null);
  reactExports.useEffect(() => {
    let live = true;
    signedImage(path).then((u) => {
      if (live) setUrl(u);
    });
    return () => {
      live = false;
    };
  }, [path]);
  if (!url) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `bg-secondary grid place-items-center text-muted-foreground ${className}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "size-6" }) });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: url, className: `object-cover ${className}`, alt: "" });
}
function ProductDialog({
  open,
  onOpenChange,
  product
}) {
  const { t } = useT();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [name, setName] = reactExports.useState("");
  const [buy, setBuy] = reactExports.useState("");
  const [stock, setStock] = reactExports.useState("0");
  const [file, setFile] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (open) {
      setName(product?.name ?? "");
      setBuy(String(product?.buy_price ?? ""));
      setStock(String(product?.stock ?? "0"));
      setFile(null);
    }
  }, [open, product]);
  async function submit(e) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      let image_url = product?.image_url ?? null;
      if (file) {
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        const upData = await uploadImageFn({ data: { base64, fileName: file.name } });
        image_url = upData.url;
      }
      const payload = {
        name,
        image_url,
        buy_price: Number(buy) || 0,
        sell_price: product?.sell_price ?? 0,
        stock: Number(stock) || 0
      };
      if (product) {
        await updateProductFn({ data: { id: product.id, ...payload } });
      } else {
        await createProductFn({ data: { ...payload, sell_price: 0 } });
      }
      toast.success(t("save"));
      qc.invalidateQueries({ queryKey: ["products"] });
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: product ? t("edit") : t("add_product") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-center gap-2 border border-dashed border-border rounded-xl py-5 cursor-pointer hover:bg-secondary/50 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "size-5 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: file ? file.name : t("upload_image") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: (e) => setFile(e.target.files?.[0] ?? null) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("product_name"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: name, onChange: (e) => setName(e.target.value), placeholder: "Product name" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("buy_price"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { inputMode: "decimal", value: buy, onChange: (e) => setBuy(e.target.value), placeholder: "0" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("stock"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { inputMode: "numeric", value: stock, onChange: (e) => setStock(e.target.value), placeholder: "0" }) })
      ] }),
      !product && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("sell_price_on_purchase") }),
      product && product.sell_price > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        t("sell_price"),
        ": ৳",
        product.sell_price
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: t("cancel") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, children: busy ? "…" : t("save") })
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
function ProductsPage() {
  const {
    t
  } = useT();
  useQueryClient();
  const isMobile = useIsMobile();
  const {
    data: productsData
  } = useCachedQuery(["products"], getProducts);
  const [editing, setEditing] = reactExports.useState(null);
  const [open, setOpen] = reactExports.useState(false);
  const [saleProduct, setSaleProduct] = reactExports.useState();
  const [saleOpen, setSaleOpen] = reactExports.useState(false);
  const [buyOpen, setBuyOpen] = reactExports.useState(false);
  const [search, setSearch] = reactExports.useState("");
  const [page, setPage] = reactExports.useState(1);
  const pageSize = isMobile ? 12 : 24;
  const allProducts = productsData ?? [];
  const filteredProducts = allProducts.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  const {
    items: productsToShow,
    totalPages,
    safePage
  } = paginate(filteredProducts, page, pageSize);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold", children: t("products") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "h-8 text-xs", onClick: () => setBuyOpen(true), children: t("buy") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "h-8 text-xs", onClick: () => {
          setSaleProduct(void 0);
          setSaleOpen(true);
        }, children: t("sell") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "pl-8 h-9 text-sm", placeholder: t("search_products"), value: search, onChange: (e) => {
        setSearch(e.target.value);
        setPage(1);
      } })
    ] }),
    !productsData && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("loading") }),
    productsData && productsData.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6 text-center text-xs text-muted-foreground", children: t("no_products") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2", children: productsToShow.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden border-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ProductImage, { path: p.image_url, className: "w-full aspect-square object-cover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-1.5 space-y-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-[10px] sm:text-xs truncate leading-tight", children: p.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[9px] sm:text-[10px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: t("sell_price") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: p.sell_price > 0 ? fmtMoney(p.sell_price) : "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[9px] sm:text-[10px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: t("stock") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: p.stock <= 0 ? "text-destructive font-semibold" : "", children: p.stock })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-0.5 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "h-6 text-[9px] px-1", onClick: () => {
            setSaleProduct(p.id);
            setSaleOpen(true);
          }, children: t("sell") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "h-6 text-[9px] px-0", onClick: () => {
            setEditing(p);
            setOpen(true);
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-2.5" }) })
        ] })
      ] })
    ] }, p.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PaginationBar, { page: safePage, totalPages, total: filteredProducts.length, pageSize, onPageChange: setPage }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FAB, { onClick: () => {
      setEditing(null);
      setOpen(true);
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ProductDialog, { open, onOpenChange: setOpen, product: editing }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SaleDialog, { open: saleOpen, onOpenChange: setSaleOpen, presetProductId: saleProduct }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PurchaseDialog, { open: buyOpen, onOpenChange: setBuyOpen })
  ] });
}
function FAB({
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, className: "fixed mobile-fab-bottom right-3 z-20 size-12 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-lg shadow-primary/25 active:scale-95 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-5" }) });
}
export {
  FAB,
  ProductsPage as component
};
