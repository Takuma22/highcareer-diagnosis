import { OpenLog } from "@/types/usage";

/** 秒数を「1時間6分」「16分」「16秒」のように整形する */
export function formatDuration(totalSec: number): string {
  const sec = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  if (h > 0) {
    return m > 0 ? `${h}時間${m}分` : `${h}時間`;
  }
  if (m > 0) {
    return `${m}分`;
  }
  return `${s}秒`;
}

/** ストップウォッチ表示用の mm:ss / h:mm:ss */
export function formatClock(totalSec: number): string {
  const sec = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

/** ISO 文字列がローカルタイムで「今日」かどうか */
export function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

/** ローカルタイムの YYYY-MM-DD キー */
export function dayKey(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * ログ 1 件の「これまでの使用秒数」。
 * 使用中（closedAt 未設定）の場合は now を基準にライブ計算する。
 */
export function elapsedSec(log: OpenLog, now: number): number {
  if (log.closedAt) return log.durationSec;
  return Math.max(0, Math.floor((now - new Date(log.openedAt).getTime()) / 1000));
}
