// アプリ中毒ガード（/usage）の型定義

/** 開いた理由の良し悪し。good = 緑（前向き）, bad = 赤（つい開いてしまう） */
export type ReasonKind = "good" | "bad";

export interface Reason {
  id: string;
  label: string;
  kind: ReasonKind;
}

/** ガード対象として登録したアプリ */
export interface GuardedApp {
  id: string;
  name: string;
  emoji: string;
  /** 任意。指定すると「開く」確定時に新しいタブで開く */
  url?: string;
  createdAt: string;
}

/**
 * 1 回の「開く」記録。
 * - closedAt が未設定なら使用中（アクティブセッション）。
 * - recorded=false は「記録せずに開く」を選んだ場合で、統計から除外される。
 */
export interface OpenLog {
  id: string;
  appId: string;
  reasonId: string | null;
  recorded: boolean;
  openedAt: string;
  closedAt?: string;
  /** 確定した使用秒数（閉じたときに記録） */
  durationSec: number;
}
