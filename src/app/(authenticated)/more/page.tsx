"use client";

import Link from "next/link";
import {
  ShoppingCart, Receipt, PiggyBank, DollarSign,
  Banknote, BarChart3, Settings, ChevronRight,
} from "lucide-react";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { canAccess, resolvePermissions } from "@/lib/permissions";
import { Card } from "@/components/ui/card";

const moreLinks = [
  { to: "/purchases",      labelKey: "new_purchase",    icon: ShoppingCart, perm: "purchases"  as const },
  { to: "/expenses",       labelKey: "expenses",        icon: Receipt,      perm: "expenses"   as const },
  { to: "/somiti",         labelKey: "somiti",          icon: PiggyBank,    perm: "expenses"   as const },
  { to: "/online-sells",   labelKey: "online_sell",     icon: DollarSign,   perm: "sales"      as const },
  { to: "/cash-management",labelKey: "cash_management", icon: Banknote,     perm: "expenses"   as const },
  { to: "/trackback",      labelKey: "trackback",       icon: BarChart3,    perm: "reports"    as const },
  { to: "/settings",       labelKey: "settings",        icon: Settings,     perm: "settings"   as const },
] as const;

export default function MorePage() {
  const { t } = useT();
  const { user } = useAuth();
  const perms = resolvePermissions(user?.role ?? "employee", user?.permissions);

  const visible = moreLinks.filter(item => canAccess(perms, item.perm));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">{t("more")}</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{t("more")}</p>
      </div>

      <div className="space-y-2">
        {visible.map(({ to, labelKey, icon: Icon }) => (
          <Link key={to} href={to}>
            <Card className="flex items-center gap-4 px-4 py-3.5 hover:bg-accent transition-colors active:scale-[0.99] transition-transform">
              <div className="size-9 rounded-xl bg-primary/10 grid place-items-center shrink-0">
                <Icon className="size-5 text-primary" />
              </div>
              <span className="flex-1 font-medium text-sm">{t(labelKey as any)}</span>
              <ChevronRight className="size-4 text-muted-foreground shrink-0" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
