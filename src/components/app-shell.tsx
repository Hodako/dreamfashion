import { Link, useRouterState, Outlet, useNavigate } from "@tanstack/react-router";
import { Home, Package, ShoppingBag, Users, MoreHorizontal, Sparkles, LogOut, Languages } from "lucide-react";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Navigate } from "@tanstack/react-router";

export function AppShell() {
  const { t, lang, setLang } = useT();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">…</div>;
  if (!user) return <Navigate to="/auth" replace />;

  const tabs = [
    { to: "/dashboard", label: t("home"), icon: Home },
    { to: "/products", label: t("products"), icon: Package },
    { to: "/sales", label: t("sales"), icon: ShoppingBag },
    { to: "/parties", label: t("parties"), icon: Users },
    { to: "/more", label: t("more"), icon: MoreHorizontal },
  ] as const;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-30 backdrop-blur bg-background/80 border-b border-border">
        <div className="mx-auto max-w-2xl flex items-center justify-between px-4 h-14">
          <Link to="/dashboard" className="flex items-center gap-2 text-primary font-semibold">
            <div className="size-8 rounded-xl bg-gradient-to-br from-primary to-success grid place-items-center text-primary-foreground">
              <Sparkles className="size-4" />
            </div>
            <span className="text-sm">{t("app_name")}</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon"><Languages className="size-5" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setLang("bn")}>
                বাংলা {lang==="bn"&&"✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang("en")}>
                English {lang==="en"&&"✓"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/auth", replace: true }); }}>
                <LogOut className="size-4 mr-2" /> {t("sign_out")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-2xl px-4 pt-4 pb-28">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-2xl grid grid-cols-5">
          {tabs.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || (to !== "/dashboard" && pathname.startsWith(to));
            return (
              <Link key={to} to={to} className={`flex flex-col items-center justify-center py-2.5 gap-0.5 text-[11px] transition-colors ${active?"text-primary":"text-muted-foreground"}`}>
                <Icon className={`size-5 ${active?"fill-primary/10":""}`} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}