import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { b as getParties, a as getSales, j as getAllPayments, k as getAllPartyReceivables } from "./queries-Lma9DoHe.mjs";
import { u as useCachedQuery } from "./use-cached-query-DaopYbTj.mjs";
import { p as paginate, P as PaginationBar } from "./pagination-bar-A21-yJPk.mjs";
import { a as useT, p as createPartyFn } from "./router-z4LwQaWn.mjs";
import { a as fmtMoney } from "./format-BibW3dNi.mjs";
import { C as Card } from "./card-RGlIzTYo.mjs";
import { B as Button, I as Input } from "./input-BH1plDoj.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-DRM9Vy7D.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as setCachedData, r as refreshQueries } from "./optimistic-cache-Djd0Z039.mjs";
import "../_libs/seroval.mjs";
import { w as UserPlus, U as Users, h as Search, i as ChevronRight } from "../_libs/lucide-react.mjs";
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
function PartiesPage() {
  const {
    t
  } = useT();
  const parties = useCachedQuery(["parties"], getParties);
  const sales = useCachedQuery(["sales"], getSales);
  const allPayments = useCachedQuery(["all-payments"], getAllPayments);
  const allReceivables = useCachedQuery(["all-party-receivables"], getAllPartyReceivables);
  const qc = useQueryClient();
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [search, setSearch] = reactExports.useState("");
  const [page, setPage] = reactExports.useState(1);
  const pageSize = 10;
  const duesByParty = {};
  (sales.data ?? []).forEach((s) => {
    if (s.party_id) duesByParty[s.party_id] = (duesByParty[s.party_id] ?? 0) + Number(s.due_amount);
  });
  (allReceivables.data ?? []).forEach((r) => {
    duesByParty[r.party_id] = (duesByParty[r.party_id] ?? 0) + Number(r.amount);
  });
  const paidByParty = {};
  (allPayments.data ?? []).forEach((p) => {
    paidByParty[p.party_id] = (paidByParty[p.party_id] ?? 0) + Number(p.amount);
  });
  const extraByParty = {};
  (allReceivables.data ?? []).forEach((r) => {
    extraByParty[r.party_id] = (extraByParty[r.party_id] ?? 0) + Number(r.amount);
  });
  const allPartyIds = /* @__PURE__ */ new Set([...Object.keys(duesByParty), ...Object.keys(paidByParty)]);
  const totalOutstanding = [...allPartyIds].reduce((sum, pid) => {
    return sum + Math.max((duesByParty[pid] ?? 0) - (paidByParty[pid] ?? 0), 0);
  }, 0);
  const filtered = (parties.data ?? []).filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || (p.phone ?? "").includes(search));
  const {
    items: pagedParties,
    totalPages,
    safePage
  } = paginate(filtered, page, pageSize);
  function partyOutstanding(partyId) {
    const raw = (duesByParty[partyId] ?? 0) + (extraByParty[partyId] ?? 0);
    return Math.max(raw - (paidByParty[partyId] ?? 0), 0);
  }
  function prefetchParty(p) {
    setCachedData(qc, ["party", p.id], p);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold", children: t("party_collection") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
          parties.data?.length ?? 0,
          " ",
          t("parties")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => setAddOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "size-4 mr-1" }),
        t("add_party")
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-3 border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-lg bg-primary grid place-items-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "icon-sm text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: t("total_owed") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold font-serif text-primary", children: fmtMoney(totalOutstanding) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "pl-9", placeholder: t("search_parties"), value: search, onChange: (e) => {
        setSearch(e.target.value);
        setPage(1);
      } })
    ] }),
    parties.data && parties.data.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-10 text-muted-foreground mx-auto mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("no_parties") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "mt-4", onClick: () => setAddOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "size-4 mr-1" }),
        " ",
        t("add_party")
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      pagedParties.map((p) => {
        const outstanding = partyOutstanding(p.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/parties/$id", params: {
          id: p.id
        }, onMouseEnter: () => prefetchParty(p), onTouchStart: () => prefetchParty(p), className: "block w-full text-left active:scale-[0.99] transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: `overflow-hidden ${outstanding > 0 ? "border-primary/30" : "border-border"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center p-3 gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-9 rounded-full grid place-items-center text-sm font-bold shrink-0 ${outstanding > 0 ? "bg-primary/15 text-primary" : "bg-secondary text-secondary-foreground"}`, children: p.name.charAt(0).toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm truncate", children: p.name }),
            p.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: p.phone }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-primary mt-0.5", children: [
              t("view"),
              " →"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-sm font-bold ${outstanding > 0 ? "text-primary" : "text-success"}`, children: fmtMoney(outstanding) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-muted-foreground", children: outstanding > 0 ? t("outstanding") : t("clear") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "icon-sm text-muted-foreground shrink-0" })
        ] }) }) }, p.id);
      }),
      filtered.length === 0 && search && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-6", children: t("no_results") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PaginationBar, { page: safePage, totalPages, total: filtered.length, pageSize, onPageChange: setPage }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AddPartyDialog, { open: addOpen, onOpenChange: setAddOpen })
  ] });
}
function AddPartyDialog({
  open,
  onOpenChange
}) {
  const {
    t
  } = useT();
  const qc = useQueryClient();
  const [name, setName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  async function submit(e) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    const phoneVal = phone.trim() || null;
    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      name: trimmedName,
      phone: phoneVal,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    setCachedData(qc, ["parties"], (old) => [...old ?? [], optimistic].sort((a, b) => a.name.localeCompare(b.name)));
    setName("");
    setPhone("");
    onOpenChange(false);
    toast.success(`${trimmedName} — ${t("add_party")}`);
    setBusy(true);
    try {
      const saved = await createPartyFn({
        data: {
          name: trimmedName,
          phone: phoneVal
        }
      });
      setCachedData(qc, ["parties"], (old) => (old ?? []).map((p) => p.id === tempId ? {
        ...saved,
        id: saved.id
      } : p));
      await refreshQueries(qc, ["parties"]);
    } catch (err) {
      setCachedData(qc, ["parties"], (old) => (old ?? []).filter((p) => p.id !== tempId));
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "size-5" }),
      " ",
      t("add_party")
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground", children: [
          t("party_name"),
          " *"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, placeholder: t("party_name"), value: name, onChange: (e) => setName(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: t("phone") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { inputMode: "tel", placeholder: "01XXXXXXXXX", value: phone, onChange: (e) => setPhone(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: t("cancel") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, children: busy ? "…" : t("save") })
      ] })
    ] })
  ] }) });
}
export {
  PartiesPage as component
};
