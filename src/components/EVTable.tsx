/**
 * EVTable.tsx — Main +EV detection table with filters and visual cues.
 */
import { useState, useMemo } from "react";
import { mockOpportunities } from "@/data/mockData";
import { calcEV, impliedProbability, kellyStake, fmtPct, fmtOdds } from "@/utils/betting";
import { TrendingUp, TrendingDown, ChevronUp, ChevronDown } from "lucide-react";

export interface ProcessedBet {
  id: string;
  sport: string;
  league: string;
  event: string;
  market: string;
  bookmaker: string;
  odds: number;
  modelProb: number;
  impliedProb: number;
  ev: number;
  kelly: number;
  kickoff: string;
}

const BOOKMAKERS = ["All", "Bet365", "Unibet", "Betsson"];
const SPORTS = ["All", "Football", "Tennis"];

type SortKey = keyof ProcessedBet;
type SortDir = "asc" | "desc";

interface EVTableProps {
  bankroll: number;
}

export const EVTable = ({ bankroll }: EVTableProps) => {
  const [sportFilter, setSportFilter] = useState("All");
  const [bmFilter, setBmFilter] = useState("All");
  const [onlyPositive, setOnlyPositive] = useState(false);
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "ev", dir: "desc" });

  // Process raw mock data through our betting math
  const allBets: ProcessedBet[] = useMemo(
    () =>
      mockOpportunities.map((o) => {
        const implied = impliedProbability(o.odds);
        const ev = calcEV(o.modelProb, o.odds);
        const kelly = kellyStake(o.modelProb, o.odds);
        return {
          id: o.id,
          sport: o.sport,
          league: o.league,
          event: o.event,
          market: o.market,
          bookmaker: o.bookmaker,
          odds: o.odds,
          modelProb: o.modelProb,
          impliedProb: implied,
          ev,
          kelly,
          kickoff: o.kickoff,
        };
      }),
    []
  );

  const filtered = useMemo(() => {
    let rows = allBets;
    if (sportFilter !== "All") rows = rows.filter((b) => b.sport === sportFilter);
    if (bmFilter !== "All") rows = rows.filter((b) => b.bookmaker === bmFilter);
    if (onlyPositive) rows = rows.filter((b) => b.ev > 0);
    return [...rows].sort((a, b) => {
      const va = a[sort.key] as number | string;
      const vb = b[sort.key] as number | string;
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [allBets, sportFilter, bmFilter, onlyPositive, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === "desc" ? "asc" : "desc" }));

  const SortIcon = ({ col }: { col: SortKey }) =>
    sort.key === col ? (
      sort.dir === "desc" ? <ChevronDown size={14} className="inline ml-1" /> : <ChevronUp size={14} className="inline ml-1" />
    ) : (
      <ChevronDown size={14} className="inline ml-1 opacity-20" />
    );

  return (
    <div className="space-y-4">
      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sport filter */}
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          {SPORTS.map((s) => (
            <button
              key={s}
              onClick={() => setSportFilter(s)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                sportFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {/* Bookmaker filter */}
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          {BOOKMAKERS.map((bm) => (
            <button
              key={bm}
              onClick={() => setBmFilter(bm)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                bmFilter === bm
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {bm}
            </button>
          ))}
        </div>
        {/* +EV only toggle */}
        <button
          onClick={() => setOnlyPositive((v) => !v)}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            onlyPositive
              ? "border-ev-positive/50 bg-ev-positive/10 text-ev-positive"
              : "border-border bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          <TrendingUp size={15} />
          +EV Only
        </button>
        <span className="ml-auto text-sm text-muted-foreground">
          {filtered.length} market{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {[
                { label: "Sport / Event", key: "event" as SortKey },
                { label: "Market", key: "market" as SortKey },
                { label: "Bookmaker", key: "bookmaker" as SortKey },
                { label: "Odds", key: "odds" as SortKey },
                { label: "Model Prob", key: "modelProb" as SortKey },
                { label: "Implied Prob", key: "impliedProb" as SortKey },
                { label: "EV %", key: "ev" as SortKey },
                { label: "Kelly Stake", key: "kelly" as SortKey },
                { label: "Verdict", key: "ev" as SortKey },
              ].map(({ label, key }) => (
                <th
                  key={label}
                  onClick={() => toggleSort(key)}
                  className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
                >
                  {label}
                  <SortIcon col={key} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((bet, i) => {
              const isPositive = bet.ev > 0;
              const rowBg = isPositive
                ? "hover:bg-ev-positive/5"
                : "hover:bg-muted/30";
              return (
                <tr
                  key={bet.id}
                  className={`border-b border-border/50 transition-colors ${rowBg} ${
                    i % 2 === 0 ? "bg-transparent" : "bg-muted/10"
                  }`}
                >
                  {/* Sport / Event */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">{bet.event}</span>
                      <span className="text-xs text-muted-foreground">
                        {bet.sport} · {bet.league}
                      </span>
                    </div>
                  </td>
                  {/* Market */}
                  <td className="px-4 py-3 text-muted-foreground">{bet.market}</td>
                  {/* Bookmaker */}
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                      {bet.bookmaker}
                    </span>
                  </td>
                  {/* Odds */}
                  <td className="px-4 py-3 font-mono font-semibold text-foreground">
                    {fmtOdds(bet.odds)}
                  </td>
                  {/* Model Prob */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${bet.modelProb * 100}%` }}
                        />
                      </div>
                      <span className="font-mono text-foreground">{fmtPct(bet.modelProb)}</span>
                    </div>
                  </td>
                  {/* Implied Prob */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-muted-foreground"
                          style={{ width: `${bet.impliedProb * 100}%` }}
                        />
                      </div>
                      <span className="font-mono text-muted-foreground">{fmtPct(bet.impliedProb)}</span>
                    </div>
                  </td>
                  {/* EV% */}
                  <td className="px-4 py-3">
                    <span
                      className={`font-mono font-bold ${
                        isPositive ? "text-ev-positive" : "text-ev-negative"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {(bet.ev * 100).toFixed(2)}%
                    </span>
                  </td>
                  {/* Kelly Stake */}
                  <td className="px-4 py-3">
                    {isPositive ? (
                      <div className="flex flex-col">
                        <span className="font-mono font-semibold text-ev-positive">
                          €{(bet.kelly * bankroll).toFixed(0)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {fmtPct(bet.kelly, 2)} bankroll
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  {/* Verdict */}
                  <td className="px-4 py-3">
                    {isPositive ? (
                      <div className="flex items-center gap-1.5 rounded-full border border-ev-positive/40 bg-ev-positive/10 px-2.5 py-1 text-xs font-bold text-ev-positive w-fit">
                        <TrendingUp size={12} />
                        BET
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 rounded-full border border-ev-negative/30 bg-ev-negative/10 px-2.5 py-1 text-xs font-bold text-ev-negative w-fit">
                        <TrendingDown size={12} />
                        SKIP
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No markets match the current filters.
          </div>
        )}
      </div>
    </div>
  );
};

// Export allBets for StatsBar to consume from parent
export { mockOpportunities };
