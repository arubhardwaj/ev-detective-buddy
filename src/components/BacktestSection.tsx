/**
 * BacktestSection.tsx — Simulated bankroll equity curve from 22 historical bets.
 * Swap backtestHistory with real DB records for production.
 */
import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { backtestHistory } from "@/data/mockData";
import { TrendingUp, TrendingDown, Percent } from "lucide-react";

const STARTING_BANKROLL = 1000;

interface BacktestSectionProps {
  bankroll: number;
}

export const BacktestSection = ({ bankroll }: BacktestSectionProps) => {
  // Simulate bankroll growth bet by bet
  const { chartData, stats } = useMemo(() => {
    let br = STARTING_BANKROLL;
    let wins = 0;
    let totalStaked = 0;

    const chartData = backtestHistory.map((bet, i) => {
      const stakeAmount = br * bet.stakePercent;
      totalStaked += stakeAmount;
      if (bet.won) {
        br += stakeAmount * (bet.odds - 1);
        wins++;
      } else {
        br -= stakeAmount;
      }
      return {
        bet: i + 1,
        date: bet.date.slice(5), // "MM-DD"
        event: bet.event,
        bankroll: Math.round(br),
        won: bet.won,
      };
    });

    // Insert starting point
    const withStart = [{ bet: 0, date: "Start", event: "—", bankroll: STARTING_BANKROLL, won: false }, ...chartData];

    const roi = ((br - STARTING_BANKROLL) / STARTING_BANKROLL) * 100;
    const winRate = (wins / backtestHistory.length) * 100;
    const profit = br - STARTING_BANKROLL;

    return { chartData: withStart, stats: { roi, winRate, profit, finalBankroll: br, wins } };
  }, []);

  const isProfit = stats.profit >= 0;

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          {
            label: "Total ROI",
            value: `${isProfit ? "+" : ""}${stats.roi.toFixed(1)}%`,
            positive: isProfit,
            icon: <Percent size={16} />,
          },
          {
            label: "Net Profit",
            value: `€${stats.profit >= 0 ? "+" : ""}${stats.profit.toFixed(0)}`,
            positive: isProfit,
            icon: <TrendingUp size={16} />,
          },
          {
            label: "Win Rate",
            value: `${stats.winRate.toFixed(1)}%`,
            positive: stats.winRate >= 50,
            icon: <TrendingUp size={16} />,
          },
          {
            label: "Final Bankroll",
            value: `€${stats.finalBankroll.toFixed(0)}`,
            positive: isProfit,
            icon: <TrendingDown size={16} />,
          },
        ].map(({ label, value, positive, icon }) => (
          <div
            key={label}
            className={`flex items-center gap-3 rounded-xl border p-4 ${
              positive ? "border-ev-positive/30 bg-ev-positive/5" : "border-ev-negative/30 bg-ev-negative/5"
            }`}
          >
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                positive ? "bg-ev-positive/20 text-ev-positive" : "bg-ev-negative/20 text-ev-negative"
              }`}
            >
              {icon}
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className={`text-xl font-bold ${positive ? "text-ev-positive" : "text-ev-negative"}`}>
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Equity Curve */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-1 text-sm font-semibold text-foreground">Bankroll Equity Curve</h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Starting €{STARTING_BANKROLL.toLocaleString()} · {backtestHistory.length} bets · Half-Kelly staking
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `€${v}`}
              width={58}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
                color: "hsl(var(--foreground))",
              }}
              formatter={(val: number) => [`€${val.toLocaleString()}`, "Bankroll"]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <ReferenceLine
              y={STARTING_BANKROLL}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="4 4"
              label={{ value: "Start", fill: "hsl(var(--muted-foreground))", fontSize: 10, position: "insideLeft" }}
            />
            <Line
              type="monotone"
              dataKey="bankroll"
              stroke={isProfit ? "hsl(var(--ev-positive))" : "hsl(var(--ev-negative))"}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bet log */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {["Date", "Event", "Sport", "Odds", "Model", "Staked", "Outcome", "P&L"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {backtestHistory.map((bet, i) => {
              // Recalculate running bankroll for P&L display
              let br = STARTING_BANKROLL;
              for (let j = 0; j < i; j++) {
                const s = br * backtestHistory[j].stakePercent;
                br = backtestHistory[j].won ? br + s * (backtestHistory[j].odds - 1) : br - s;
              }
              const staked = br * bet.stakePercent;
              const pnl = bet.won ? staked * (bet.odds - 1) : -staked;
              return (
                <tr
                  key={i}
                  className={`border-b border-border/50 transition-colors hover:bg-muted/20 ${
                    i % 2 === 0 ? "" : "bg-muted/10"
                  }`}
                >
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{bet.date}</td>
                  <td className="px-4 py-2.5 font-medium text-foreground">{bet.event}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{bet.sport}</td>
                  <td className="px-4 py-2.5 font-mono text-foreground">{bet.odds.toFixed(2)}</td>
                  <td className="px-4 py-2.5 font-mono text-foreground">
                    {(bet.modelProb * 100).toFixed(0)}%
                  </td>
                  <td className="px-4 py-2.5 font-mono text-foreground">€{staked.toFixed(0)}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        bet.won
                          ? "bg-ev-positive/15 text-ev-positive"
                          : "bg-ev-negative/15 text-ev-negative"
                      }`}
                    >
                      {bet.won ? "WIN" : "LOSS"}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-2.5 font-mono font-semibold ${
                      pnl >= 0 ? "text-ev-positive" : "text-ev-negative"
                    }`}
                  >
                    {pnl >= 0 ? "+" : ""}€{pnl.toFixed(0)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
