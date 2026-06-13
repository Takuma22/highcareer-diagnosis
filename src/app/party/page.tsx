"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePartyStore } from "@/store/partyStore";
import { formatEventDateShort } from "@/lib/partyFormat";
import { CATEGORY_META } from "@/lib/occupationCategories";

export default function PartyListPage() {
  const { events, hasHydrated, addEvent, deleteEvent } = usePartyStore();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    notes: "",
  });
  const [error, setError] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("イベント名を入力してください");
      return;
    }
    if (!form.date) {
      setError("日時を選択してください");
      return;
    }
    addEvent(form);
    setForm({ title: "", date: "", location: "", notes: "" });
    setError("");
    setShowForm(false);
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
          <div className="text-5xl mb-3">🎉</div>
          <h1 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight">
            <span className="gradient-text">ホームパーティー</span>
            <span className="text-white"> 管理</span>
          </h1>
          <p className="text-gray-400 text-sm">
            日時とゲストを登録。職業は自動でカテゴリ分けしてタグ付けします
          </p>
        </motion.div>

        {/* New event button / form */}
        <div className="mb-8">
          {!showForm ? (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setShowForm(true)}
              className="w-full btn-shimmer text-[#0d0d1a] font-black py-4 rounded-2xl text-base sm:text-lg tracking-wide glow"
            >
              ＋ 新しいパーティーを作成
            </motion.button>
          ) : (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              onSubmit={handleCreate}
              className="glass-card p-6 space-y-4"
            >
              <div className="flex items-center gap-3 pb-2 border-b border-white/6">
                <div className="w-1 h-6 gradient-bg rounded-full" />
                <h2 className="text-base font-bold text-white">
                  新しいパーティー
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  イベント名
                  <span className="ml-1.5 text-[10px] font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">
                    必須
                  </span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="例: 春の持ち寄りホームパーティー"
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  日時
                  <span className="ml-1.5 text-[10px] font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">
                    必須
                  </span>
                </label>
                <input
                  type="datetime-local"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="form-input"
                  style={{ colorScheme: "dark" }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  場所
                  <span className="text-gray-600 text-xs ml-1">（任意）</span>
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  placeholder="例: 自宅リビング / 渋谷のレンタルスペース"
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  メモ
                  <span className="text-gray-600 text-xs ml-1">（任意）</span>
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="持ち寄り品、ドレスコードなど"
                  rows={2}
                  className="form-input resize-none"
                />
              </div>

              {error && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <span>⚠</span> {error}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  className="flex-1 btn-shimmer text-[#0d0d1a] font-black py-3 rounded-xl"
                >
                  作成する
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setError("");
                  }}
                  className="px-5 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/25 transition-colors text-sm"
                >
                  キャンセル
                </button>
              </div>
            </motion.form>
          )}
        </div>

        {/* Event list */}
        {!hasHydrated ? (
          <p className="text-center text-gray-600 text-sm py-10">読み込み中…</p>
        ) : events.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <div className="text-4xl mb-3 float">📋</div>
            <p className="text-gray-400 text-sm">
              まだパーティーがありません。
              <br />
              上のボタンから最初のイベントを作成しましょう。
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {events.map((event) => {
                const attending = event.guests.filter(
                  (g) => g.rsvp === "yes"
                ).length;
                // タグ分布（上位を表示）
                const tagCounts = new Map<string, number>();
                event.guests.forEach((g) =>
                  g.tags.forEach((t) =>
                    tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)
                  )
                );
                const topTags = [...tagCounts.entries()]
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 4);

                return (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    className="glass-card p-5 hover:border-white/15 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/party/${event.id}`} className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white truncate group-hover:text-[#e2b55a] transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-sm text-[#e2b55a] mt-1">
                          🗓 {formatEventDateShort(event.date)}
                        </p>
                        {event.location && (
                          <p className="text-xs text-gray-500 mt-0.5 truncate">
                            📍 {event.location}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                          <span>
                            👥 {event.guests.length}名
                            <span className="text-gray-600">
                              {" "}
                              （参加 {attending}）
                            </span>
                          </span>
                        </div>
                        {topTags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {topTags.map(([tag, count]) => {
                              const meta =
                                CATEGORY_META[
                                  tag as keyof typeof CATEGORY_META
                                ];
                              return (
                                <span
                                  key={tag}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px]"
                                  style={{
                                    background: `${meta.color}1a`,
                                    color: meta.color,
                                  }}
                                >
                                  {meta.emoji} {tag} {count}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </Link>

                      <button
                        onClick={() => {
                          if (
                            confirm(`「${event.title}」を削除しますか？`)
                          ) {
                            deleteEvent(event.id);
                          }
                        }}
                        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                        aria-label="削除"
                      >
                        🗑
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
