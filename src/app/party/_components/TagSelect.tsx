"use client";

import { useEffect, useRef, useState } from "react";
import { OccupationCategory } from "@/types/party";
import { CATEGORY_META, OCCUPATION_CATEGORIES } from "@/lib/occupationCategories";

interface TagSelectProps {
  value: OccupationCategory[];
  onChange: (tags: OccupationCategory[]) => void;
}

// 職業カテゴリのチップ表示＋プルダウンによる複数選択
export default function TagSelect({ value, onChange }: TagSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 外側クリックで閉じる
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = (cat: OccupationCategory) => {
    if (value.includes(cat)) {
      onChange(value.filter((c) => c !== cat));
    } else {
      onChange([...value, cat]);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <div className="flex flex-wrap items-center gap-1.5">
        {value.length === 0 && (
          <span className="text-xs text-gray-500">タグなし</span>
        )}
        {value.map((cat) => {
          const meta = CATEGORY_META[cat];
          return (
            <span
              key={cat}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: `${meta.color}1f`,
                color: meta.color,
                border: `1px solid ${meta.color}55`,
              }}
            >
              <span>{meta.emoji}</span>
              {cat}
            </span>
          );
        })}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-white/15 text-gray-400 hover:border-[#e2b55a] hover:text-[#e2b55a] transition-colors text-sm leading-none"
          aria-label="タグを編集"
        >
          {open ? "×" : "+"}
        </button>
      </div>

      {open && (
        <div
          className="absolute z-30 mt-2 w-64 max-h-72 overflow-y-auto navy-card p-2 shadow-2xl"
          style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}
        >
          <p className="text-[11px] text-gray-500 px-2 py-1">
            タグを選択（複数可）
          </p>
          {OCCUPATION_CATEGORIES.map((cat) => {
            const selected = value.includes(cat);
            const meta = CATEGORY_META[cat];
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggle(cat)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                  selected
                    ? "bg-white/8 text-white"
                    : "text-gray-400 hover:bg-white/5"
                }`}
              >
                <span
                  className="inline-flex items-center justify-center w-4 h-4 rounded border text-[10px]"
                  style={{
                    borderColor: selected ? meta.color : "rgba(255,255,255,0.2)",
                    background: selected ? meta.color : "transparent",
                    color: "#0d0d1a",
                  }}
                >
                  {selected ? "✓" : ""}
                </span>
                <span>{meta.emoji}</span>
                <span className="flex-1 text-left">{cat}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
