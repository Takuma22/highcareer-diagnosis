// ホームパーティー管理アプリの型定義

// 職業の汎用カテゴリ（タグ）
export type OccupationCategory =
  | "IT・エンジニア"
  | "クリエイティブ"
  | "ビジネス・経営"
  | "営業・マーケ"
  | "金融・コンサル"
  | "医療・ヘルスケア"
  | "教育・研究"
  | "法律・士業"
  | "公務員・公共"
  | "サービス・接客"
  | "メディア・エンタメ"
  | "製造・建設・物流"
  | "学生"
  | "その他";

// 出欠ステータス
export type RsvpStatus = "yes" | "maybe" | "no" | "pending";

// 来場メンバー（ゲスト）
export interface Guest {
  id: string;
  name: string;
  occupation: string;
  tags: OccupationCategory[]; // 自動付与 + 手動で複数選択可
  rsvp: RsvpStatus;
}

// イベント
export interface PartyEvent {
  id: string;
  title: string;
  date: string; // <input type="datetime-local"> の値（"YYYY-MM-DDTHH:mm"）
  location?: string;
  notes?: string;
  guests: Guest[];
  createdAt: string; // ISO
}
