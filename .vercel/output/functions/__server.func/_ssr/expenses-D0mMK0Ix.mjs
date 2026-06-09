import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { C as Card } from "./card-RGlIzTYo.mjs";
import { B as Button, I as Input } from "./input-BH1plDoj.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-DRM9Vy7D.mjs";
import { d as getExpenses } from "./queries-Lma9DoHe.mjs";
import { u as useCachedQuery } from "./use-cached-query-DaopYbTj.mjs";
import { a as useT, F as FAB, n as deleteExpenseFn, o as createExpenseFn } from "./router-z4LwQaWn.mjs";
import { a as fmtMoney, f as fmtDateTime } from "./format-BibW3dNi.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
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
function ExpensesPage() {
  const {
    t
  } = useT();
  const qc = useQueryClient();
  const {
    data
  } = useCachedQuery(["expenses"], getExpenses);
  const [open, setOpen] = reactExports.useState(false);
  const total = (data ?? []).reduce((a, e) => a + Number(e.amount), 0);
  async function handleDelete(expense) {
    if (!confirm(`${t("delete")} ${expense.title}?`)) return;
    setCachedData(qc, ["expenses"], (old) => (old ?? []).filter((e) => e.id !== expense.id));
    try {
      await deleteExpenseFn({
        data: {
          id: expense.id
        }
      });
      await refreshQueries(qc, ["expenses"], ["cashbox"]);
      toast.success(t("delete"));
    } catch (err) {
      await refreshQueries(qc, ["expenses"], ["cashbox"]);
      toast.error(err instanceof Error ? err.message : String(err));
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: t("expenses") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 bg-gradient-to-br from-muted to-secondary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium text-muted-foreground", children: t("total") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold mt-1", children: fmtMoney(total) })
    ] }),
    (!data || data.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-8 text-center text-sm text-muted-foreground", children: t("no_activity") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "divide-y divide-border overflow-hidden", children: data?.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: e.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          fmtDateTime(e.created_at),
          e.note ? ` · ${e.note}` : ""
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-destructive shrink-0", children: [
        "−",
        fmtMoney(e.amount)
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "h-8 w-8 p-0 text-destructive shrink-0", onClick: () => handleDelete(e), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) })
    ] }, e.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FAB, { onClick: () => setOpen(true) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ExpenseDialog, { open, onOpenChange: setOpen })
  ] });
}
function ExpenseDialog({
  open,
  onOpenChange
}) {
  const {
    t
  } = useT();
  const qc = useQueryClient();
  const [title, setTitle] = reactExports.useState("");
  const [amount, setAmount] = reactExports.useState("");
  const [note, setNote] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  async function submit(e) {
    e.preventDefault();
    const amt = Number(amount) || 0;
    if (amt <= 0 || !title.trim()) return;
    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      title: title.trim(),
      amount: amt,
      note: note || null,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    setCachedData(qc, ["expenses"], (old) => [optimistic, ...old ?? []]);
    setTitle("");
    setAmount("");
    setNote("");
    onOpenChange(false);
    toast.success(t("save"));
    setBusy(true);
    try {
      await createExpenseFn({
        data: {
          title: title.trim(),
          amount: amt,
          note: note || null
        }
      });
      await refreshQueries(qc, ["expenses"], ["cashbox"]);
    } catch (err) {
      setCachedData(qc, ["expenses"], (old) => (old ?? []).filter((e2) => e2.id !== tempId));
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: t("add_expense") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: t("title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: title, onChange: (e) => setTitle(e.target.value) })
      ] }),
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
  ExpensesPage as component
};
