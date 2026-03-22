// 6軸定義
// 1: 実行力 (Execution)
// 2: 戦略思考 (Strategy)
// 3: 対人力 (Interpersonal)
// 4: 専門性 (Expertise)
// 5: リーダーシップ (Leadership)
// 6: 適応力 (Adaptability)

export type DiagnosisType =
  | "指揮官"
  | "参謀"
  | "外交官"
  | "スペシャリスト"
  | "オールラウンダー"
  | "チャレンジャー"
  | "アナリスト"
  | "準備中";

export interface AxisScore {
  execution: number;     // 実行力 0-100
  strategy: number;      // 戦略思考 0-100
  interpersonal: number; // 対人力 0-100
  expertise: number;     // 専門性 0-100
  leadership: number;    // リーダーシップ 0-100
  adaptability: number;  // 適応力 0-100
}

export interface AxisPercentage {
  execution: number;
  strategy: number;
  interpersonal: number;
  expertise: number;
  leadership: number;
  adaptability: number;
}

export type QuestionCategory =
  | "experience"   // 経験・実績
  | "skill"        // スキル・能力
  | "aptitude"     // 適性・好み
  | "mindset";     // マインドセット

export interface Question {
  id: number;
  category: QuestionCategory;
  text: string;
  axisImpact: {
    axis: 1 | 2 | 3 | 4 | 5 | 6;
    direction: "positive";
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
  type: DiagnosisType;
  axisPercentage: AxisPercentage;
  title: string;
  subtitle: string;
  description: string;
  detailedAnalysis: string;
  strengths: string[];
  challenges: string[];
  consultingFit: number; // 0-100
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
  axisScore: AxisScore;
  result: DiagnosisResult | null;
  aiInsight: string | null;
}
