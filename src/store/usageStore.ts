import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GuardedApp, OpenLog, Reason, ReasonKind } from "@/types/usage";

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

const DEFAULT_REASONS: Reason[] = [
  { id: "kill-time", label: "暇つぶし", kind: "bad" },
  { id: "nantonaku", label: "なんとなく", kind: "bad" },
  { id: "work", label: "仕事で", kind: "good" },
  { id: "research", label: "調べ物", kind: "good" },
];

const DEFAULT_APPS: GuardedApp[] = [
  { id: "seed-x", name: "X", emoji: "𝕏", url: "https://x.com", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "seed-ig", name: "Instagram", emoji: "📷", url: "https://instagram.com", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "seed-yt", name: "YouTube", emoji: "▶️", url: "https://youtube.com", createdAt: "2026-01-01T00:00:00.000Z" },
];

interface UsageStore {
  apps: GuardedApp[];
  reasons: Reason[];
  logs: OpenLog[];
  /** 使用中のログ ID（1 つだけ） */
  activeLogId: string | null;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  addApp: (name: string, emoji: string, url?: string) => void;
  removeApp: (id: string) => void;

  addReason: (label: string, kind: ReasonKind) => void;
  removeReason: (id: string) => void;

  /** 「開く」を確定してセッションを開始。作成したログ ID を返す */
  startSession: (appId: string, reasonId: string | null, recorded: boolean) => string;
  /** 使用中セッションを終了して使用時間を確定 */
  endSession: (logId: string) => void;
}

export const useUsageStore = create<UsageStore>()(
  persist(
    (set, get) => ({
      apps: DEFAULT_APPS,
      reasons: DEFAULT_REASONS,
      logs: [],
      activeLogId: null,
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

      addApp: (name, emoji, url) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const app: GuardedApp = {
          id: uid(),
          name: trimmed,
          emoji: emoji.trim() || "📱",
          url: url?.trim() || undefined,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ apps: [...s.apps, app] }));
      },

      removeApp: (id) => {
        set((s) => ({
          apps: s.apps.filter((a) => a.id !== id),
          logs: s.logs.filter((l) => l.appId !== id),
          activeLogId:
            s.activeLogId &&
            s.logs.find((l) => l.id === s.activeLogId)?.appId === id
              ? null
              : s.activeLogId,
        }));
      },

      addReason: (label, kind) => {
        const trimmed = label.trim();
        if (!trimmed) return;
        set((s) => ({
          reasons: [...s.reasons, { id: uid(), label: trimmed, kind }],
        }));
      },

      removeReason: (id) => {
        set((s) => ({ reasons: s.reasons.filter((r) => r.id !== id) }));
      },

      startSession: (appId, reasonId, recorded) => {
        // 既存のアクティブセッションがあれば閉じておく
        const prev = get().activeLogId;
        if (prev) get().endSession(prev);

        const id = uid();
        const log: OpenLog = {
          id,
          appId,
          reasonId,
          recorded,
          openedAt: new Date().toISOString(),
          durationSec: 0,
        };
        set((s) => ({ logs: [...s.logs, log], activeLogId: id }));
        return id;
      },

      endSession: (logId) => {
        set((s) => ({
          logs: s.logs.map((l) =>
            l.id === logId && !l.closedAt
              ? {
                  ...l,
                  closedAt: new Date().toISOString(),
                  durationSec: Math.max(
                    0,
                    Math.floor(
                      (Date.now() - new Date(l.openedAt).getTime()) / 1000
                    )
                  ),
                }
              : l
          ),
          activeLogId: s.activeLogId === logId ? null : s.activeLogId,
        }));
      },
    }),
    {
      name: "usage-guard-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
