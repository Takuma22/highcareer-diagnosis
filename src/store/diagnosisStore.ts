import { create } from "zustand";
import {
  DiagnosisState,
  Answer,
  AnswerValue,
  UserProfile,
  DiagnosisResult,
  RadarScore,
  DiagnosisAxis,
} from "@/types/diagnosis";
import { questions } from "@/lib/questions";
import {
  getDiagnosisTypeName,
  calculateConsultingFit,
  calculateSalaryProjection,
  diagnosisTypeData,
} from "@/lib/diagnosisTypes";

interface DiagnosisStore extends DiagnosisState {
  setUserProfile: (profile: UserProfile) => void;
  answerQuestion: (questionId: number, value: AnswerValue) => void;
  goToStep: (step: DiagnosisState["step"]) => void;
  calculateResult: () => void;
  setAIInsight: (insight: string) => void;
  setResult: (result: DiagnosisResult) => void;
  reset: () => void;
  currentQuestionIndex: number;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
}

const initialRadarScore: RadarScore = {
  execution: 0,
  strategy: 0,
  interpersonal: 0,
  expertise: 0,
  leadership: 0,
  adaptability: 0,
};

const initialState: DiagnosisState & { currentQuestionIndex: number } = {
  step: "profile",
  userProfile: null,
  answers: [],
  radarScore: initialRadarScore,
  result: null,
  aiInsight: null,
  currentQuestionIndex: 0,
};

export const useDiagnosisStore = create<DiagnosisStore>((set, get) => ({
  ...initialState,

  setUserProfile: (profile) => {
    set({ userProfile: profile, step: "questions" });
  },

  answerQuestion: (questionId, value) => {
    const { answers } = get();
    const existing = answers.findIndex((a) => a.questionId === questionId);
    const newAnswer: Answer = { questionId, value };
    if (existing >= 0) {
      const updated = [...answers];
      updated[existing] = newAnswer;
      set({ answers: updated });
    } else {
      set({ answers: [...answers, newAnswer] });
    }
  },

  goToStep: (step) => set({ step }),

  goToNextQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  goToPreviousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  calculateResult: () => {
    const { answers, userProfile } = get();

    // 6軸ごとの重み付き合計とMAX合計を計算
    const axisSums: Record<DiagnosisAxis, { weightedSum: number; maxSum: number }> = {
      execution:    { weightedSum: 0, maxSum: 0 },
      strategy:     { weightedSum: 0, maxSum: 0 },
      interpersonal:{ weightedSum: 0, maxSum: 0 },
      expertise:    { weightedSum: 0, maxSum: 0 },
      leadership:   { weightedSum: 0, maxSum: 0 },
      adaptability: { weightedSum: 0, maxSum: 0 },
    };

    // 全質問のmax合計を事前計算（未回答の質問は中間値3で補完）
    questions.forEach((q) => {
      const answer = answers.find((a) => a.questionId === q.id);
      const value = answer ? answer.value : 3; // 未回答は中間値
      const { axis, weight } = q.axisImpact;
      axisSums[axis].weightedSum += value * weight;
      axisSums[axis].maxSum += 5 * weight;
    });

    // 各軸スコアを 0〜100 に正規化
    // min = 1*weight_sum, max = 5*weight_sum
    const radarScore: RadarScore = {
      execution: 0,
      strategy: 0,
      interpersonal: 0,
      expertise: 0,
      leadership: 0,
      adaptability: 0,
    };

    (Object.keys(axisSums) as DiagnosisAxis[]).forEach((axis) => {
      const { weightedSum, maxSum } = axisSums[axis];
      const minSum = maxSum / 5; // 1 * weight_sum
      if (maxSum === minSum) {
        radarScore[axis] = 50;
      } else {
        radarScore[axis] = Math.round(((weightedSum - minSum) / (maxSum - minSum)) * 100);
      }
    });

    const typeName = getDiagnosisTypeName(radarScore);
    const consultingFit = calculateConsultingFit(radarScore);
    const typeData = diagnosisTypeData[typeName];
    const salaryProjection = calculateSalaryProjection(
      userProfile?.currentSalary ?? 500,
      consultingFit
    );

    const result: DiagnosisResult = {
      ...typeData,
      radarScore,
      consultingFit,
      salaryProjection,
    };

    set({ radarScore, result, step: "loading" });
  },

  setAIInsight: (insight) => set({ aiInsight: insight }),

  setResult: (result) => set({ result, step: "result" }),

  reset: () => set(initialState),
}));
