"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUsageStore } from "@/store/usageStore";
import { useNow } from "@/lib/useNow";
import { formatClock, formatDuration, elapsedSec } from "@/lib/usageFormat";
import { getTodayStats } from "@/lib/usageStats";

export default function UsageGatePage() {
  const params = useParams<{ id: string }>();
  const appId = params.id;

  const { apps, reasons, logs, activeLogId, hasHydrated, startSession, endSession } =
    useUsageStore();
  const now = useNow(1000);

  const [closedInfo, setClosedInfo] = useState<{ sec: number; recorded: boolean } | null>(
    null
  );

  const app = apps.find((a) => a.id === appId);
  const activeLog = logs.find((l) => l.id === activeLogId && l.appId === appId);
  const stats = getTodayStats(logs, reasons, now, appId);

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-[#090b1a] flex items-center justify-center">
        <p className="text-gray-600 text-sm">読み込み中…</p>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-[#090b1a] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">アプリが見つかりません</p>
        <Link href="/usage" className="text-[#6a9feb] text-sm">
          ← 一覧に戻る
        </Link>
      </div>
    );
  }

  const confirmOpen = (reasonId: string | null, recorded: boolean) => {
    startSession(app.id, reasonId, recorded);
    if (app.url) {
      window.open(app.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleClose = () => {
    if (!activeLog) return;
    const sec = elapsedSec(activeLog, now);
    endSession(activeLog.id);
    setClosedInfo({ sec, recorded: activeLog.recorded });
  };

  // ===== 使用中（アクティブセッション） =====
  if (activeLog) {
    const liveSec = elapsedSec(activeLog, now);
    const reason = reasons.find((r) => r.id === activeLog.reasonId);
    return (
      <div className="min-h-screen bg-[#090b1a] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 w-full max-w-sm text-center"
        >
          <div className="text-6xl mb-4">{app.emoji}</div>
          <p className="text-gray-400 text-sm mb-1">{app.name} を使用中</p>
          <div className="text-5xl font-black text-white tabular-nums my-5">
            {formatClock(liveSec)}
          </div>
          {reason ? (
            <p className="text-xs mb-8" style={{ color: reason.kind === "good" ? "#34d399" : "#f87171" }}>
              理由: {reason.label}
            </p>
          ) : (
            <p className="text-xs text-gray-600 mb-8">記録されていません</p>
          )}
          <button
            onClick={handleClose}
            className="w-full gradient-bg-cool text-white font-black py-3.5 rounded-2xl text-base"
          >
            閉じる
          </button>
          <p className="text-xs text-gray-600 mt-4">
            この時間が記録に積み上がっていきます
          </p>
        </motion.div>
      </div>
    );
  }

  // ===== 閉じた直後のふりかえり =====
  if (closedInfo) {
    return (
      <div className="min-h-screen bg-[#090b1a] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-10 w-full max-w-sm text-center"
        >
          <div className="text-5xl mb-4">⏱</div>
          <p className="text-gray-400 text-sm mb-2">{app.name} を</p>
          <div className="text-3xl font-black text-white mb-1">
            {formatDuration(closedInfo.sec)}
          </div>
          <p className="text-gray-400 text-sm mb-8">使いました</p>
          {closedInfo.recorded && (
            <p className="text-xs text-gray-500 mb-6">
              今日の合計: {stats.count}回 ・ {formatDuration(stats.totalSec)}
            </p>
          )}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => setClosedInfo(null)}
              className="w-full bg-white/8 text-white font-bold py-3 rounded-xl text-sm hover:bg-white/12 transition-colors"
            >
              もう一度この画面を見る
            </button>
            <Link
              href="/usage"
              className="w-full text-gray-500 text-sm py-2 hover:text-white transition-colors"
            >
              一覧に戻る
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ===== ゲート（開く前の確認） =====
  const attemptNumber = stats.count + 1;
  const maxSec = Math.max(1, ...stats.breakdown.map((b) => b.sec));

  return (
    <div className="min-h-screen bg-[#090b1a] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl"
      >
        {/* ヘッダー */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center text-white text-lg flex-shrink-0">
            {app.emoji}
          </div>
          <p className="text-gray-800 font-bold text-[15px]">
            {app.name} を開こうとしています
          </p>
        </div>

        {/* 警告カード */}
        <div className="rounded-2xl p-5 mb-6" style={{ background: "#fdecec" }}>
          {stats.count > 0 ? (
            <>
              <p className="text-[13px] font-bold mb-1" style={{ color: "#e0556a" }}>
                今日 {attemptNumber}回目
              </p>
              <p className="text-gray-800 text-[15px] mb-4">
                今日はすでに{" "}
                <span className="text-2xl font-black" style={{ color: "#e0556a" }}>
                  {formatDuration(stats.totalSec)}
                </span>{" "}
                開いています
              </p>

              <p className="text-xs text-gray-500 mb-2">その内訳</p>
              <div className="space-y-2 mb-4">
                {stats.breakdown.map((b) => (
                  <div key={b.reason.id} className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: b.reason.kind === "good" ? "#34c759" : "#ff5a5f" }}
                    />
                    <span className="text-[13px] text-gray-700 w-20 flex-shrink-0">
                      {b.reason.label}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-black/5 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(b.sec / maxSec) * 100}%`,
                          background: b.reason.kind === "good" ? "#34c759" : "#ff5a5f",
                        }}
                      />
                    </div>
                    <span className="text-[13px] text-gray-600 w-14 text-right flex-shrink-0">
                      {formatDuration(b.sec)}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-gray-900 font-black text-[15px]">本当に開く？</p>
            </>
          ) : (
            <p className="text-gray-800 text-[15px] font-bold">
              今日はまだ開いていません。本当に開く？
            </p>
          )}
        </div>

        {/* 理由選択 */}
        <p className="text-gray-900 font-black text-lg mb-3">どうして開いたの？</p>
        <div className="space-y-2.5">
          <AnimatePresence>
            {reasons.map((r) => (
              <motion.button
                key={r.id}
                whileTap={{ scale: 0.985 }}
                onClick={() => confirmOpen(r.id, true)}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-colors"
                style={{ background: "#f2f2f5" }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: r.kind === "good" ? "#34c759" : "#ff5a5f" }}
                />
                <span className="text-gray-800 font-medium text-[15px]">{r.label}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          ひとつ選ぶと記録されます
        </p>
        <button
          onClick={() => confirmOpen(null, false)}
          className="w-full text-center text-[13px] font-medium mt-2 py-2"
          style={{ color: "#7c6cf0" }}
        >
          記録せずに開く
        </button>

        <Link
          href="/usage"
          className="block text-center text-xs text-gray-400 mt-3 hover:text-gray-600 transition-colors"
        >
          やっぱりやめる
        </Link>
      </motion.div>
    </div>
  );
}
