import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { I as Input, B as Button } from "./input-BH1plDoj.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { C as Card } from "./card-RGlIzTYo.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as superAdminCheckFn, l as listPlatformLicensesFn, a as listBusinessesFn, b as superAdminLoginFn, c as superAdminLogoutFn, g as generatePlatformLicenseFn, d as deleteLicenseFn } from "./rpc-admin-C_T2waE5.mjs";
import { S as SpeedLoader } from "./speed-loader-CB-HFQKP.mjs";
import { f as fmtDateTime } from "./format-BibW3dNi.mjs";
import "../_libs/seroval.mjs";
import { T as Trash2 } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "./router-z4LwQaWn.mjs";
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
function SuperAdminPage() {
  const qc = useQueryClient();
  const auth = useQuery({
    queryKey: ["super-admin"],
    queryFn: superAdminCheckFn
  });
  const [username, setUsername] = reactExports.useState("superadmin");
  const [password, setPassword] = reactExports.useState("");
  const [limit, setLimit] = reactExports.useState("5");
  const [busy, setBusy] = reactExports.useState(false);
  const licenses = useQuery({
    queryKey: ["platform-licenses"],
    queryFn: listPlatformLicensesFn,
    enabled: auth.data?.authenticated === true
  });
  const businesses = useQuery({
    queryKey: ["businesses-admin"],
    queryFn: listBusinessesFn,
    enabled: auth.data?.authenticated === true
  });
  if (auth.isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(SpeedLoader, {});
  if (!auth.data?.authenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center p-4 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card w-full max-w-sm p-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-bold text-center", children: "HakimEzy Super Admin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          await superAdminLoginFn({
            data: {
              username,
              password
            }
          });
          qc.invalidateQueries({
            queryKey: ["super-admin"]
          });
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Login failed");
        } finally {
          setBusy(false);
        }
      }, className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Username" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "superadmin", value: username, onChange: (e) => setUsername(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", placeholder: "••••••••", value: password, onChange: (e) => setPassword(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: busy, children: busy ? "…" : "Login" })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen p-4 md:p-8 max-w-4xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Super Admin Panel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "HakimEzy platform licenses" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: async () => {
        await superAdminLogoutFn();
        qc.invalidateQueries({
          queryKey: ["super-admin"]
        });
      }, children: "Logout" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Generate Business License" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "w-24", inputMode: "numeric", placeholder: "Limit", value: limit, onChange: (e) => setLimit(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: async () => {
          try {
            const res = await generatePlatformLicenseFn({
              data: {
                employeeLimit: Number(limit) || 5
              }
            });
            toast.success(`License: ${res.key}`);
            qc.invalidateQueries({
              queryKey: ["platform-licenses"]
            });
          } catch (err) {
            toast.error(err instanceof Error ? err.message : String(err));
          }
        }, children: "Generate HZ License" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "1 license = 1 business owner signup. Set employee limit per license." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card divide-y overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 font-semibold text-sm", children: "Platform Licenses" }),
      (licenses.data ?? []).map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex items-center justify-between text-sm gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono text-xs truncate", children: l.id }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: l.used ? "text-muted-foreground" : "text-success font-medium", children: [
            l.used ? "Used" : "Available",
            " · limit ",
            l.employee_limit
          ] }),
          !l.used && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "icon", className: "size-7 text-destructive", onClick: async () => {
            try {
              await deleteLicenseFn({
                data: {
                  licenseKey: l.id
                }
              });
              qc.invalidateQueries({
                queryKey: ["platform-licenses"]
              });
              toast.success("License deleted");
            } catch (err) {
              toast.error(err instanceof Error ? err.message : String(err));
            }
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) })
        ] })
      ] }, l.id))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card divide-y overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 font-semibold text-sm", children: "Businesses" }),
      (businesses.data ?? []).map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex justify-between text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: b.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: fmtDateTime(b.created_at) })
      ] }, b.id))
    ] })
  ] });
}
export {
  SuperAdminPage as component
};
