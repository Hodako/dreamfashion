import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as Button } from "./input-BH1plDoj.mjs";
import { J as ChevronLeft, i as ChevronRight } from "../_libs/lucide-react.mjs";
function PaginationBar({ page, totalPages, total, pageSize, onPageChange }) {
  if (totalPages <= 1) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 py-2 text-xs text-muted-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
      from,
      "–",
      to,
      " / ",
      total
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "icon",
          className: "size-7",
          disabled: page <= 1,
          onClick: () => onPageChange(page - 1),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "size-3.5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2 font-medium text-foreground", children: [
        page,
        "/",
        totalPages
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "icon",
          className: "size-7",
          disabled: page >= totalPages,
          onClick: () => onPageChange(page + 1),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3.5" })
        }
      )
    ] })
  ] });
}
function paginate(items, page, pageSize) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), totalPages, safePage };
}
export {
  PaginationBar as P,
  paginate as p
};
