import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { l as getParty, m as getSalesForParty, n as getPaymentsForParty, o as getPartyReceivables, p as getPartyPayables, q as getPayableSettlements } from "./queries-Lma9DoHe.mjs";
import { R as Route$1, a as useT, q as deletePartyFn, s as deletePaymentFn, t as deleteSaleFn, v as deletePartyReceivableFn, w as deletePartyPayableFn, x as createPaymentFn, y as createPayableSettlementFn, z as updatePartyFn, A as createPartyReceivableFn, B as createPartyPayableFn } from "./router-z4LwQaWn.mjs";
import { a as fmtMoney, f as fmtDateTime } from "./format-BibW3dNi.mjs";
import { C as Card } from "./card-RGlIzTYo.mjs";
import { B as Button, I as Input } from "./input-BH1plDoj.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-DRM9Vy7D.mjs";
import { S as SpeedLoader } from "./speed-loader-CB-HFQKP.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useCachedQuery } from "./use-cached-query-DaopYbTj.mjs";
import { s as setCachedData, r as refreshQueries } from "./optimistic-cache-Djd0Z039.mjs";
import "../_libs/seroval.mjs";
import { F as ArrowLeft, n as Pencil, T as Trash2, G as ArrowDownToLine, P as Plus } from "../_libs/lucide-react.mjs";
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
import "./server-DaU8DV72.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
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
function PartyDetail() {
  const {
    id
  } = Route$1.useParams();
  const {
    t
  } = useT();
  const nav = useNavigate();
  const qc = useQueryClient();
  const partyQuery = useCachedQuery(["party", id], () => getParty(id));
  const sales = useCachedQuery(["party-detail", "sales", id], () => getSalesForParty(id));
  const payments = useCachedQuery(["payments", id], () => getPaymentsForParty(id));
  const receivables = useCachedQuery(["party-receivables", id], () => getPartyReceivables(id));
  const payables = useCachedQuery(["party-payables", id], () => getPartyPayables(id));
  const settlements = useCachedQuery(["party-settlements", id], () => getPayableSettlements(id));
  const [collectOpen, setCollectOpen] = reactExports.useState(false);
  const [payOpen, setPayOpen] = reactExports.useState(false);
  const [editOpen, setEditOpen] = reactExports.useState(false);
  const [addKind, setAddKind] = reactExports.useState(null);
  const party = partyQuery.data;
  const isLoading = partyQuery.isLoading && !party;
  const saleDue = (sales.data ?? []).reduce((a, s) => a + Number(s.due_amount), 0);
  const extraReceivable = (receivables.data ?? []).reduce((a, r) => a + Number(r.amount), 0);
  const paidTotal = (payments.data ?? []).reduce((a, p) => a + Number(p.amount), 0);
  const outstanding = Math.max(saleDue + extraReceivable - paidTotal, 0);
  const payableTotal = (payables.data ?? []).reduce((a, p) => a + Number(p.amount), 0);
  const settledTotal = (settlements.data ?? []).reduce((a, s) => a + Number(s.amount), 0);
  const payableOutstanding = Math.max(payableTotal - settledTotal, 0);
  const entries = [...(sales.data ?? []).filter((s) => Number(s.due_amount) > 0).map((s) => ({
    id: "s" + s.id,
    rawId: s.id,
    date: s.created_at,
    label: s.product_id ? `${s.product_name} ×${s.qty}` : s.product_name,
    amount: Number(s.due_amount),
    kind: "sale",
    deletable: !s.product_id
  })), ...(receivables.data ?? []).map((r) => ({
    id: "r" + r.id,
    rawId: r.id,
    date: r.created_at,
    label: r.note || t("money_owed"),
    amount: Number(r.amount),
    kind: "receivable",
    deletable: true
  })), ...(payments.data ?? []).map((p) => ({
    id: "p" + p.id,
    rawId: p.id,
    date: p.created_at,
    label: p.note || t("collect_payment"),
    amount: -Number(p.amount),
    kind: "payment",
    deletable: true
  })), ...(payables.data ?? []).map((p) => ({
    id: "pb" + p.id,
    rawId: p.id,
    date: p.created_at,
    label: p.note || t("money_payable"),
    amount: Number(p.amount),
    kind: "payable",
    deletable: true
  })), ...(settlements.data ?? []).map((s) => ({
    id: "st" + s.id,
    rawId: s.id,
    date: s.created_at,
    label: s.note || t("pay_party"),
    amount: -Number(s.amount),
    kind: "settlement",
    deletable: false
  }))].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  async function handleDelete(entry) {
    if (!confirm(t("delete") + "?")) return;
    try {
      if (entry.kind === "payment") {
        setCachedData(qc, ["payments", id], (old) => (old ?? []).filter((p) => p.id !== entry.rawId));
        await deletePaymentFn({
          data: {
            id: entry.rawId
          }
        });
      } else if (entry.kind === "sale") {
        setCachedData(qc, ["party-detail", "sales", id], (old) => (old ?? []).filter((s) => s.id !== entry.rawId));
        await deleteSaleFn({
          data: {
            id: entry.rawId
          }
        });
      } else if (entry.kind === "receivable") {
        setCachedData(qc, ["party-receivables", id], (old) => (old ?? []).filter((r) => r.id !== entry.rawId));
        await deletePartyReceivableFn({
          data: {
            id: entry.rawId
          }
        });
      } else if (entry.kind === "payable") {
        setCachedData(qc, ["party-payables", id], (old) => (old ?? []).filter((p) => p.id !== entry.rawId));
        await deletePartyPayableFn({
          data: {
            id: entry.rawId
          }
        });
      }
      await refreshQueries(qc, ["all-payments"], ["sales"], ["all-party-receivables"]);
      toast.success(t("delete"));
    } catch (err) {
      await refreshQueries(qc, ["payments", id], ["party-detail", "sales", id], ["party-receivables", id], ["party-payables", id]);
      toast.error(err instanceof Error ? err.message : String(err));
    }
  }
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(SpeedLoader, { fullScreen: false });
  if (!party) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-center py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: t("no_results") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/parties", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4 mr-1" }),
        t("parties")
      ] }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/parties", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4 mr-1" }),
      t("parties")
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: party.name }),
        party.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: party.phone })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => setEditOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-3.5 mr-1" }),
          t("edit")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "text-destructive border-destructive/30", onClick: async () => {
          if (!confirm(t("delete") + ` ${party.name}?`)) return;
          try {
            setCachedData(qc, ["parties"], (old) => (old ?? []).filter((p) => p.id !== id));
            await deletePartyFn({
              data: {
                id
              }
            });
            await refreshQueries(qc, ["parties"]);
            toast.success(t("delete"));
            nav({
              to: "/parties"
            });
          } catch (err) {
            await refreshQueries(qc, ["parties"]);
            toast.error(err instanceof Error ? err.message : String(err));
          }
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) })
      ] })
    ] }),
    (sales.isFetching || payments.isFetching) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 rounded-full bg-primary/20 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-1/3 bg-primary animate-pulse rounded-full" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 glass-card border-primary/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium text-muted-foreground", children: t("borrowed_from_me") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-amber-600 mt-1", children: fmtMoney(outstanding) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "mt-2 w-full h-8 text-xs", size: "sm", onClick: () => setCollectOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownToLine, { className: "size-3.5 mr-1" }),
          t("collect_payment")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 glass-card border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium text-muted-foreground", children: t("borrowed_from_him") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-rose-600 mt-1", children: fmtMoney(payableOutstanding) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-2 w-full h-8 text-xs", size: "sm", variant: "outline", onClick: () => setPayOpen(true), children: t("pay_party") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "flex-1", onClick: () => setAddKind("receivable"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5 mr-1" }),
        t("add_money_owed")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "flex-1", onClick: () => setAddKind("payable"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5 mr-1" }),
        t("add_payable")
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: t("history") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "divide-y divide-border overflow-hidden", children: [
        entries.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-center text-sm text-muted-foreground", children: t("no_activity") }),
        entries.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium truncate text-sm", children: e.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: fmtDateTime(e.date) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-sm font-semibold shrink-0 ${e.amount < 0 ? "text-emerald-600" : "text-amber-600"}`, children: [
            e.amount < 0 ? "−" : "+",
            fmtMoney(Math.abs(e.amount))
          ] }),
          e.deletable && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "h-7 w-7 p-0 text-destructive shrink-0", onClick: () => handleDelete(e), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) })
        ] }, e.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CollectDialog, { partyId: id, open: collectOpen, onOpenChange: setCollectOpen }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PayPartyDialog, { partyId: id, open: payOpen, onOpenChange: setPayOpen }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EditPartyDialog, { party, open: editOpen, onOpenChange: setEditOpen }),
    addKind && /* @__PURE__ */ jsxRuntimeExports.jsx(AddLedgerDialog, { partyId: id, kind: addKind, open: !!addKind, onOpenChange: (v) => {
      if (!v) setAddKind(null);
    } })
  ] });
}
function EditPartyDialog({
  party,
  open,
  onOpenChange
}) {
  const {
    t
  } = useT();
  const qc = useQueryClient();
  const [name, setName] = reactExports.useState(party.name);
  const [phone, setPhone] = reactExports.useState(party.phone ?? "");
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (open) {
      setName(party.name);
      setPhone(party.phone ?? "");
    }
  }, [open, party.id, party.name, party.phone]);
  async function submit(e) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    const phoneVal = phone.trim() || null;
    const prevParty = qc.getQueryData(["party", party.id]);
    const prevParties = qc.getQueryData(["parties"]);
    setCachedData(qc, ["party", party.id], {
      ...party,
      name: trimmedName,
      phone: phoneVal
    });
    setCachedData(qc, ["parties"], (old) => (old ?? []).map((p) => p.id === party.id ? {
      ...p,
      name: trimmedName,
      phone: phoneVal
    } : p));
    onOpenChange(false);
    toast.success(t("save"));
    setBusy(true);
    try {
      await updatePartyFn({
        data: {
          id: party.id,
          name: trimmedName,
          phone: phoneVal
        }
      });
      await refreshQueries(qc, ["parties"], ["party", party.id]);
    } catch (err) {
      if (prevParty) setCachedData(qc, ["party", party.id], prevParty);
      if (prevParties) setCachedData(qc, ["parties"], prevParties);
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: t("edit_party") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: t("party_name") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: name, onChange: (e) => setName(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: t("phone") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { inputMode: "tel", value: phone, onChange: (e) => setPhone(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: t("cancel") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, children: busy ? "…" : t("save") })
      ] })
    ] })
  ] }) });
}
function AddLedgerDialog({
  partyId,
  kind,
  open,
  onOpenChange
}) {
  const {
    t
  } = useT();
  const qc = useQueryClient();
  const [amount, setAmount] = reactExports.useState("");
  const [note, setNote] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const queryKey = kind === "receivable" ? ["party-receivables", partyId] : ["party-payables", partyId];
  reactExports.useEffect(() => {
    if (!open) {
      setAmount("");
      setNote("");
    }
  }, [open]);
  async function submit(e) {
    e.preventDefault();
    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) return;
    const tempId = `temp-${Date.now()}`;
    const entry = {
      id: tempId,
      party_id: partyId,
      amount: amt,
      note: note || null,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    setCachedData(qc, queryKey, (old) => [entry, ...old ?? []]);
    onOpenChange(false);
    toast.success(t("save"));
    setBusy(true);
    try {
      const saved = kind === "receivable" ? await createPartyReceivableFn({
        data: {
          party_id: partyId,
          amount: amt,
          note: note || null
        }
      }) : await createPartyPayableFn({
        data: {
          party_id: partyId,
          amount: amt,
          note: note || null
        }
      });
      setCachedData(qc, queryKey, (old) => (old ?? []).map((r) => r.id === tempId ? {
        ...saved,
        id: saved.id
      } : r));
      await refreshQueries(qc, queryKey, ["all-party-receivables"]);
    } catch (err) {
      setCachedData(qc, queryKey, (old) => (old ?? []).filter((r) => r.id !== tempId));
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: kind === "receivable" ? t("add_money_owed") : t("add_payable") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
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
function CollectDialog({
  partyId,
  open,
  onOpenChange
}) {
  const {
    t
  } = useT();
  const qc = useQueryClient();
  const [amount, setAmount] = reactExports.useState("");
  const [note, setNote] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!open) {
      setAmount("");
      setNote("");
    }
  }, [open]);
  async function submit(e) {
    e.preventDefault();
    const amt = Number(amount) || 0;
    if (amt <= 0) return;
    const tempId = `temp-${Date.now()}`;
    const entry = {
      id: tempId,
      party_id: partyId,
      amount: amt,
      note: note || null,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    setCachedData(qc, ["payments", partyId], (old) => [entry, ...old ?? []]);
    onOpenChange(false);
    toast.success(t("save"));
    setBusy(true);
    try {
      const saved = await createPaymentFn({
        data: {
          party_id: partyId,
          amount: amt,
          note: note || null
        }
      });
      setCachedData(qc, ["payments", partyId], (old) => (old ?? []).map((p) => p.id === tempId ? {
        ...saved,
        id: saved.id
      } : p));
      await refreshQueries(qc, ["all-payments"]);
    } catch (err) {
      setCachedData(qc, ["payments", partyId], (old) => (old ?? []).filter((p) => p.id !== tempId));
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: t("collect_payment") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
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
function PayPartyDialog({
  partyId,
  open,
  onOpenChange
}) {
  const {
    t
  } = useT();
  const qc = useQueryClient();
  const [amount, setAmount] = reactExports.useState("");
  const [note, setNote] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!open) {
      setAmount("");
      setNote("");
    }
  }, [open]);
  async function submit(e) {
    e.preventDefault();
    const amt = Number(amount) || 0;
    if (amt <= 0) return;
    const tempId = `temp-${Date.now()}`;
    const entry = {
      id: tempId,
      party_id: partyId,
      amount: amt,
      note: note || null,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    setCachedData(qc, ["party-settlements", partyId], (old) => [entry, ...old ?? []]);
    onOpenChange(false);
    toast.success(t("save"));
    setBusy(true);
    try {
      const saved = await createPayableSettlementFn({
        data: {
          party_id: partyId,
          amount: amt,
          note: note || null
        }
      });
      setCachedData(qc, ["party-settlements", partyId], (old) => (old ?? []).map((s) => s.id === tempId ? {
        ...saved,
        id: saved.id
      } : s));
      await refreshQueries(qc, ["party-settlements", partyId]);
    } catch (err) {
      setCachedData(qc, ["party-settlements", partyId], (old) => (old ?? []).filter((s) => s.id !== tempId));
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: t("pay_party") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
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
  PartyDetail as component
};
