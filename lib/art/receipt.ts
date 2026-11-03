/**
 * The arithmetic behind the home page's usage receipt. Pure, so the server
 * renders every sample job's receipt, in both billing modes, as finished
 * HTML; CSS (:has) only chooses which one shows.
 *
 *  Per second: what ran, with a 60-second minimum per run.
 *  By the hour (for comparison): each run rounded up to the next full hour.
 */

export const MINIMUM_SECONDS = 60;

/** Seconds billed per second: what ran, never less than the minimum. */
export function perSecond(seconds: number): number {
  return Math.max(MINIMUM_SECONDS, Math.ceil(seconds));
}

/** Seconds billed by the hour: every started hour in full. */
export function hourly(seconds: number): number {
  return Math.max(1, Math.ceil(seconds / 3600)) * 3600;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** 2832 → "00:47:12" */
export function clock(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

/** 2832 → "47 min 12 s"; 3600 → "1 h 00 min"; 11560 → "3 h 12 min 40 s" */
export function spoken(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  if (h && !r) return `${h} h ${pad(m)} min`;
  if (h) return `${h} h ${m} min ${r} s`;
  return r ? `${m} min ${r} s` : `${m} min`;
}

/** "10:02:05" + 2832 s → "10:49:17" */
export function addClock(start: string, seconds: number): string {
  const [h = 0, m = 0, s = 0] = start.split(":").map(Number);
  return clock((h * 3600 + m * 60 + s + seconds) % 86400);
}
