import { useEffect, useState } from "react";

/**
 * 一定間隔で更新される現在時刻（ミリ秒）。
 * 使用中セッションの経過時間をライブ表示するのに使う。
 * SSR とのハイドレーション差異を避けるため初期値は 0。
 */
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(0);
  useEffect(() => {
    // 初回は次のティックで反映（effect 内での同期 setState を避ける）
    const first = setTimeout(() => setNow(Date.now()), 0);
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [intervalMs]);
  return now;
}
