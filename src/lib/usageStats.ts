import { OpenLog, Reason } from "@/types/usage";
import { dayKey, elapsedSec, isToday } from "@/lib/usageFormat";

export interface ReasonBreakdown {
  reason: Reason;
  sec: number;
  count: number;
}

export interface TodayStats {
  /** 今日の「開いた」回数（記録されたもの） */
  count: number;
  /** 今日の合計使用秒数（記録されたもの。使用中はライブ） */
  totalSec: number;
  /** 理由ごとの内訳（使用秒数の多い順） */
  breakdown: ReasonBreakdown[];
}

/**
 * 指定アプリ（appId 未指定なら全アプリ）の「今日」の統計を集計する。
 * now はライブ計算（使用中セッション）の基準ミリ秒。
 */
export function getTodayStats(
  logs: OpenLog[],
  reasons: Reason[],
  now: number,
  appId?: string
): TodayStats {
  const todays = logs.filter(
    (l) =>
      l.recorded &&
      isToday(l.openedAt) &&
      (appId ? l.appId === appId : true)
  );

  const secByReason = new Map<string, number>();
  const countByReason = new Map<string, number>();
  let totalSec = 0;

  for (const log of todays) {
    const sec = elapsedSec(log, now);
    totalSec += sec;
    const key = log.reasonId ?? "__none__";
    secByReason.set(key, (secByReason.get(key) ?? 0) + sec);
    countByReason.set(key, (countByReason.get(key) ?? 0) + 1);
  }

  const breakdown: ReasonBreakdown[] = reasons
    .map((reason) => ({
      reason,
      sec: secByReason.get(reason.id) ?? 0,
      count: countByReason.get(reason.id) ?? 0,
    }))
    .filter((b) => b.count > 0)
    .sort((a, b) => b.sec - a.sec);

  return { count: todays.length, totalSec, breakdown };
}

/** 直近 days 日分の日別合計使用秒数（古い順）。グラフ用 */
export function getDailyTotals(
  logs: OpenLog[],
  now: number,
  days: number,
  appId?: string
): { key: string; label: string; sec: number }[] {
  const buckets: { key: string; label: string; sec: number }[] = [];
  const base = new Date(now);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    const pad = (n: number) => String(n).padStart(2, "0");
    const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const label = `${d.getMonth() + 1}/${d.getDate()}`;
    buckets.push({ key, label, sec: 0 });
  }

  const index = new Map(buckets.map((b, i) => [b.key, i]));
  for (const log of logs) {
    if (!log.recorded) continue;
    if (appId && log.appId !== appId) continue;
    const i = index.get(dayKey(log.openedAt));
    if (i === undefined) continue;
    buckets[i].sec += elapsedSec(log, now);
  }

  return buckets;
}
