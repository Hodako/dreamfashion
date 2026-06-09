import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/cash-management")({
  component: CashManagementLayout,
});

function CashManagementLayout() {
  return <Outlet />;
}
