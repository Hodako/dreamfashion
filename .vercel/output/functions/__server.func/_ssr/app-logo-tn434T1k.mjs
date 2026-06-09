import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { u as useAuth } from "./router-z4LwQaWn.mjs";
const sizes = { sm: "h-7", md: "h-9", lg: "h-12" };
function AppLogo({ className, size = "md", src, alt }) {
  const { user } = useAuth();
  const logoSrc = src ?? user?.logo_url ?? "/logo.png";
  const logoAlt = alt ?? user?.business_name ?? "HakimEzy";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "img",
    {
      src: logoSrc,
      alt: logoAlt,
      className: cn("w-auto object-contain", sizes[size], className),
      onError: (e) => {
        e.target.src = "/logo.png";
      }
    }
  );
}
export {
  AppLogo as A
};
