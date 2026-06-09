import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { I as Input, B as Button } from "./input-BH1plDoj.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { C as Card } from "./card-RGlIzTYo.mjs";
import { S as Switch$1, a as SwitchThumb } from "../_libs/radix-ui__react-switch.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { a as useT, u as useAuth, b as useTheme, d as uploadImageFn } from "./router-z4LwQaWn.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { f as getBusinessSettingsFn, h as createEmployeeLicenseFn, d as deleteLicenseFn, u as updateEmployeePermissionsFn, i as updateBusinessSettingsFn } from "./rpc-admin-C_T2waE5.mjs";
import { D as DEFAULT_EMPLOYEE_PERMISSIONS } from "./permissions-Dq-yqX07.mjs";
import { S as SpeedLoader } from "./speed-loader-CB-HFQKP.mjs";
import { u as useIsMobile } from "./use-mobile-D7iZtuRK.mjs";
import "../_libs/seroval.mjs";
import { T as Trash2 } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/tailwind-merge.mjs";
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
const Switch = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Switch$1,
  {
    className: cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      SwitchThumb,
      {
        className: cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = Switch$1.displayName;
const BUSINESS_TYPES = ["retail", "wholesale", "fashion", "grocery", "services"];
function SettingsPage() {
  const {
    t
  } = useT();
  const {
    user,
    refresh
  } = useAuth();
  const {
    theme,
    setTheme
  } = useTheme();
  const isMobile = useIsMobile();
  const qc = useQueryClient();
  const settings = useQuery({
    queryKey: ["business-settings"],
    queryFn: getBusinessSettingsFn
  });
  const [busy, setBusy] = reactExports.useState(false);
  const biz = settings.data?.business;
  const isOwner = settings.data?.role === "owner";
  async function saveBusiness(e) {
    e.preventDefault();
    if (!isOwner) return;
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await updateBusinessSettingsFn({
        data: {
          name: String(fd.get("name") || "HakimEzy"),
          logo_url: String(fd.get("logo_url") || "/logo.png"),
          business_type: String(fd.get("business_type") || "retail"),
          theme: "green",
          employee_limit: Number(fd.get("employee_limit")) || 5
        }
      });
      await refresh();
      qc.invalidateQueries({
        queryKey: ["business-settings"]
      });
      toast.success(t("save"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }
  async function uploadLogo(file) {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result.split(",")[1];
        const {
          url
        } = await uploadImageFn({
          data: {
            base64,
            fileName: file.name
          }
        });
        await updateBusinessSettingsFn({
          data: {
            logo_url: url
          }
        });
        await refresh();
        qc.invalidateQueries({
          queryKey: ["business-settings"]
        });
        toast.success(t("save"));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : String(err));
      }
    };
    reader.readAsDataURL(file);
  }
  if (settings.isLoading && !settings.data) return /* @__PURE__ */ jsxRuntimeExports.jsx(SpeedLoader, { fullScreen: false });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `space-y-6 pb-8 ${isMobile ? "max-w-lg" : "max-w-5xl"} mx-auto`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-serif font-bold", children: t("settings") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: user?.email })
    ] }),
    isOwner && biz && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card p-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Business Profile" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: saveBusiness, className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Company Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "name", defaultValue: biz.name, placeholder: "HakimEzy" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Logo URL" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "logo_url", defaultValue: biz.logo_url, placeholder: "/logo.png" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Upload Logo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "file", accept: "image/*", onChange: (e) => e.target.files?.[0] && uploadLogo(e.target.files[0]) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Business Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("select", { name: "business_type", defaultValue: biz.business_type, className: "w-full h-9 rounded-md border border-input bg-input px-3 text-sm", children: BUSINESS_TYPES.map((bt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: bt, children: bt }, bt)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Employee License Limit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "employee_limit", type: "number", min: 1, defaultValue: biz.employee_limit, placeholder: "5" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: t("appearance") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { name: "theme_mode", value: theme, onChange: (e) => setTheme(e.target.value), className: "w-full h-9 rounded-md border border-input bg-input px-3 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "light", children: t("theme_light") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "dark", children: t("theme_dark") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "system", children: t("theme_system") })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "w-full sm:w-auto", children: busy ? "…" : t("save") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card p-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Employee Licenses" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "1 license = 1 employee. Share key during their signup activation." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: async () => {
          try {
            const res = await createEmployeeLicenseFn({
              data: {
                permissions: DEFAULT_EMPLOYEE_PERMISSIONS
              }
            });
            toast.success(`Employee key: ${res.key}`);
            qc.invalidateQueries({
              queryKey: ["business-settings"]
            });
          } catch (err) {
            toast.error(err instanceof Error ? err.message : String(err));
          }
        }, children: "Generate Employee License" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border rounded-md border overflow-hidden", children: (settings.data?.employeeLicenses ?? []).map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 flex items-center justify-between gap-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono truncate", children: l.id }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: l.used ? "text-muted-foreground" : "text-success", children: l.used ? "Used" : "Open" }),
            !l.used && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "icon", className: "size-6 text-destructive", "aria-label": t("delete_license"), onClick: async () => {
              try {
                await deleteLicenseFn({
                  data: {
                    licenseKey: l.id
                  }
                });
                qc.invalidateQueries({
                  queryKey: ["business-settings"]
                });
                toast.success(t("delete_license"));
              } catch (err) {
                toast.error(err instanceof Error ? err.message : String(err));
              }
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3" }) })
          ] })
        ] }, l.id)) })
      ] })
    ] }),
    isOwner && (settings.data?.employees ?? []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Team & Privileges" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: (settings.data?.employees ?? []).map((emp) => /* @__PURE__ */ jsxRuntimeExports.jsx(EmployeePermissions, { employee: emp, onSave: async (perms) => {
        await updateEmployeePermissionsFn({
          data: {
            employeeId: emp.id,
            permissions: perms
          }
        });
        qc.invalidateQueries({
          queryKey: ["business-settings"]
        });
        toast.success(t("save"));
      } }, emp.id)) })
    ] }),
    !isOwner && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "glass-card p-5 text-sm text-muted-foreground max-w-2xl", children: "Employee account — contact your business owner for settings changes." })
  ] });
}
function EmployeePermissions({
  employee,
  onSave
}) {
  const [perms, setPerms] = reactExports.useState(employee.permissions || DEFAULT_EMPLOYEE_PERMISSIONS);
  const modules = ["dashboard", "products", "sales", "parties", "purchases", "expenses", "settings", "reports"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border rounded-lg p-3 space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm", children: employee.full_name || employee.email }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: modules.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between text-xs capitalize", children: [
      m,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: perms[m], onCheckedChange: (v) => setPerms((p) => ({
        ...p,
        [m]: v
      })) })
    ] }, m)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => onSave(perms), children: "Save permissions" })
  ] });
}
export {
  SettingsPage as component
};
