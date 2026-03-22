// 6軸絶対評価システム
// 各軸 0〜100 の絶対スコア（高い = 強い）
// 全問ポジティブ質問 → 全最低 = 全軸0近傍

export type DiagnosisAxis =
  | "execution"      // 実行力
  | "strategy"       // 戦略思考
  | "interpersonal"  // 対人力
  | "expertise"      // 専門性
  | "leadership"     // リーダーシップ
  | "adaptability";  // 適応力

export type DiagnosisTypeName =
  | "指揮官"
  | "参謀"
  | "外交官"
  | "スペシャリスト"
  | "オールラウンダー"
  | "チャレンジャー"
  | "アナリスト"
  | "準備中";

export interface RadarScore {
  execution: number;     // 実行力 0-100
  strategy: number;      // 戦略思考 0-100
  interpersonal: number; // 対人力 0-100
  expertise: number;     // 専門性 0-100
  leadership: number;    // リーダーシップ 0-100
  adaptability: number;  // 適応力 0-100
}

export type QuestionCategory =
  | "experience"
  | "skill"
  | "aptitude"
  | "mindset";

export interface Question {
  id: number;
  category: QuestionCategory;
  text: string;
  axisImpact: {
    axis: DiagnosisAxis;
    weight: number; // 1-3
  };
}

// 5段階リッカートスケール
export type AnswerValue = 1 | 2 | 3 | 4 | 5;

export interface Answer {
  questionId: number;
  value: AnswerValue;
}

export interface UserProfile {
  currentRole: string;
  yearsOfExperience: number;
  currentSalary: number; // 万円
  industry: string;
  skills: string[];
  targetRole?: string;
}

export interface DiagnosisResult {
  typeName: DiagnosisTypeName;
  radarScore: RadarScore;
  consultingFit: number; // 0-100
  title: string;
  subtitle: string;
  description: string;
  detailedAnalysis: string;
  strengths: string[];
  challenges: string[];
  recommendedRoles: RecommendedRole[];
  salaryProjection: SalaryProjection;
  consultingAdvice: ConsultingAdvice;
  lineCtaMessage: string;
}

export interface RecommendedRole {
  title: string;
  firm: string;
  fitScore: number;
  description: string;
  reason: string;
}

export interface SalaryProjection {
  current: number;
  year1: number;
  year3: number;
  year5: number;
  bestCase: number;
  currency: "万円";
}

export interface ConsultingAdvice {
  overview: string;
  strengthsToLeverage: string[];
  skillsToAcquire: string[];
  timeline: string;
  firstStep: string;
}

export interface DiagnosisState {
  step: "profile" | "questions" | "loading" | "result";
  userProfile: UserProfile | null;
  answers: Answer[];
  radarScore: RadarScore;
  result: DiagnosisResult | null;
  aiInsight: string | null;
}
