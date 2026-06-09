import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, N as Navigate } from "../_libs/tanstack__react-router.mjs";
import { A as AppLogo } from "./app-logo-tn434T1k.mjs";
import { S as SpeedLoader } from "./speed-loader-CB-HFQKP.mjs";
import { u as useAuth, a as useT, l as loginFn, r as registerFn } from "./router-z4LwQaWn.mjs";
import { I as Input, B as Button } from "./input-BH1plDoj.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-D_u1EXWn.mjs";
import { C as Card } from "./card-RGlIzTYo.mjs";
import { t as toast } from "../_libs/sonner.mjs";
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
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
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
function AuthPage() {
  const {
    user,
    loading,
    login
  } = useAuth();
  const {
    t,
    lang,
    setLang
  } = useT();
  const navigate = useNavigate();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [fullName, setFullName] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(SpeedLoader, {});
  if (user?.activated) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/dashboard", replace: true });
  if (user && !user.activated) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/activate", replace: true });
  function afterAuth(u) {
    if (!u) return;
    login(u);
    navigate({
      to: u.activated ? "/dashboard" : "/activate",
      replace: true
    });
  }
  async function signIn(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await loginFn({
        data: {
          email,
          password
        }
      });
      afterAuth(data.user);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }
  async function signUp(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await registerFn({
        data: {
          email,
          password,
          fullName
        }
      });
      toast.success(lang === "bn" ? "একাউন্ট তৈরি — লাইসেন্স দিয়ে সক্রিয় করুন" : "Account created — activate with license");
      afterAuth(data.user);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppLogo, { size: "sm", alt: "HakimEzy" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 rounded-full glass-card p-1 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setLang("bn"), className: `px-3 py-1 rounded-full ${lang === "bn" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`, children: "বাংলা" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setLang("en"), className: `px-3 py-1 rounded-full ${lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`, children: "EN" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card w-full max-w-md p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6 flex flex-col items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AppLogo, { size: "lg", alt: "HakimEzy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-serif font-bold", children: "HakimEzy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("tagline") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "signin", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid grid-cols-2 w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "signin", children: t("sign_in") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "signup", children: t("sign_up") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "signin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: signIn, className: "space-y-3 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("email"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", required: true, placeholder: "you@business.com", value: email, onChange: (e) => setEmail(e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("password"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", required: true, placeholder: "Enter your password", value: password, onChange: (e) => setPassword(e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "w-full", children: busy ? "…" : t("sign_in") })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "signup", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: signUp, className: "space-y-3 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("full_name"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Your full name", value: fullName, onChange: (e) => setFullName(e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("email"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", required: true, placeholder: "owner@hakimezy.com", value: email, onChange: (e) => setEmail(e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("password"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", required: true, minLength: 6, placeholder: "Min. 6 characters", value: password, onChange: (e) => setPassword(e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "After signup you will activate with a license key (HZ-… or EMP-…)." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "w-full", children: busy ? "…" : t("create_account") })
        ] }) })
      ] })
    ] }) })
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-muted-foreground", children: label }),
    children
  ] });
}
export {
  AuthPage as component
};
