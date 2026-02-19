/**
 * StatsBar.tsx — Top KPI strip showing high-level metrics at a glance.
 */
import { TrendingUp, Target, DollarSign, Activity } from "lucide-react";
import type { ProcessedBet } from "./EVTable";

interface StatsBarProps {
  bets: ProcessedBet[];
  bankroll: number;
}

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

const StatCard = ({ label, value, sub, icon, highlight }: StatCardProps) => (
  <div className={`flex items-center gap-4 rounded-xl border p-4 ${highlight ? "border-ev-positive/40 bg-ev-positive/5" : "border-border bg-card"}`}>
    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${highlight ? "bg-ev-positive/20 text-ev-positive" : "bg-muted text-muted-foreground"}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? "text-ev-positive" : "text-foreground"}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  </div>
);

export const StatsBar = ({ bets, bankroll }: StatsBarProps) => {
  const positiveBets = bets.filter((b) => b.ev > 0);
  const avgEdge = positiveBets.length
    ? positiveBets.reduce((sum, b) => sum + b.ev, 0) / positiveBets.length
    : 0;
  const maxStakeEur = bets.reduce((max, b) => Math.max(max, b.kelly * bankroll), 0);

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <StatCard
        label="Events Scanned"
        value={String(bets.length)}
        sub="Live mock feed"
        icon={<Activity size={20} />}
      />
      <StatCard
        label="+EV Opportunities"
        value={String(positiveBets.length)}
        sub={`of ${bets.length} markets`}
        icon={<Target size={20} />}
        highlight={positiveBets.length > 0}
      />
      <StatCard
        label="Avg Edge"
        value={`${(avgEdge * 100).toFixed(1)}%`}
        sub="Across +EV bets"
        icon={<TrendingUp size={20} />}
        highlight={avgEdge > 0}
      />
      <StatCard
        label="Max Kelly Stake"
        value={`€${maxStakeEur.toFixed(0)}`}
        sub={`Bankroll: €${bankroll.toLocaleString()}`}
        icon={<DollarSign size={20} />}
      />
    </div>
  );
};
