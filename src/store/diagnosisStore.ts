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
  axisScore: {
    execution: 0,
    strategy: 0,
    interpersonal: 0,
    expertise: 0,
    leadership: 0,
    adaptability: 0,
  },
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

    // 軸ごとに回答を集計し、絶対スコア(0-100)を算出
    // score = sum(value * weight) / sum(5 * weight) * 100
    const axisBuckets: Record<number, { value: number; weight: number }[]> = {
      1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
    };

    answers.forEach((answer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      if (!question) return;
      const { axis, weight } = question.axisImpact;
      axisBuckets[axis].push({ value: answer.value, weight });
    });

    const toScore = (bucket: { value: number; weight: number }[]) => {
      if (bucket.length === 0) return 0;
      const sum = bucket.reduce((acc, { value, weight }) => acc + value * weight, 0);
      const maxPossible = bucket.reduce((acc, { weight }) => acc + 5 * weight, 0);
      return Math.round((sum / maxPossible) * 100);
    };

    const axisScore: AxisScore = {
      execution: toScore(axisBuckets[1]),
      strategy: toScore(axisBuckets[2]),
      interpersonal: toScore(axisBuckets[3]),
      expertise: toScore(axisBuckets[4]),
      leadership: toScore(axisBuckets[5]),
      adaptability: toScore(axisBuckets[6]),
    };

    const diagnosisType = getDiagnosisType(axisScore);
    const axisPercentage = calculateAxisPercentage(axisScore);
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
