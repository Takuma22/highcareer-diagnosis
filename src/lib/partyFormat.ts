import { RsvpStatus } from "@/types/party";

// datetime-local 文字列を日本語表記に整形
export function formatEventDate(value: string): string {
  if (!value) return "日時未設定";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

// 一覧カード用の短い日時表記
export function formatEventDateShort(value: string): string {
  if (!value) return "日時未設定";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("ja-JP", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export const RSVP_META: Record<
  RsvpStatus,
  { label: string; short: string; color: string }
> = {
  yes: { label: "参加", short: "○", color: "#5ad0a8" },
  maybe: { label: "未定", short: "△", color: "#e2b55a" },
  no: { label: "不参加", short: "×", color: "#f06a8a" },
  pending: { label: "未回答", short: "—", color: "#9aa0b0" },
};

export const RSVP_ORDER: RsvpStatus[] = ["yes", "maybe", "no", "pending"];
