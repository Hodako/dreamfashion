import type { ReactNode } from "react";
import { Navigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { canAccess, permissionForPath, resolvePermissions } from "@/lib/permissions";

/** Redirects employees away from routes they lack permission for. */
export function PermissionGuard({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const pathname = useRouterState({ select: r => r.location.pathname });

  if (!user) return <>{children}</>;

  const perms = resolvePermissions(user.role, user.permissions);
  const required = permissionForPath(pathname);

  if (required && !canAccess(perms, required)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
