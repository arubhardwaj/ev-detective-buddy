/**
 * betting.ts — Core betting math utilities
 * Easy to swap in real API data later by replacing mock inputs.
 */

/** Convert decimal odds to implied probability (includes bookmaker margin) */
export const impliedProbability = (decimalOdds: number): number =>
  1 / decimalOdds;

/**
 * Expected Value percentage.
 * EV% = (modelProb × odds) − 1
 * Positive = +EV (value bet), Negative = no bet.
 */
export const calcEV = (modelProb: number, decimalOdds: number): number =>
  modelProb * decimalOdds - 1;

/**
 * Half-Kelly Criterion — conservative stake sizing.
 * f* = ((b × p − q) / b) × 0.5
 * where b = odds − 1, p = model prob, q = 1 − p
 * Returns fraction of bankroll to stake (0–1), capped at 5%.
 */
export const kellyStake = (modelProb: number, decimalOdds: number): number => {
  const b = decimalOdds - 1;
  const q = 1 - modelProb;
  const kelly = (b * modelProb - q) / b;
  const halfKelly = kelly * 0.5;
  return Math.max(0, Math.min(0.05, halfKelly)); // cap at 5% bankroll
};

/** Format a number as a percentage string */
export const fmtPct = (n: number, decimals = 1): string =>
  `${(n * 100).toFixed(decimals)}%`;

/** Format a decimal odds value */
export const fmtOdds = (n: number): string => n.toFixed(2);
