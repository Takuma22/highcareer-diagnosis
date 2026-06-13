"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { usePartyStore } from "@/store/partyStore";
import { categorizeOccupation, CATEGORY_META } from "@/lib/occupationCategories";
import {
  formatEventDate,
  RSVP_META,
  RSVP_ORDER,
} from "@/lib/partyFormat";
import { OccupationCategory } from "@/types/party";
import TagSelect from "../_components/TagSelect";

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const eventId = params.id;

  const {
    events,
    hasHydrated,
    updateEvent,
    addGuest,
    updateGuestTags,
    setGuestRsvp,
    removeGuest,
  } = usePartyStore();

  const event = events.find((e) => e.id === eventId);

  const [guestForm, setGuestForm] = useState({ name: "", occupation: "" });
  const [editingHeader, setEditingHeader] = useState(false);
  const [headerForm, setHeaderForm] = useState({
    title: "",
    date: "",
    location: "",
    notes: "",
  });

  // 職業入力中に推定されるカテゴリ（プレビュー）
  const previewTag = useMemo(
    () =>
      guestForm.occupation.trim()
        ? categorizeOccupation(guestForm.occupation)
        : null,
    [guestForm.occupation]
  );

  // カテゴリ分布（チャート用）
  const categoryData = useMemo(() => {
    if (!event) return [];
    const counts = new Map<OccupationCategory, number>();
    event.guests.forEach((g) =>
      g.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1))
    );
    return [...counts.entries()]
      .map(([name, value]) => ({
        name,
        value,
        color: CATEGORY_META[name].color,
      }))
      .sort((a, b) => b.value - a.value);
  }, [event]);

  // 出欠サマリ
  const rsvpCounts = useMemo(() => {
    const base = { yes: 0, maybe: 0, no: 0, pending: 0 };
    event?.guests.forEach((g) => {
      base[g.rsvp] += 1;
    });
    return base;
  }, [event]);

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-[#090b1a] flex items-center justify-center">
        <p className="text-gray-600 text-sm">読み込み中…</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#090b1a] flex flex-col items-center justify-center px-4 text-center">
        <div className="text-4xl mb-4">🤔</div>
        <p className="text-gray-400 mb-6">イベントが見つかりませんでした。</p>
        <Link
          href="/party"
          className="text-[#e2b55a] hover:underline text-sm"
        >
          ← 一覧に戻る
        </Link>
      </div>
    );
  }

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestForm.name.trim()) return;
    addGuest(event.id, guestForm.name, guestForm.occupation);
    setGuestForm({ name: "", occupation: "" });
  };

  const startEditHeader = () => {
    setHeaderForm({
      title: event.title,
      date: event.date,
      location: event.location ?? "",
      notes: event.notes ?? "",
    });
    setEditingHeader(true);
  };

  const saveHeader = (e: React.FormEvent) => {
    e.preventDefault();
    updateEvent(event.id, {
      title: headerForm.title.trim() || "無題のパーティー",
      date: headerForm.date,
      location: headerForm.location.trim() || undefined,
      notes: headerForm.notes.trim() || undefined,
    });
    setEditingHeader(false);
  };

  return (
    <div className="min-h-screen bg-[#090b1a]">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <Link
          href="/party"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#e2b55a] transition-colors mb-6"
        >
          ← パーティー一覧
        </Link>

        {/* ===== Event header ===== */}
        {!editingHeader ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-gold p-6 mb-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-2xl font-black text-white">
                  {event.title}
                </h1>
                <p className="text-[#e2b55a] text-sm mt-2">
                  🗓 {formatEventDate(event.date)}
                </p>
                {event.location && (
                  <p className="text-gray-300 text-sm mt-1">
                    📍 {event.location}
                  </p>
                )}
                {event.notes && (
                  <p className="text-gray-400 text-sm mt-3 whitespace-pre-wrap">
                    {event.notes}
                  </p>
                )}
              </div>
              <button
                onClick={startEditHeader}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/25 transition-colors text-xs"
              >
                編集
              </button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={saveHeader} className="glass-card p-6 mb-6 space-y-4">
            <input
              type="text"
              value={headerForm.title}
              onChange={(e) =>
                setHeaderForm({ ...headerForm, title: e.target.value })
              }
              placeholder="イベント名"
              className="form-input"
            />
            <input
              type="datetime-local"
              value={headerForm.date}
              onChange={(e) =>
                setHeaderForm({ ...headerForm, date: e.target.value })
              }
              className="form-input"
              style={{ colorScheme: "dark" }}
            />
            <input
              type="text"
              value={headerForm.location}
              onChange={(e) =>
                setHeaderForm({ ...headerForm, location: e.target.value })
              }
              placeholder="場所（任意）"
              className="form-input"
            />
            <textarea
              value={headerForm.notes}
              onChange={(e) =>
                setHeaderForm({ ...headerForm, notes: e.target.value })
              }
              placeholder="メモ（任意）"
              rows={2}
              className="form-input resize-none"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 btn-shimmer text-[#0d0d1a] font-black py-2.5 rounded-xl"
              >
                保存
              </button>
              <button
                type="button"
                onClick={() => setEditingHeader(false)}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-colors text-sm"
              >
                キャンセル
              </button>
            </div>
          </form>
        )}

        {/* ===== Summary ===== */}
        {event.guests.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* RSVP counts */}
            <div className="navy-card p-5">
              <h3 className="text-sm font-bold text-white mb-3">出欠状況</h3>
              <div className="space-y-2">
                {RSVP_ORDER.map((status) => {
                  const meta = RSVP_META[status];
                  const count = rsvpCounts[status];
                  const pct = event.guests.length
                    ? (count / event.guests.length) * 100
                    : 0;
                  return (
                    <div key={status} className="flex items-center gap-3">
                      <span
                        className="text-xs w-12 flex-shrink-0"
                        style={{ color: meta.color }}
                      >
                        {meta.label}
                      </span>
                      <div className="flex-1 progress-track">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            background: meta.color,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-6 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category distribution */}
            <div className="navy-card p-5">
              <h3 className="text-sm font-bold text-white mb-1">
                職業カテゴリ分布
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-28 h-28 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={28}
                        outerRadius={52}
                        paddingAngle={2}
                        stroke="none"
                      >
                        {categoryData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "#141728",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  {categoryData.slice(0, 5).map((c) => (
                    <div
                      key={c.name}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: c.color }}
                      />
                      <span className="text-gray-300 truncate">{c.name}</span>
                      <span className="text-gray-500 ml-auto">{c.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== Add guest ===== */}
        <form onSubmit={handleAddGuest} className="glass-card p-5 mb-6">
          <div className="flex items-center gap-3 pb-3 mb-3 border-b border-white/6">
            <div className="w-1 h-5 gradient-bg rounded-full" />
            <h2 className="text-sm font-bold text-white">ゲストを追加</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={guestForm.name}
              onChange={(e) =>
                setGuestForm({ ...guestForm, name: e.target.value })
              }
              placeholder="名前"
              className="form-input sm:flex-1"
            />
            <input
              type="text"
              value={guestForm.occupation}
              onChange={(e) =>
                setGuestForm({ ...guestForm, occupation: e.target.value })
              }
              placeholder="職業（例: Webエンジニア）"
              className="form-input sm:flex-1"
            />
            <button
              type="submit"
              className="btn-shimmer text-[#0d0d1a] font-black px-6 py-3 rounded-xl whitespace-nowrap"
            >
              追加
            </button>
          </div>
          {previewTag && (
            <p className="text-xs text-gray-500 mt-3">
              自動タグ予測:{" "}
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: `${CATEGORY_META[previewTag].color}1f`,
                  color: CATEGORY_META[previewTag].color,
                }}
              >
                {CATEGORY_META[previewTag].emoji} {previewTag}
              </span>{" "}
              <span className="text-gray-600">（追加後に変更できます）</span>
            </p>
          )}
        </form>

        {/* ===== Guest list ===== */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-300">
            ゲスト一覧{" "}
            <span className="text-gray-600">（{event.guests.length}名）</span>
          </h2>
        </div>

        {event.guests.length === 0 ? (
          <div className="glass-card p-8 text-center text-gray-500 text-sm">
            まだゲストがいません。上のフォームから追加しましょう。
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {event.guests.map((guest) => (
                <motion.div
                  key={guest.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="glass-card p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white">
                          {guest.name}
                        </span>
                        {guest.occupation && (
                          <span className="text-xs text-gray-400">
                            {guest.occupation}
                          </span>
                        )}
                      </div>
                      <div className="mt-2.5">
                        <TagSelect
                          value={guest.tags}
                          onChange={(tags) =>
                            updateGuestTags(event.id, guest.id, tags)
                          }
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => removeGuest(event.id, guest.id)}
                      className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-colors text-sm"
                      aria-label="ゲストを削除"
                    >
                      ✕
                    </button>
                  </div>

                  {/* RSVP selector */}
                  <div className="flex gap-1.5 mt-3 pt-3 border-t border-white/6">
                    {RSVP_ORDER.map((status) => {
                      const meta = RSVP_META[status];
                      const active = guest.rsvp === status;
                      return (
                        <button
                          key={status}
                          onClick={() =>
                            setGuestRsvp(event.id, guest.id, status)
                          }
                          className="px-3 py-1 rounded-full text-xs border transition-all"
                          style={
                            active
                              ? {
                                  background: `${meta.color}26`,
                                  borderColor: meta.color,
                                  color: meta.color,
                                  fontWeight: 600,
                                }
                              : {
                                  borderColor: "rgba(255,255,255,0.08)",
                                  color: "#9aa0b0",
                                }
                          }
                        >
                          {meta.label}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
