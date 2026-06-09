import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  Receipt, PiggyBank, ShoppingCart, HandCoins,
  DollarSign, Banknote, Users,
  ChevronRight, Settings, BarChart3, Moon, Sun, Monitor,
} from "lucide-react";
import { useTheme, type ThemeMode } from "@/hooks/use-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";
import { canAccess, resolvePermissions } from "@/lib/permissions";
import { useCachedQuery } from "@/hooks/use-cached-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useT } from "@/lib/i18n";
import { getWithdrawals, getSales, getExpenses, getSomiti, getParties, getPaymentsForParty } from "@/lib/queries";
import { fmtMoney, fmtDateTime } from "@/lib/format";
import { useState } from "react";
import { toast } from "sonner";
import { createWithdrawalFn } from "@/lib/rpc";
import { ReportsPanel } from "@/components/reports-panel";

export const Route = createFileRoute("/_authenticated/more")({
  component: MorePage,
});

// ── helper: total outstanding across all parties ──────────────────────────
function usePartyOutstanding(enabled: boolean) {
  const parties = useCachedQuery(["parties"], getParties, { enabled });
  const sales = useCachedQuery(["sales"], getSales);

  const duesByParty: Record<string, number> = {};
  (sales.data ?? []).forEach(s => {
    if (s.party_id) duesByParty[s.party_id] = (duesByParty[s.party_id] ?? 0) + Number(s.due_amount);
  });

  // sum each party's outstanding (due - payments)
  // We only have global payments accessible here via sales so we use raw dues as estimate
  const totalRaw = Object.values(duesByParty).reduce((a, b) => a + b, 0);
  return { totalRaw, partyCount: parties.data?.length ?? 0, isLoading: parties.isLoading || sales.isLoading };
}

// ── section header ────────────────────────────────────────────────────────
function SectionTitle({ icon: Icon, title, color }: { icon: React.ElementType; title: string; color: string }) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <div className={`size-7 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="size-3.5 text-white" />
      </div>
      <h2 className="font-semibold text-sm">{title}</h2>
    </div>
  );
}

// ── nav link card ─────────────────────────────────────────────────────────
function NavCard({ to, icon: Icon, label, badge, badgeColor = "text-warning" }: {
  to: string; icon: React.ElementType; label: string; badge?: string; badgeColor?: string;
}) {
  return (
    <Link to={to} className="block">
      <Card className="p-4 flex items-center justify-between hover:bg-accent/50 transition-colors cursor-pointer active:scale-[0.98]">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/10 text-primary grid place-items-center">
            <Icon className="size-4" />
          </div>
          <span className="font-medium text-sm">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {badge && <span className={`text-sm font-bold ${badgeColor}`}>{badge}</span>}
          <ChevronRight className="size-4 text-muted-foreground" />
        </div>
      </Card>
    </Link>
  );
}

// ── main more page ────────────────────────────────────────────────────────
function ThemeCard() {
  const { t } = useT();
  const { theme, setTheme } = useTheme();
  const modes: { id: ThemeMode; icon: React.ElementType; label: string }[] = [
    { id: "light", icon: Sun, label: t("theme_light") },
    { id: "dark", icon: Moon, label: t("theme_dark") },
    { id: "system", icon: Monitor, label: t("theme_system") },
  ];
  return (
    <Card className="glass-card p-4 space-y-3">
      <h2 className="font-semibold text-sm">{t("appearance")}</h2>
      <div className="grid grid-cols-3 gap-2">
        {modes.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTheme(id)}
            className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs font-medium transition-colors ${
              theme === id ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-accent/50"
            }`}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>
    </Card>
  );
}

function MorePage() {
  const { t } = useT();
  const { user } = useAuth();
  const perms = resolvePermissions(user?.role ?? "employee", user?.permissions);
  const isMobile = useIsMobile();
  const showParties = canAccess(perms, "parties");
  const showExpenses = canAccess(perms, "expenses");
  const showReports = canAccess(perms, "reports");
  const showSettings = canAccess(perms, "settings");
  const showPurchases = canAccess(perms, "purchases");

  const expenses = useCachedQuery(["expenses"], getExpenses, { enabled: showExpenses });
  const somiti = useCachedQuery(["somiti"], getSomiti, { enabled: showExpenses });
  const withdrawals = useCachedQuery(["withdrawals"], getWithdrawals, { enabled: showExpenses });
  const { totalRaw: partyDues, partyCount } = usePartyOutstanding(showParties);

  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const totalExpense    = (expenses.data ?? []).reduce((a, e) => a + Number(e.amount), 0);
  const somitiBalance   = (somiti.data ?? []).reduce((a, e) => a + (e.kind === "deposit" ? 1 : -1) * Number(e.amount), 0);
  const totalWithdrawal = (withdrawals.data ?? []).reduce((a, w) => a + Number(w.amount), 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">{t("more")}</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {user?.role === "owner" ? "Owner sections" : t("more")}
        </p>
      </div>

      {showReports && <ReportsPanel />}

      {isMobile && <ThemeCard />}

      {isMobile && (showSettings || showReports) && (
        <div className="space-y-2">
          <SectionTitle icon={Settings} title={t("settings")} color="bg-primary" />
          <div className="space-y-2">
            {showSettings && <NavCard to="/settings" icon={Settings} label={t("settings")} />}
            {showReports && <NavCard to="/trackback" icon={BarChart3} label={t("trackback")} />}
          </div>
        </div>
      )}

      {/* ── Quick links ── */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/online-sells">
          <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer active:scale-[0.98]">
            <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 grid place-items-center mb-2">
              <DollarSign className="size-4" />
            </div>
            <div className="text-sm font-medium">{t("online_sell")}</div>
          </Card>
        </Link>
        {showExpenses && (
          <Link to="/cash-management/cashbox">
            <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer active:scale-[0.98]">
              <div className="size-8 rounded-lg bg-indigo-500/10 text-indigo-600 grid place-items-center mb-2">
                <Banknote className="size-4" />
              </div>
              <div className="text-sm font-medium">{t("cashbox")}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{t("add_money")} / {t("take_money")}</div>
            </Card>
          </Link>
        )}
        {showPurchases && (
          <Link to="/purchases">
            <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer active:scale-[0.98]">
              <div className="size-8 rounded-lg bg-sky-500/10 text-sky-600 grid place-items-center mb-2">
                <ShoppingCart className="size-4" />
              </div>
              <div className="text-sm font-medium">{t("new_purchase")}</div>
            </Card>
          </Link>
        )}
        {isMobile && showReports && (
          <Link to="/trackback">
            <Card className="glass-card p-4 hover:bg-accent/50 transition-colors cursor-pointer active:scale-[0.98]">
              <div className="size-8 rounded-lg bg-primary/15 text-primary grid place-items-center mb-2">
                <BarChart3 className="size-4" />
              </div>
              <div className="text-sm font-medium">{t("trackback")}</div>
            </Card>
          </Link>
        )}
        {isMobile && showSettings && (
          <Link to="/settings">
            <Card className="glass-card p-4 hover:bg-accent/50 transition-colors cursor-pointer active:scale-[0.98]">
              <div className="size-8 rounded-lg bg-primary/15 text-primary grid place-items-center mb-2">
                <Settings className="size-4" />
              </div>
              <div className="text-sm font-medium">{t("settings")}</div>
            </Card>
          </Link>
        )}
        {showParties && (
          <Link to="/parties">
            <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer active:scale-[0.98]">
              <div className="size-8 rounded-lg bg-amber-500/10 text-amber-600 grid place-items-center mb-2">
                <Users className="size-4" />
              </div>
              <div className="text-sm font-medium">{t("party_collection")}</div>
              {partyDues > 0 && (
                <div className="text-xs font-bold text-amber-600 mt-1">{fmtMoney(partyDues)} বাকী</div>
              )}
            </Card>
          </Link>
        )}
      </div>

      {showParties && (
      <div className="space-y-2">
        <SectionTitle icon={Users} title={`${t("party_collection")} — ${partyCount} পার্টি`} color="bg-amber-500" />
        <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">{t("total_owed")}</div>
              <div className="text-2xl font-bold text-amber-600 mt-0.5">{fmtMoney(partyDues)}</div>
            </div>
            <Link to="/parties">
              <Button size="sm" variant="outline" className="border-amber-500/30">
                <Users className="size-3.5 mr-1" />
                সব পার্টি
              </Button>
            </Link>
          </div>
        </Card>
      </div>
      )}

      {showExpenses && (
      <div className="space-y-2">
        <SectionTitle icon={Receipt} title="দোকান খরচ" color="bg-rose-500" />
        <Card className="p-4 bg-gradient-to-br from-rose-500/10 to-rose-500/5 border-rose-500/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">{t("total")} খরচ</div>
              <div className="text-2xl font-bold text-rose-600 mt-0.5">{fmtMoney(totalExpense)}</div>
            </div>
            <Link to="/expenses">
              <Button size="sm" variant="outline" className="border-rose-500/30">
                <Receipt className="size-3.5 mr-1" />
                দেখুন
              </Button>
            </Link>
          </div>
        </Card>
        {/* Last 3 expenses */}
        {(expenses.data ?? []).slice(0, 3).map(e => (
          <div key={e.id} className="flex items-center justify-between px-1 py-1.5 text-sm">
            <div>
              <span className="font-medium">{e.title}</span>
              <span className="text-xs text-muted-foreground ml-2">{fmtDateTime(e.created_at)}</span>
            </div>
            <span className="font-semibold text-rose-600">−{fmtMoney(e.amount)}</span>
          </div>
        ))}
      </div>
      )}

      {showExpenses && (
      <>
      {/* ── সমিতি ── */}
      <div className="space-y-2">
        <SectionTitle icon={PiggyBank} title={t("somiti")} color="bg-violet-500" />
        <Card className="p-4 bg-gradient-to-br from-violet-500/10 to-violet-500/5 border-violet-500/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">{t("balance")}</div>
              <div className={`text-2xl font-bold mt-0.5 ${somitiBalance >= 0 ? "text-violet-600" : "text-destructive"}`}>
                {fmtMoney(somitiBalance)}
              </div>
            </div>
            <Link to="/somiti">
              <Button size="sm" variant="outline" className="border-violet-500/30">
                <PiggyBank className="size-3.5 mr-1" />
                দেখুন
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* ── মালিক টাকা নেওয়া ── */}
      <div className="space-y-2">
        <SectionTitle icon={HandCoins} title={t("owner_withdraw")} color="bg-indigo-500" />
        <Card className="p-4 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-500/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">{t("total")} উত্তোলন</div>
              <div className="text-2xl font-bold text-indigo-600 mt-0.5">{fmtMoney(totalWithdrawal)}</div>
            </div>
            <Button size="sm" onClick={() => setWithdrawOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <HandCoins className="size-3.5 mr-1" />
              {t("add")}
            </Button>
          </div>
        </Card>
        {/* Recent withdrawals */}
        {(withdrawals.data ?? []).slice(0, 4).map(w => (
          <div key={w.id} className="flex items-center justify-between px-1 py-1.5 text-sm border-b border-border last:border-0">
            <div>
              <span className="font-medium">{w.note || t("owner_withdraw")}</span>
              <span className="text-xs text-muted-foreground ml-2">{fmtDateTime(w.created_at)}</span>
            </div>
            <span className="font-semibold text-indigo-600">{fmtMoney(w.amount)}</span>
          </div>
        ))}
      </div>

      <WithdrawDialog open={withdrawOpen} onOpenChange={setWithdrawOpen} />
      </>
      )}
    </div>
  );
}

// ── withdraw dialog ───────────────────────────────────────────────────────
function WithdrawDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { t } = useT();
  const qc = useQueryClient();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await createWithdrawalFn({ data: { amount: Number(amount) || 0, note: note || null } });
      setAmount(""); setNote("");
      qc.invalidateQueries({ queryKey: ["withdrawals"] });
      onOpenChange(false);
      toast.success("টাকা উত্তোলন সম্পন্ন");
    } catch (err: any) { toast.error(err.message ?? String(err)); }
    finally { setBusy(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{t("owner_withdraw")}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">{t("amount")} (৳)</Label>
            <Input required inputMode="decimal" placeholder="0" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">{t("note")}</Label>
            <Input placeholder="কারণ লিখুন (optional)" value={note} onChange={e => setNote(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
            <Button type="submit" disabled={busy}>{busy ? "…" : t("save")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}