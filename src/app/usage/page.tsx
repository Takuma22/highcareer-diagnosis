"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useUsageStore } from "@/store/usageStore";
import { useNow } from "@/lib/useNow";
import { formatDuration } from "@/lib/usageFormat";
import { getTodayStats, getDailyTotals } from "@/lib/usageStats";
import { ReasonKind } from "@/types/usage";

export default function UsageDashboardPage() {
  const {
    apps,
    reasons,
    logs,
    hasHydrated,
    addApp,
    removeApp,
    addReason,
    removeReason,
  } = useUsageStore();
  const now = useNow(1000);

  const [showAppForm, setShowAppForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [appForm, setAppForm] = useState({ name: "", emoji: "", url: "" });
  const [reasonForm, setReasonForm] = useState<{ label: string; kind: ReasonKind }>({
    label: "",
    kind: "bad",
  });

  const overall = getTodayStats(logs, reasons, now);
  const daily = getDailyTotals(logs, now, 7);
  const maxDaily = Math.max(1, ...daily.map((d) => d.sec));

  const handleAddApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appForm.name.trim()) return;
    addApp(appForm.name, appForm.emoji, appForm.url);
    setAppForm({ name: "", emoji: "", url: "" });
    setShowAppForm(false);
  };

  const handleAddReason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonForm.label.trim()) return;
    addReason(reasonForm.label, reasonForm.kind);
    setReasonForm({ label: "", kind: "bad" });
  };

  return (
    <div className="min-h-screen bg-[#090b1a]">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="text-5xl mb-3">📵</div>
          <h1 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight">
            <span className="gradient-text-blue">アプリ中毒</span>
            <span className="text-white"> ガード</span>
          </h1>
          <p className="text-gray-400 text-sm">
            開く前に「回数・時間・理由」を突きつける、自分のためのローカルアプリ
          </p>
        </motion.div>

        {/* Today summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 gradient-bg-cool rounded-full" />
            <h2 className="text-base font-bold text-white">今日の合計</h2>
          </div>
          {!hasHydrated ? (
            <p className="text-gray-600 text-sm">読み込み中…</p>
          ) : (
            <>
              <div className="flex items-end gap-6 mb-6">
                <div>
                  <div className="text-3xl font-black text-white tabular-nums">
                    {overall.count}
                    <span className="text-sm font-bold text-gray-400 ml-1">回</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">開いた回数</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-white">
                    {formatDuration(overall.totalSec)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">使った時間</div>
                </div>
              </div>

              {/* 7-day mini chart */}
              <div className="flex items-end justify-between gap-1.5 h-20">
                {daily.map((d, i) => (
                  <div key={d.key} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex-1 flex items-end">
                      <div
                        className="w-full rounded-t-md transition-all"
                        style={{
                          height: `${(d.sec / maxDaily) * 100}%`,
                          minHeight: d.sec > 0 ? 4 : 0,
                          background:
                            i === daily.length - 1
                              ? "linear-gradient(180deg,#a855f7,#6366f1)"
                              : "rgba(255,255,255,0.12)",
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-600">{d.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* App list */}
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold text-gray-300">ガードするアプリ</h2>
          <button
            onClick={() => setShowAppForm((v) => !v)}
            className="text-xs text-[#6a9feb] hover:text-[#a855f7] transition-colors font-medium"
          >
            {showAppForm ? "閉じる" : "＋ アプリを追加"}
          </button>
        </div>

        <AnimatePresence>
          {showAppForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddApp}
              className="glass-card p-5 mb-4 space-y-3 overflow-hidden"
            >
              <div className="flex gap-3">
                <div className="w-20">
                  <label className="block text-xs text-gray-400 mb-1.5">絵文字</label>
                  <input
                    value={appForm.emoji}
                    onChange={(e) => setAppForm({ ...appForm, emoji: e.target.value })}
                    placeholder="📱"
                    className="form-input text-center"
                    maxLength={4}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1.5">アプリ名</label>
                  <input
                    value={appForm.name}
                    onChange={(e) => setAppForm({ ...appForm, name: e.target.value })}
                    placeholder="例: TikTok"
                    className="form-input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">
                  URL <span className="text-gray-600">（任意 / 開く確定時に遷移）</span>
                </label>
                <input
                  value={appForm.url}
                  onChange={(e) => setAppForm({ ...appForm, url: e.target.value })}
                  placeholder="https://..."
                  className="form-input"
                />
              </div>
              <button
                type="submit"
                className="w-full gradient-bg-cool text-white font-bold py-2.5 rounded-xl text-sm"
              >
                追加する
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {!hasHydrated ? (
          <p className="text-center text-gray-600 text-sm py-10">読み込み中…</p>
        ) : apps.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <div className="text-4xl mb-3">📱</div>
            <p className="text-gray-400 text-sm">
              ガードするアプリがありません。
              <br />
              「＋ アプリを追加」から登録しましょう。
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {apps.map((app) => {
                const stats = getTodayStats(logs, reasons, now, app.id);
                return (
                  <motion.div
                    key={app.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    className="glass-card p-4 flex items-center gap-4 group"
                  >
                    <div className="text-3xl w-11 h-11 flex items-center justify-center flex-shrink-0">
                      {app.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white truncate">{app.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        今日 {stats.count}回 ・ {formatDuration(stats.totalSec)}
                      </p>
                    </div>
                    <Link
                      href={`/usage/${app.id}`}
                      className="flex-shrink-0 gradient-bg-cool text-white font-bold px-5 py-2 rounded-xl text-sm hover:opacity-90 transition-opacity"
                    >
                      開く
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`「${app.name}」を削除しますか？`)) removeApp(app.id);
                      }}
                      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-700 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      aria-label="削除"
                    >
                      🗑
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Reasons settings */}
        <div className="flex items-center justify-between mt-8 mb-3 px-1">
          <h2 className="text-sm font-bold text-gray-300">理由の選択肢</h2>
          <button
            onClick={() => setShowSettings((v) => !v)}
            className="text-xs text-[#6a9feb] hover:text-[#a855f7] transition-colors font-medium"
          >
            {showSettings ? "閉じる" : "編集"}
          </button>
        </div>

        <div className="glass-card p-4">
          <div className="flex flex-wrap gap-2">
            {reasons.map((r) => (
              <span
                key={r.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                style={{
                  background: r.kind === "good" ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)",
                  color: r.kind === "good" ? "#34d399" : "#f87171",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: r.kind === "good" ? "#34d399" : "#f87171" }}
                />
                {r.label}
                {showSettings && (
                  <button
                    onClick={() => removeReason(r.id)}
                    className="ml-0.5 text-current/60 hover:text-current"
                    aria-label="削除"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>

          {showSettings && (
            <form onSubmit={handleAddReason} className="flex gap-2 mt-4">
              <input
                value={reasonForm.label}
                onChange={(e) => setReasonForm({ ...reasonForm, label: e.target.value })}
                placeholder="新しい理由"
                className="form-input flex-1"
              />
              <button
                type="button"
                onClick={() =>
                  setReasonForm((f) => ({
                    ...f,
                    kind: f.kind === "good" ? "bad" : "good",
                  }))
                }
                className="px-3 rounded-xl text-xs font-bold border border-white/10"
                style={{ color: reasonForm.kind === "good" ? "#34d399" : "#f87171" }}
              >
                {reasonForm.kind === "good" ? "● 前向き" : "● つい"}
              </button>
              <button
                type="submit"
                className="px-4 rounded-xl bg-white/10 text-white text-sm font-bold hover:bg-white/15 transition-colors"
              >
                追加
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-600 mt-8">
          データは端末内（localStorage）にのみ保存されます
        </p>
      </div>
    </div>
  );
}
