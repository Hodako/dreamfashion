import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery, u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { C as Card } from "./card-RGlIzTYo.mjs";
import { I as Input, B as Button } from "./input-BH1plDoj.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger } from "./tabs-D_u1EXWn.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-DRM9Vy7D.mjs";
import { f as getSomiti } from "./queries-Lma9DoHe.mjs";
import { a as useT, F as FAB, c as createSomitiFn } from "./router-z4LwQaWn.mjs";
import { a as fmtMoney, f as fmtDateTime } from "./format-BibW3dNi.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-presence.mjs";
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
import "../_libs/lucide-react.mjs";
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
function SomitiPage() {
  const {
    t
  } = useT();
  const {
    data
  } = useQuery({
    queryKey: ["somiti"],
    queryFn: getSomiti
  });
  const [open, setOpen] = reactExports.useState(false);
  const balance = (data ?? []).reduce((a, e) => a + (e.kind === "deposit" ? 1 : -1) * Number(e.amount), 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: t("somiti") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 bg-gradient-to-br from-primary/10 to-success/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium text-muted-foreground", children: t("balance") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold mt-1", children: fmtMoney(balance) })
    ] }),
    (!data || data.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-8 text-center text-sm text-muted-foreground", children: t("no_activity") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "divide-y divide-border overflow-hidden", children: data?.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", children: [
          e.kind === "deposit" ? t("deposit") : t("withdraw"),
          e.note ? ` — ${e.note}` : ""
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: fmtDateTime(e.created_at) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `font-semibold ${e.kind === "deposit" ? "text-success" : "text-destructive"}`, children: [
        e.kind === "deposit" ? "+" : "-",
        fmtMoney(e.amount)
      ] })
    ] }, e.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FAB, { onClick: () => setOpen(true) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SomitiDialog, { open, onOpenChange: setOpen })
  ] });
}
function SomitiDialog({
  open,
  onOpenChange
}) {
  const {
    t
  } = useT();
  const qc = useQueryClient();
  const [kind, setKind] = reactExports.useState("deposit");
  const [amount, setAmount] = reactExports.useState("");
  const [note, setNote] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await createSomitiFn({
        data: {
          kind,
          amount: Number(amount) || 0,
          note: note || null
        }
      });
      setAmount("");
      setNote("");
      qc.invalidateQueries({
        queryKey: ["somiti"]
      });
      onOpenChange(false);
    } catch (err) {
      toast.error(err.message || "Failed to save");
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: t("add_somiti") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tabs, { value: kind, onValueChange: (v) => setKind(v), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid grid-cols-2 w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "deposit", children: t("deposit") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "withdraw", children: t("withdraw") })
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
  SomitiPage as component
};
