import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Wallet, AlertCircle, Receipt, ShoppingBag, Package, PlusCircle } from "lucide-react";
import { useT } from "@/lib/i18n";
import { getExpenses, getSales, getWithdrawals } from "@/lib/queries";
import { fmtMoney, fmtDateTime } from "@/lib/format";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { t } = useT();
  return <DashboardInner />;
}

// Provide /dashboard alias to keep nav consistent
function DashboardInner() {
  return <DashboardBody />;
}

function DashboardBody() {
  const { t } = useT();
  const sales = useQuery({ queryKey: ["sales"], queryFn: getSales });
  const expenses = useQuery({ queryKey: ["expenses"], queryFn: getExpenses });
  const withdrawals = useQuery({ queryKey: ["withdrawals"], queryFn: getWithdrawals });

  const todayStart = new Date(); todayStart.setHours(0,0,0,0);
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 7);

  const allSales = sales.data ?? [];
  const todaySales = allSales.filter(s => new Date(s.created_at) >= todayStart);
  const weekSales = allSales.filter(s => new Date(s.created_at) >= weekStart);
  const cashToday = todaySales.filter(s => s.type === "cash").reduce((a,s)=>a + Number(s.sell_price)*s.qty, 0);
  const creditToday = todaySales.filter(s => s.type === "credit").reduce((a,s)=>a + Number(s.due_amount), 0);
  const profitWeek = weekSales.reduce((a,s)=>a + Number(s.profit), 0);
  const totalDues = allSales.reduce((a,s)=>a + Number(s.due_amount), 0);
  const expensesToday = (expenses.data ?? []).filter(e => new Date(e.created_at) >= todayStart).reduce((a,e)=>a+Number(e.amount),0);
  const cashInHand = allSales.reduce((a,s)=>a + Number(s.paid_amount), 0)
    - (expenses.data ?? []).reduce((a,e)=>a+Number(e.amount),0)
    - (withdrawals.data ?? []).reduce((a,w)=>a+Number(w.amount),0);

  const recent = allSales.slice(0, 6);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">{t("dashboard")}</h1>
        <p className="text-sm text-muted-foreground">{t("today")} · {new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard tone="brand" icon={Wallet} label={t("cash_sale")+ " · " + t("today")} value={fmtMoney(cashToday)} />
        <StatCard tone="warn"  icon={AlertCircle} label={t("credit_sale")+" · "+t("today")} value={fmtMoney(creditToday)} />
        <StatCard tone="success" icon={TrendingUp} label={t("profit")+" · "+t("this_week")} value={fmtMoney(profitWeek)} />
        <StatCard tone="muted" icon={Receipt} label={t("expense")+" · "+t("today")} value={fmtMoney(expensesToday)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard tone="brand" icon={Wallet} label={t("cash_in_hand")} value={fmtMoney(cashInHand)} big />
        <StatCard tone="warn" icon={AlertCircle} label={t("due")} value={fmtMoney(totalDues)} big />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <QuickLink to="/products" icon={Package} label={t("products")} />
        <QuickLink to="/sales" icon={ShoppingBag} label={t("sales")} />
        <QuickLink to="/purchases" icon={PlusCircle} label={t("new_purchase")} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t("recent_activity")}</h2>
        </div>
        <Card className="divide-y divide-border overflow-hidden">
          {recent.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">{t("no_activity")}</div>}
          {recent.map(s => (
            <div key={s.id} className="p-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium truncate">{s.product_name}</div>
                <div className="text-xs text-muted-foreground">{s.type === "cash" ? t("cash") : t("credit")} · {fmtDateTime(s.created_at)}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{fmtMoney(Number(s.sell_price)*s.qty)}</div>
                <div className="text-xs text-success">+{fmtMoney(s.profit)}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone, big }: { icon: any; label: string; value: string; tone: "brand"|"warn"|"success"|"muted"; big?: boolean }) {
  const toneCls = {
    brand: "from-primary/10 to-primary/5 text-primary",
    warn: "from-warning/15 to-warning/5 text-foreground",
    success: "from-success/15 to-success/5 text-success",
    muted: "from-muted to-secondary text-foreground",
  }[tone];
  return (
    <Card className={`p-3.5 bg-gradient-to-br ${toneCls} border-border/60`}>
      <div className="flex items-center gap-2 text-xs font-medium opacity-80"><Icon className="size-4" />{label}</div>
      <div className={`mt-1 font-bold ${big ? "text-2xl" : "text-lg"}`}>{value}</div>
    </Card>
  );
}

function QuickLink({ to, icon: Icon, label }: { to: any; icon: any; label: string }) {
  return (
    <Link to={to} className="rounded-2xl bg-card border border-border p-3 flex flex-col items-center gap-1 text-xs font-medium hover:border-primary transition">
      <Icon className="size-5 text-primary" />{label}
    </Link>
  );
}