"use client";

import Link from "next/link";
import {
  ShoppingCart, Receipt, PiggyBank, DollarSign,
  Banknote, BarChart3, Settings, FileText,
  LogOut
} from "lucide-react";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { canAccess, resolvePermissions } from "@/lib/permissions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const businessLinks = [
  { to: "/invoices",       labelKey: "invoice_generator", desc: "Create & customize invoices", icon: FileText,     perm: "sales"      as const },
  { to: "/purchases",      labelKey: "new_purchase",    desc: "Log product inventory buys", icon: ShoppingCart, perm: "purchases"  as const },
  { to: "/online-sells",   labelKey: "online_sell",     desc: "Track web and online sales", icon: DollarSign,   perm: "sales"      as const },
  { to: "/settings",       labelKey: "settings",        desc: "Business profile & settings", icon: Settings,     perm: "settings"   as const },
] as const;

const financeLinks = [
  { to: "/expenses",       labelKey: "expenses",        desc: "Record overhead expenses", icon: Receipt,      perm: "expenses"   as const },
  { to: "/somiti",         labelKey: "somiti",          desc: "Manage Somiti accounts", icon: PiggyBank,    perm: "expenses"   as const },
  { to: "/cash-management",labelKey: "cash_management", desc: "Cashbox ledger & cashflow", icon: Banknote,     perm: "expenses"   as const },
  { to: "/trackback",      labelKey: "trackback",       desc: "Comparative metrics chart", icon: BarChart3,    perm: "reports"    as const },
] as const;

export default function MorePage() {
  const { lang, t } = useT();
  const { user, logout } = useAuth();
  const perms = resolvePermissions(user?.role ?? "employee", user?.permissions);

  const visibleBiz = businessLinks.filter(item => canAccess(perms, item.perm));
  const visibleFin = financeLinks.filter(item => canAccess(perms, item.perm));

  const initials = user?.full_name
    ? user.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="space-y-5 pb-6">
      {/* Redesigned Profile Header */}
      <Card className="p-4 bg-gradient-to-br from-primary/10 via-indigo-500/5 to-background border-primary/20 beveled-card">
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-full bg-gradient-to-br from-primary to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md border-2 border-background">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-base text-zinc-950 dark:text-zinc-50 truncate">{user?.full_name || "User"}</h2>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wide border uppercase ${
                user?.role === "owner"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300"
              }`}>
                {user?.role === "owner" ? (lang === "bn" ? "মালিক" : "Owner") : (lang === "bn" ? "কর্মচারী" : "Employee")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{user?.email}</p>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium mt-1 uppercase tracking-wider">
              {user?.business_name || "Dream Fashion"}
            </div>
          </div>
        </div>
      </Card>

      {/* Group 1: Business Operations */}
      {visibleBiz.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            {lang === "bn" ? "ব্যবসা পরিচালনা" : "Business Operations"}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {visibleBiz.map(({ to, labelKey, desc, icon: Icon }) => (
              <Link key={to} href={to} className="block group">
                <Card className="p-3.5 h-full flex flex-col justify-between gap-3 hover:border-primary/30 transition-all active:scale-[0.98] beveled-card bg-card/60 backdrop-blur-sm">
                  <div className="size-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary grid place-items-center shrink-0 border border-primary/10 shadow-sm">
                    <Icon className="size-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors">{t(labelKey as any)}</div>
                    <p className="text-[9px] text-muted-foreground leading-tight">{desc}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Group 2: Accounting & Finance */}
      {visibleFin.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            {lang === "bn" ? "হিসাব ও বিশ্লেষণ" : "Accounting & Financials"}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {visibleFin.map(({ to, labelKey, desc, icon: Icon }) => (
              <Link key={to} href={to} className="block group">
                <Card className="p-3.5 h-full flex flex-col justify-between gap-3 hover:border-indigo-500/30 transition-all active:scale-[0.98] beveled-card bg-card/60 backdrop-blur-sm">
                  <div className="size-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 text-indigo-600 dark:text-indigo-400 grid place-items-center shrink-0 border border-indigo-500/10 shadow-sm">
                    <Icon className="size-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 transition-colors">{t(labelKey as any)}</div>
                    <p className="text-[9px] text-muted-foreground leading-tight">{desc}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Sign Out Button */}
      <div className="pt-2">
        <Button
          onClick={() => {
            if (confirm(lang === "bn" ? "আপনি কি লগআউট করতে চান?" : "Are you sure you want to sign out?")) {
              logout();
            }
          }}
          variant="outline"
          className="w-full h-10 border-rose-500/20 text-rose-600 hover:bg-rose-500/5 dark:hover:bg-rose-950/20 beveled-button rounded-xl text-xs font-semibold"
        >
          <LogOut className="size-4 mr-2" />
          {lang === "bn" ? "লগ আউট" : "Sign Out"}
        </Button>
      </div>
    </div>
  );
}
