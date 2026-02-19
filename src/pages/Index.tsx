/**
 * Index.tsx — EdgeFinder dashboard: +EV sports betting detection prototype.
 * Demonstrates automated value identification using mock data.
 * Ready to connect to real bookmaker APIs (e.g. The Odds API) later.
 */
import { useState, useMemo, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EVTable } from "@/components/EVTable";
import { StatsBar } from "@/components/StatsBar";
import { BacktestSection } from "@/components/BacktestSection";
import { mockOpportunities } from "@/data/mockData";
import { calcEV, impliedProbability, kellyStake } from "@/utils/betting";
import { RefreshCw, Zap } from "lucide-react";
import type { ProcessedBet } from "@/components/EVTable";

const BANKROLL = 1000; // Default demo bankroll in EUR

const processBets = (opportunities: typeof mockOpportunities): ProcessedBet[] =>
  opportunities.map((o) => ({
    id: o.id,
    sport: o.sport,
    league: o.league,
    event: o.event,
    market: o.market,
    bookmaker: o.bookmaker,
    odds: o.odds,
    modelProb: o.modelProb,
    impliedProb: impliedProbability(o.odds),
    ev: calcEV(o.modelProb, o.odds),
    kelly: kellyStake(o.modelProb, o.odds),
    kickoff: o.kickoff,
  }));

const Index = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const allBets = useMemo(
    () => processBets(mockOpportunities),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refreshKey]
  );

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshKey((k) => k + 1);
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 900);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Header ── */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap size={16} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-none text-foreground">EdgeFinder</h1>
              <p className="text-[11px] text-muted-foreground leading-none mt-0.5">+EV Sports Betting Scanner</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:block">
              Last scan: {lastUpdated.toLocaleTimeString()}
            </span>
            <div className="flex h-2 w-2 rounded-full bg-ev-positive animate-pulse" />
            <span className="text-xs font-medium text-ev-positive">Live</span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
            >
              <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
              {isRefreshing ? "Scanning…" : "Refresh"}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* Disclaimer */}
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-4 py-2.5 text-xs text-yellow-600 dark:text-yellow-400">
          <strong>Demo prototype</strong> — all odds and probabilities are mock data for demonstration purposes only. Not financial advice.
        </div>

        {/* KPI strip */}
        <StatsBar bets={allBets} bankroll={BANKROLL} />

        {/* Tabs */}
        <Tabs defaultValue="scanner">
          <TabsList className="border border-border bg-card">
            <TabsTrigger value="scanner">📡 Live Scanner</TabsTrigger>
            <TabsTrigger value="backtest">📊 Backtest</TabsTrigger>
          </TabsList>

          {/* Scanner tab */}
          <TabsContent value="scanner" className="mt-4">
            <div className="mb-3">
              <h2 className="text-lg font-bold text-foreground">Market Scanner</h2>
              <p className="text-sm text-muted-foreground">
                Comparing bookmaker odds against our model's win probabilities to surface value bets.
                Green rows = positive expected value. Kelly Criterion applied at 50% for risk management.
              </p>
            </div>
            <EVTable bankroll={BANKROLL} />
          </TabsContent>

          {/* Backtest tab */}
          <TabsContent value="backtest" className="mt-4">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-foreground">Backtest Results</h2>
              <p className="text-sm text-muted-foreground">
                Simulated performance across 22 historical +EV bets using Half-Kelly staking from a €
                {BANKROLL.toLocaleString()} starting bankroll.
              </p>
            </div>
            <BacktestSection bankroll={BANKROLL} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
