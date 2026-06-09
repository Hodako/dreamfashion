import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { SpeedLoader } from "@/components/speed-loader";

export const Route = createFileRoute("/")({
  ssr: false,
  component: Index,
});

function Index() {
  const { user, loading } = useAuth();

  if (loading) return <SpeedLoader />;

  if (!user) return <Navigate to="/auth" replace />;
  if (!user.activated) return <Navigate to="/activate" replace />;
  return <Navigate to="/dashboard" replace />;
}
