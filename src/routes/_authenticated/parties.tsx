import { createFileRoute, Outlet } from "@tanstack/react-router";

/** Layout route — renders list (index) or party detail ($id) via Outlet. */
export const Route = createFileRoute("/_authenticated/parties")({
  component: PartiesLayout,
});

function PartiesLayout() {
  return <Outlet />;
}
