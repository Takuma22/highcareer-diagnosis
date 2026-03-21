import { create } from "zustand";
import {
  DiagnosisState,
  Answer,
  AnswerValue,
  UserProfile,
  DiagnosisResult,
  AxisScore,
} from "@/types/diagnosis";
import { questions } from "@/lib/questions";
import {
  getDiagnosisType,
  calculateAxisPercentage,
  calculateSalaryProjection,
  diagnosisTypeData,
} from "@/lib/diagnosisTypes";

interface DiagnosisStore extends DiagnosisState {
  // Actions
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

const initialState: DiagnosisState & { currentQuestionIndex: number } = {
  step: "profile",
  userProfile: null,
  answers: [],
  axisScore: { axis1: 0, axis2: 0, axis3: 0, axis4: 0 },
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

    // 5段階リッカートスケールのスコア計算
    // value 1-5 → delta: 1=-base, 2=-base/2, 3=0, 4=+base/2, 5=+base
    const axisScore: AxisScore = { axis1: 0, axis2: 0, axis3: 0, axis4: 0 };

    answers.forEach((answer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      if (!question) return;

      const { axis, direction, weight } = question.axisImpact;
      const baseScore = weight * 20; // 20, 40, 60

      // 1→-base, 2→-base/2, 3→0, 4→+base/2, 5→+base
      const normalized = answer.value - 3; // -2, -1, 0, 1, 2
      const rawDelta = (normalized / 2) * baseScore;

      // direction: positive = そのまま、negative = 反転
      const delta = direction === "positive" ? rawDelta : -rawDelta;

      const axisKey = `axis${axis}` as keyof AxisScore;
      axisScore[axisKey] = Math.max(-100, Math.min(100, axisScore[axisKey] + delta));
    });

    const diagnosisType = getDiagnosisType(
      axisScore.axis1,
      axisScore.axis2,
      axisScore.axis3,
      axisScore.axis4
    );

    const axisPercentage = calculateAxisPercentage(
      axisScore.axis1,
      axisScore.axis2,
      axisScore.axis3,
      axisScore.axis4
    );

    const typeData = diagnosisTypeData[diagnosisType];
    const salaryProjection = calculateSalaryProjection(
      userProfile?.currentSalary ?? 500,
      diagnosisType,
      typeData.consultingFit
    );

    const result: DiagnosisResult = {
      ...typeData,
      axisPercentage,
      salaryProjection,
    };

    set({ axisScore, result, step: "loading" });
  },

  setAIInsight: (insight) => set({ aiInsight: insight }),

  setResult: (result) => set({ result, step: "result" }),

  reset: () => set(initialState),
}));
