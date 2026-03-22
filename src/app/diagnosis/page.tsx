"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDiagnosisStore } from "@/store/diagnosisStore";
import { questions } from "@/lib/questions";
import { AnswerValue } from "@/types/diagnosis";

const categoryLabels: Record<string, string> = {
  experience: "経験・実績",
  skill: "スキル・能力",
  aptitude: "適性・好み",
  mindset: "マインドセット",
};

const categoryColors: Record<string, string> = {
  experience: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  skill: "bg-green-500/20 text-green-300 border-green-500/30",
  aptitude: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  mindset: "bg-amber-500/20 text-amber-300 border-amber-500/30",
};

const likertOptions: { value: AnswerValue; label: string; shortLabel: string }[] = [
  { value: 5, label: "とても当てはまる", shortLabel: "とても当てはまる" },
  { value: 4, label: "どちらかといえば当てはまる", shortLabel: "やや当てはまる" },
  { value: 3, label: "どちらとも言えない", shortLabel: "どちらとも言えない" },
  { value: 2, label: "どちらかといえば当てはまらない", shortLabel: "やや当てはまらない" },
  { value: 1, label: "全く当てはまらない", shortLabel: "全く当てはまらない" },
];

const likertColors: Record<number, string> = {
  1: "border-red-500/60 bg-red-500/20 text-red-300",
  2: "border-orange-500/60 bg-orange-500/20 text-orange-300",
  3: "border-gray-500/60 bg-gray-500/20 text-gray-300",
  4: "border-blue-500/60 bg-blue-500/20 text-blue-300",
  5: "border-indigo-500/60 bg-indigo-500/20 text-indigo-200",
};

const likertInactiveColors: Record<number, string> = {
  1: "border-white/10 hover:border-red-500/40 hover:bg-red-500/10 text-gray-400",
  2: "border-white/10 hover:border-orange-500/40 hover:bg-orange-500/10 text-gray-400",
  3: "border-white/10 hover:border-gray-500/40 hover:bg-gray-500/10 text-gray-400",
  4: "border-white/10 hover:border-blue-500/40 hover:bg-blue-500/10 text-gray-400",
  5: "border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/10 text-gray-400",
};

export default function DiagnosisPage() {
  const router = useRouter();
  const {
    step,
    userProfile,
    answers,
    currentQuestionIndex,
    answerQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    calculateResult,
    setAIInsight,
    setResult,
    result,
  } = useDiagnosisStore();

  useEffect(() => {
    if (!userProfile) {
      router.push("/");
    }
  }, [userProfile, router]);

  useEffect(() => {
    if (step === "loading" && result) {
      fetchAIInsight();
    }
  }, [step, result]);

  const fetchAIInsight = async () => {
    if (!userProfile || !result) return;
    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userProfile, result }),
      });
      const data = await res.json();
      if (data.insight) {
        setAIInsight(data.insight);
      }
    } catch (e) {
      console.error("AI insight fetch failed:", e);
    } finally {
      setResult(result);
      router.push("/result");
    }
  };

  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!userProfile) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion.id);
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = answers.length;

  const handleAnswer = (value: AnswerValue) => {
    answerQuestion(currentQuestion.id, value);
    if (currentQuestionIndex < questions.length - 1) {
      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current);
      }
      autoAdvanceTimer.current = setTimeout(() => {
        goToNextQuestion();
        autoAdvanceTimer.current = null;
      }, 400);
    }
  };

  const handleFinish = () => {
    if (answeredCount < questions.length * 0.8) {
      alert("全問中80%以上の回答が必要です。未回答の問題に戻ってください。");
      return;
    }
    calculateResult();
  };

  if (step === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          </div>
          <h2 className="text-2xl font-bold gradient-text mb-2">AI分析中...</h2>
          <p className="text-gray-400">
            あなたの回答をもとにキャリア適性を診断しています
          </p>
          <div className="mt-4 space-y-2 text-sm text-gray-500">
            <motion.p
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            >
              経験・スキルを分析中...
            </motion.p>
            <motion.p
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
            >
              8タイプを照合中...
            </motion.p>
            <motion.p
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.6 }}
            >
              年収シミュレーションを計算中...
            </motion.p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] relative overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">
              Q{currentQuestionIndex + 1} / {questions.length}
            </span>
            <span className="text-indigo-400 text-sm font-medium">
              {answeredCount}問回答済み
            </span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2">
            <motion.div
              className="gradient-bg h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="glass-card p-6"
          >
            {/* Category badge */}
            <div className="mb-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs border ${
                  categoryColors[currentQuestion.category]
                }`}
              >
                {categoryLabels[currentQuestion.category]}
              </span>
            </div>

            {/* Question text */}
            <h2 className="text-lg font-semibold text-white mb-6 leading-relaxed">
              {currentQuestion.text}
            </h2>

            {/* 5段階リッカートスケール */}
            {/* Desktop: 横並び5ボタン */}
            <div className="hidden sm:flex gap-2 mb-2">
              {likertOptions.map((option) => {
                const isSelected = currentAnswer?.value === option.value;
                return (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleAnswer(option.value)}
                    className={`flex-1 py-3 px-2 rounded-xl border text-center text-xs font-medium transition-all ${
                      isSelected
                        ? likertColors[option.value]
                        : `bg-white/5 ${likertInactiveColors[option.value]}`
                    }`}
                  >
                    <div className="text-lg mb-1">{option.value}</div>
                    <div className="leading-tight">{option.shortLabel}</div>
                  </motion.button>
                );
              })}
            </div>
            {/* Desktop: ラベル */}
            <div className="hidden sm:flex justify-between text-xs text-gray-500 mb-4 px-1">
              <span>とても当てはまる</span>
              <span>全く当てはまらない</span>
            </div>

            {/* Mobile: 縦並び5ボタン */}
            <div className="flex sm:hidden flex-col gap-2">
              {likertOptions.map((option) => {
                const isSelected = currentAnswer?.value === option.value;
                return (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAnswer(option.value)}
                    className={`w-full py-3 px-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center gap-3 ${
                      isSelected
                        ? likertColors[option.value]
                        : `bg-white/5 ${likertInactiveColors[option.value]}`
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        isSelected ? "bg-white/20" : "bg-white/10"
                      }`}
                    >
                      {option.value}
                    </span>
                    <span>{option.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            ← 前の質問
          </button>

          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={goToNextQuestion}
              className="px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition"
            >
              次の質問 →
            </button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFinish}
              className="px-6 py-3 gradient-bg text-white font-bold rounded-xl glow"
            >
              診断結果を見る →
            </motion.button>
          )}
        </div>

        {/* Question dots */}
        <div className="flex justify-center gap-1 mt-6 flex-wrap max-w-md mx-auto">
          {questions.map((q, i) => {
            const answered = answers.find((a) => a.questionId === q.id);
            const isCurrent = i === currentQuestionIndex;
            return (
              <button
                key={q.id}
                onClick={() => {
                  const store = useDiagnosisStore.getState();
                  const diff = i - store.currentQuestionIndex;
                  if (diff > 0) {
                    for (let j = 0; j < diff; j++) store.goToNextQuestion();
                  } else {
                    for (let j = 0; j < -diff; j++) store.goToPreviousQuestion();
                  }
                }}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  isCurrent
                    ? "bg-indigo-500 scale-125"
                    : answered
                    ? "bg-indigo-700"
                    : "bg-white/10"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
