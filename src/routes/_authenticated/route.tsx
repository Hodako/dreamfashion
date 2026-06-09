import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SpeedLoader } from "@/components/speed-loader";
import { useAuth } from "@/hooks/use-auth";

function AuthenticatedLayout() {
  const { user, loading } = useAuth();

  if (loading) return <SpeedLoader />;
  if (!user) return <Navigate to="/auth" replace />;
  if (!user.activated) return <Navigate to="/activate" replace />;

  return (
    <SidebarProvider>
      <AppShell />
    </SidebarProvider>
  );
}

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthenticatedLayout,
});
