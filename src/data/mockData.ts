/**
 * mockData.ts — Simulated odds from 3 EU bookmakers + model probabilities.
 * Replace this module with real API calls (e.g. The Odds API) to go live.
 */

export type Sport = "Football" | "Tennis";
export type Bookmaker = "Bet365" | "Unibet" | "Betsson";

export interface BetOpportunity {
  id: string;
  sport: Sport;
  league: string;
  event: string;
  market: string;       // e.g. "Home Win", "Player Win"
  bookmaker: Bookmaker;
  odds: number;         // decimal odds offered by the bookmaker
  modelProb: number;    // our model's estimated win probability
  kickoff: string;      // ISO datetime string
}

/** Mock football and tennis events across three bookmakers */
export const mockOpportunities: BetOpportunity[] = [
  // ── FOOTBALL ─────────────────────────────────────────────────────────────
  {
    id: "f1",
    sport: "Football",
    league: "Premier League",
    event: "Arsenal vs Chelsea",
    market: "Home Win",
    bookmaker: "Bet365",
    odds: 2.10,
    modelProb: 0.54,
    kickoff: "2026-02-22T15:00:00Z",
  },
  {
    id: "f2",
    sport: "Football",
    league: "Premier League",
    event: "Arsenal vs Chelsea",
    market: "Home Win",
    bookmaker: "Unibet",
    odds: 2.05,
    modelProb: 0.54,
    kickoff: "2026-02-22T15:00:00Z",
  },
  {
    id: "f3",
    sport: "Football",
    league: "La Liga",
    event: "Barcelona vs Atletico",
    market: "Home Win",
    bookmaker: "Betsson",
    odds: 1.95,
    modelProb: 0.47,
    kickoff: "2026-02-22T20:00:00Z",
  },
  {
    id: "f4",
    sport: "Football",
    league: "La Liga",
    event: "Barcelona vs Atletico",
    market: "Draw",
    bookmaker: "Bet365",
    odds: 3.60,
    modelProb: 0.31,
    kickoff: "2026-02-22T20:00:00Z",
  },
  {
    id: "f5",
    sport: "Football",
    league: "Bundesliga",
    event: "Bayern vs Dortmund",
    market: "Home Win",
    bookmaker: "Unibet",
    odds: 1.75,
    modelProb: 0.61,
    kickoff: "2026-02-23T17:30:00Z",
  },
  {
    id: "f6",
    sport: "Football",
    league: "Bundesliga",
    event: "Bayern vs Dortmund",
    market: "Away Win",
    bookmaker: "Betsson",
    odds: 5.20,
    modelProb: 0.22,
    kickoff: "2026-02-23T17:30:00Z",
  },
  {
    id: "f7",
    sport: "Football",
    league: "Serie A",
    event: "Inter vs Juventus",
    market: "Home Win",
    bookmaker: "Bet365",
    odds: 2.30,
    modelProb: 0.49,
    kickoff: "2026-02-24T19:45:00Z",
  },
  {
    id: "f8",
    sport: "Football",
    league: "Ligue 1",
    event: "PSG vs Marseille",
    market: "Home Win",
    bookmaker: "Unibet",
    odds: 1.62,
    modelProb: 0.68,
    kickoff: "2026-02-24T20:00:00Z",
  },
  // ── TENNIS ───────────────────────────────────────────────────────────────
  {
    id: "t1",
    sport: "Tennis",
    league: "ATP Dubai",
    event: "Djokovic vs Alcaraz",
    market: "Player 1 Win",
    bookmaker: "Bet365",
    odds: 2.20,
    modelProb: 0.52,
    kickoff: "2026-02-22T12:00:00Z",
  },
  {
    id: "t2",
    sport: "Tennis",
    league: "ATP Dubai",
    event: "Djokovic vs Alcaraz",
    market: "Player 1 Win",
    bookmaker: "Betsson",
    odds: 2.30,
    modelProb: 0.52,
    kickoff: "2026-02-22T12:00:00Z",
  },
  {
    id: "t3",
    sport: "Tennis",
    league: "WTA Doha",
    event: "Swiatek vs Gauff",
    market: "Player 1 Win",
    bookmaker: "Unibet",
    odds: 1.55,
    modelProb: 0.70,
    kickoff: "2026-02-23T11:00:00Z",
  },
  {
    id: "t4",
    sport: "Tennis",
    league: "WTA Doha",
    event: "Swiatek vs Gauff",
    market: "Player 2 Win",
    bookmaker: "Bet365",
    odds: 2.75,
    modelProb: 0.30,
    kickoff: "2026-02-23T11:00:00Z",
  },
  {
    id: "t5",
    sport: "Tennis",
    league: "ATP Rotterdam",
    event: "Sinner vs Zverev",
    market: "Player 1 Win",
    bookmaker: "Betsson",
    odds: 1.80,
    modelProb: 0.63,
    kickoff: "2026-02-23T14:00:00Z",
  },
  {
    id: "t6",
    sport: "Tennis",
    league: "ATP Rotterdam",
    event: "Sinner vs Zverev",
    market: "Player 2 Win",
    bookmaker: "Unibet",
    odds: 2.15,
    modelProb: 0.37,
    kickoff: "2026-02-23T14:00:00Z",
  },
];

/** Mock backtest: 30 historical bets with outcomes, for ROI simulation */
export interface BacktestBet {
  date: string;
  event: string;
  sport: Sport;
  odds: number;
  modelProb: number;
  stakePercent: number; // of bankroll
  won: boolean;
}

export const backtestHistory: BacktestBet[] = [
  { date: "2026-01-05", event: "Man City vs Liverpool", sport: "Football", odds: 2.15, modelProb: 0.52, stakePercent: 0.025, won: true },
  { date: "2026-01-07", event: "Djokovic vs Medvedev", sport: "Tennis", odds: 1.90, modelProb: 0.60, stakePercent: 0.030, won: true },
  { date: "2026-01-09", event: "Real Madrid vs Sevilla", sport: "Football", odds: 1.70, modelProb: 0.63, stakePercent: 0.028, won: false },
  { date: "2026-01-12", event: "Swiatek vs Sabalenka", sport: "Tennis", odds: 1.65, modelProb: 0.67, stakePercent: 0.032, won: true },
  { date: "2026-01-14", event: "Napoli vs AC Milan", sport: "Football", odds: 2.40, modelProb: 0.48, stakePercent: 0.018, won: true },
  { date: "2026-01-16", event: "Sinner vs Fritz", sport: "Tennis", odds: 1.85, modelProb: 0.61, stakePercent: 0.027, won: false },
  { date: "2026-01-19", event: "PSG vs Lyon", sport: "Football", odds: 1.55, modelProb: 0.71, stakePercent: 0.033, won: true },
  { date: "2026-01-21", event: "Alcaraz vs Rublev", sport: "Tennis", odds: 1.75, modelProb: 0.64, stakePercent: 0.029, won: true },
  { date: "2026-01-23", event: "Dortmund vs Leverkusen", sport: "Football", odds: 2.60, modelProb: 0.45, stakePercent: 0.015, won: false },
  { date: "2026-01-25", event: "Gauff vs Keys", sport: "Tennis", odds: 1.80, modelProb: 0.62, stakePercent: 0.026, won: true },
  { date: "2026-01-27", event: "Tottenham vs Newcastle", sport: "Football", odds: 2.20, modelProb: 0.51, stakePercent: 0.020, won: true },
  { date: "2026-01-29", event: "Djokovic vs Alcaraz", sport: "Tennis", odds: 2.10, modelProb: 0.53, stakePercent: 0.022, won: false },
  { date: "2026-02-01", event: "Inter vs Roma", sport: "Football", odds: 1.95, modelProb: 0.57, stakePercent: 0.024, won: true },
  { date: "2026-02-03", event: "Medvedev vs Zverev", sport: "Tennis", odds: 2.00, modelProb: 0.55, stakePercent: 0.022, won: true },
  { date: "2026-02-05", event: "Athletic Club vs Sociedad", sport: "Football", odds: 2.80, modelProb: 0.42, stakePercent: 0.014, won: false },
  { date: "2026-02-07", event: "Swiatek vs Kvitova", sport: "Tennis", odds: 1.50, modelProb: 0.74, stakePercent: 0.035, won: true },
  { date: "2026-02-09", event: "Marseille vs Monaco", sport: "Football", odds: 2.30, modelProb: 0.50, stakePercent: 0.019, won: true },
  { date: "2026-02-11", event: "Sinner vs Djokovic", sport: "Tennis", odds: 2.05, modelProb: 0.54, stakePercent: 0.022, won: false },
  { date: "2026-02-13", event: "Leipzig vs Frankfurt", sport: "Football", odds: 1.88, modelProb: 0.59, stakePercent: 0.026, won: true },
  { date: "2026-02-15", event: "Alcaraz vs Tsitsipas", sport: "Tennis", odds: 1.72, modelProb: 0.65, stakePercent: 0.030, won: true },
  { date: "2026-02-17", event: "Chelsea vs Arsenal", sport: "Football", odds: 2.50, modelProb: 0.46, stakePercent: 0.017, won: false },
  { date: "2026-02-19", event: "Gauff vs Sabalenka", sport: "Tennis", odds: 2.20, modelProb: 0.52, stakePercent: 0.021, won: true },
];
