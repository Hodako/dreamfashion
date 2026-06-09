import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, N as Navigate } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth, a as useT } from "./router-z4LwQaWn.mjs";
import { I as Input, B as Button } from "./input-BH1plDoj.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { C as Card } from "./card-RGlIzTYo.mjs";
import { A as AppLogo } from "./app-logo-tn434T1k.mjs";
import { S as SpeedLoader } from "./speed-loader-CB-HFQKP.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { e as activateLicenseFn } from "./rpc-admin-C_T2waE5.mjs";
import "../_libs/seroval.mjs";
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
import "../_libs/tanstack__react-query.mjs";
import "./server-DaU8DV72.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
function ActivatePage() {
  const {
    user,
    loading,
    refresh
  } = useAuth();
  const {
    t
  } = useT();
  const navigate = useNavigate();
  const [key, setKey] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(SpeedLoader, {});
  if (!user) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/auth", replace: true });
  if (user.activated) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/dashboard", replace: true });
  async function submit(e) {
    e.preventDefault();
    if (!key.trim()) return;
    setBusy(true);
    try {
      await activateLicenseFn({
        data: {
          licenseKey: key.trim()
        }
      });
      await refresh();
      toast.success(t("save"));
      navigate({
        to: "/dashboard",
        replace: true
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card w-full max-w-md p-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppLogo, { size: "lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-serif font-bold", children: "Activate License" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Enter your business or employee license key to activate HakimEzy." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "License Key" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "HZ-XXXX-XXXX-XXXX or EMP-XXXX-XXXX-XXXX", value: key, onChange: (e) => setKey(e.target.value.toUpperCase()), className: "font-mono uppercase" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: busy, children: busy ? "…" : "Activate Account" })
    ] })
  ] }) });
}
export {
  ActivatePage as component
};
