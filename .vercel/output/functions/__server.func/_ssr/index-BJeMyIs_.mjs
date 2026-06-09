import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { N as Navigate } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./router-z4LwQaWn.mjs";
import { S as SpeedLoader } from "./speed-loader-CB-HFQKP.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
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
function Index() {
  const {
    user,
    loading
  } = useAuth();
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(SpeedLoader, {});
  if (!user) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/auth", replace: true });
  if (!user.activated) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/activate", replace: true });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/dashboard", replace: true });
}
export {
  Index as component
};
