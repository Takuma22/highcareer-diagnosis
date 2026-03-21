// 4軸の定義
// 軸1: S (Strategic) vs E (Execution) - 戦略思考 vs 実行力
// 軸2: D (Data) vs R (Relation) - データ・論理 vs 人間関係・感情
// 軸3: L (Leadership) vs X (Specialist) - リーダーシップ vs 専門性
// 軸4: A (Ambition) vs B (Balance/Stability) - 野心・変化志向 vs 安定志向

export type Axis1 = "S" | "E"; // Strategic vs Execution
export type Axis2 = "D" | "R"; // Data vs Relation
export type Axis3 = "L" | "X"; // Leadership vs eXpert(Specialist)
export type Axis4 = "A" | "B"; // Ambition vs Balance(Stability)

export type DiagnosisType = `${Axis1}${Axis2}${Axis3}${Axis4}`;

export interface AxisScore {
  axis1: number; // -100(E) ~ +100(S)
  axis2: number; // -100(R) ~ +100(D)
  axis3: number; // -100(X) ~ +100(L)
  axis4: number; // -100(B) ~ +100(A)
}

export interface AxisPercentage {
  s_percent: number; // Strategic %
  d_percent: number; // Data %
  l_percent: number; // Leadership %
  a_percent: number; // Ambition %
}

export type QuestionCategory =
  | "experience"   // 経験・実績
  | "skill"        // スキル・能力
  | "aptitude"     // 適性・好み
  | "mindset";     // マインドセット

export interface Question {
  id: number;
  category: QuestionCategory;
  text: string; // 「〜だと思う」形式
  axisImpact: {
    axis: 1 | 2 | 3 | 4;
    direction: "positive" | "negative"; // positive = 同意(5)がpositive方向
    weight: number; // 1-3
  };
}

// 5段階リッカートスケール: 1=まったくそう思わない 〜 5=とてもそう思う
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
  detailedAnalysis: string; // 500-800文字の詳細分析
  axisExplanations: AxisExplanations; // 各軸の意味説明
  strengths: string[];
  challenges: string[];
  consultingFit: number; // 0-100%
  recommendedRoles: RecommendedRole[];
  salaryProjection: SalaryProjection;
  consultingAdvice: ConsultingAdvice;
  lineCtaMessage: string;
}

export interface AxisExplanations {
  axis1: string;
  axis2: string;
  axis3: string;
  axis4: string;
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
