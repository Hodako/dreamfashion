"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { getProducts, getParties, getSales } from "@/lib/queries";
import {
  Home, Package, ShoppingBag, Users, MoreHorizontal,
  LogOut, Languages, Banknote, DollarSign, Settings,
  BarChart3, Receipt, PiggyBank, ShoppingCart, Moon, Sun, FileText,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AppLogo } from "@/components/app-logo";
import { SpeedLoader } from "@/components/speed-loader";
import { UniversalSearch } from "@/components/universal-search";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar, SidebarTrigger, SidebarContent, SidebarMenu,
  SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel,
  SidebarGroupContent, SidebarFooter, SidebarHeader,
} from "@/components/ui/sidebar";
import type { PermissionSet } from "@/lib/permissions";
import { canAccess, resolvePermissions } from "@/lib/permissions";
import { PermissionGuard } from "@/components/permission-guard";

type NavItem = {
  to: string;
  labelKey: "home" | "products" | "sales" | "parties" | "settings" | "more" | "online_sell" | "cash_management" | "trackback" | "expenses" | "somiti" | "new_purchase" | "invoice_generator";
  icon: React.ElementType;
  perm?: keyof PermissionSet;
};

type NavGroup = { labelKey: "navigation" | "more" | "reports"; items: NavItem[] };

const desktopNavGroups: NavGroup[] = [
  {
    labelKey: "navigation",
    items: [
      { to: "/dashboard", labelKey: "home", icon: Home, perm: "dashboard" },
      { to: "/products", labelKey: "products", icon: Package, perm: "products" },
      { to: "/sales", labelKey: "sales", icon: ShoppingBag, perm: "sales" },
      { to: "/parties", labelKey: "parties", icon: Users, perm: "parties" },
    ],
  },
  {
    labelKey: "more",
    items: [
      { to: "/invoices", labelKey: "invoice_generator", icon: FileText, perm: "sales" },
      { to: "/purchases", labelKey: "new_purchase", icon: ShoppingCart, perm: "purchases" },
      { to: "/expenses", labelKey: "expenses", icon: Receipt, perm: "expenses" },
      { to: "/somiti", labelKey: "somiti", icon: PiggyBank, perm: "expenses" },
      { to: "/online-sells", labelKey: "online_sell", icon: DollarSign, perm: "sales" },
      { to: "/cash-management", labelKey: "cash_management", icon: Banknote, perm: "expenses" },
    ],
  },
  {
    labelKey: "reports",
    items: [
      { to: "/trackback", labelKey: "trackback", icon: BarChart3, perm: "reports" },
      { to: "/purchase-reports", labelKey: "products_buy", icon: ShoppingCart, perm: "reports" },
      { to: "/settings", labelKey: "settings", icon: Settings, perm: "settings" },
    ],
  },
];

const mobileNav: NavItem[] = [
  { to: "/dashboard", labelKey: "home", icon: Home, perm: "dashboard" },
  { to: "/products", labelKey: "products", icon: Package, perm: "products" },
  { to: "/sales", labelKey: "sales", icon: ShoppingBag, perm: "sales" },
  { to: "/parties", labelKey: "parties", icon: Users, perm: "parties" },
  { to: "/more", labelKey: "more", icon: MoreHorizontal },
];

function filterNav(items: NavItem[], perms: PermissionSet) {
  return items.filter(item => !item.perm || perms[item.perm]);
}

function filterGroups(groups: NavGroup[], perms: PermissionSet): NavGroup[] {
  return groups
    .map(g => ({ ...g, items: filterNav(g.items, perms) }))
    .filter(g => g.items.length > 0);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t, lang, setLang } = useT();
  const { resolved, toggle } = useTheme();
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || "";
  const isMobile = useIsMobile();
  const qc = useQueryClient();

  useEffect(() => {
    if (!user?.activated) return;
    void qc.prefetchQuery({ queryKey: ["products"], queryFn: getProducts });
    void qc.prefetchQuery({ queryKey: ["sales"], queryFn: getSales });
    const perms = resolvePermissions(user.role, user.permissions);
    if (canAccess(perms, "parties")) {
      void qc.prefetchQuery({ queryKey: ["parties"], queryFn: getParties });
    }
  }, [user?.activated, user?.role, user?.permissions, qc]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [user, loading, router]);

  if (loading && !user) return <SpeedLoader />;
  if (!user) return null;

  const perms = resolvePermissions(user.role, user.permissions);
  const isEmployee = user.role === "employee";
  const sidebarGroups = filterGroups(desktopNavGroups, perms).map(group => ({
    ...group,
    items: group.items.filter(item => !(isEmployee && item.to === "/somiti"))
  })).filter(group => group.items.length > 0);
  const bottomNav = filterNav(mobileNav, perms).filter(item => !(isEmployee && item.to === "/somiti"));
  const brandName = user.business_name || "HakimEzy";
  const userInitials = user.email?.slice(0, 2).toUpperCase() ?? "HZ";

  async function handleSignOut() {
    await logout();
    router.replace("/auth");
  }

  function isActive(to: string) {
    return pathname === to || (to !== "/dashboard" && pathname.startsWith(to));
  }

  return (
    <div className="min-h-screen min-h-dvh bg-background flex w-full app-shell">
      {!isMobile && (
        <Sidebar collapsible="icon">
          <SidebarHeader className="border-b border-sidebar-border px-2 py-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <AppLogo size="sm" />
              <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="font-serif font-semibold text-sm truncate leading-tight">{brandName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{t("tagline")}</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            {sidebarGroups.map(group => (
              <SidebarGroup key={group.labelKey}>
                <SidebarGroupLabel>{t(group.labelKey)}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map(({ to, labelKey, icon: Icon }) => (
                      <SidebarMenuItem key={to}>
                        <SidebarMenuButton
                          isActive={isActive(to)}
                          tooltip={t(labelKey)}
                          onClick={() => router.push(to)}
                        >
                          <Icon className="icon-sm" />
                          <span>{t(labelKey)}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border">
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton size="lg" tooltip={user.email ?? "Account"}>
                      <Avatar className="size-6 shrink-0">
                        <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">{userInitials}</AvatarFallback>
                      </Avatar>
                      <span className="truncate text-sm">{user.email}</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="start" className="w-52">
                    <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setLang("bn")}>বাংলা {lang === "bn" && "✓"}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLang("en")}>English {lang === "en" && "✓"}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                      <LogOut className="icon-sm mr-2" />
                      {t("sign_out")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
      )}

      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <header className="sticky top-0 z-30 bg-card/85 backdrop-blur-lg border-b border-border/50 shrink-0">
          <div className="flex items-center h-12 px-3 gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {isMobile ? (
                <>
                  <AppLogo size="sm" />
                  <h1 className="font-serif font-semibold text-sm truncate leading-tight">{brandName}</h1>
                </>
              ) : (
                <>
                  <SidebarTrigger className="size-7 shrink-0" />
                  <h1 className="font-serif font-semibold text-base truncate leading-tight hidden sm:block">{brandName}</h1>
                </>
              )}
            </div>

            <div className="flex items-center gap-0.5 shrink-0">
              <UniversalSearch role={user.role} permissions={user.permissions} />
              <Button variant="ghost" size="icon" className="size-8" onClick={toggle} aria-label="Theme">
                {resolved === "dark" ? <Sun className="icon-sm" /> : <Moon className="icon-sm" />}
              </Button>
              {!isMobile && (
                <span className="text-[10px] text-muted-foreground mr-1 hidden lg:block">
                  {new Date().toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })}
                </span>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <Languages className="icon-sm" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLang("bn")}>বাংলা {lang === "bn" && "✓"}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLang("en")}>English {lang === "en" && "✓"}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <Avatar className="size-5">
                      <AvatarFallback className="text-[9px] bg-primary text-primary-foreground">{userInitials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="text-xs max-w-[180px] truncate">{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive text-xs">
                    <LogOut className="icon-sm mr-2" />
                    {t("sign_out")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className={`flex-1 min-h-0 overflow-y-auto overscroll-y-contain ${isMobile ? "px-3 pt-3" : "px-6 py-5"}`}>
          <div className={isMobile ? "w-full max-w-lg mx-auto mobile-content-pad" : "w-full max-w-screen-2xl mx-auto"}>
            <PermissionGuard>
              {children}
            </PermissionGuard>
          </div>
          {isMobile && <div className="mobile-bottom-spacer" aria-hidden />}
        </main>
      </div>

      {isMobile && bottomNav.length > 0 && (
        <nav className="fixed bottom-0 inset-x-0 z-40 bg-card/92 backdrop-blur-lg border-t border-border/50 safe-area-pb mobile-tab-bar" style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 0px)" }}>
          <div
            className="grid h-14 max-w-lg mx-auto min-h-[3.5rem]"
            style={{ gridTemplateColumns: `repeat(${bottomNav.length}, minmax(0, 1fr))` }}
          >
            {bottomNav.map(({ to, labelKey, icon: Icon }) => {
              const active = isActive(to);
              return (
                <Link
                  key={to}
                  href={to}
                  className={`flex flex-col items-center justify-center gap-0.5 text-[9px] font-medium transition-colors active:scale-95 ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div className={`p-1.5 rounded-xl ${active ? "bg-primary/15" : ""}`}>
                    <Icon className="icon-sm" />
                  </div>
                  <span className="leading-none">{t(labelKey)}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
