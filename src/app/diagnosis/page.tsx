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

const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  experience: { bg: "rgba(74,127,219,0.15)", border: "rgba(74,127,219,0.4)", text: "#7aabf0" },
  skill: { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.4)", text: "#34d399" },
  aptitude: { bg: "rgba(168,85,247,0.15)", border: "rgba(168,85,247,0.4)", text: "#c084fc" },
  mindset: { bg: "rgba(226,181,90,0.15)", border: "rgba(226,181,90,0.4)", text: "#e2b55a" },
};

// value 5 = gold (very agree), 1 = red (disagree)
const likertOptions: { value: AnswerValue; label: string; shortLabel: string }[] = [
  { value: 5, label: "とても当てはまる", shortLabel: "とても当てはまる" },
  { value: 4, label: "どちらかといえば当てはまる", shortLabel: "やや当てはまる" },
  { value: 3, label: "どちらとも言えない", shortLabel: "どちらとも言えない" },
  { value: 2, label: "どちらかといえば当てはまらない", shortLabel: "やや当てはまらない" },
  { value: 1, label: "全く当てはまらない", shortLabel: "全く当てはまらない" },
];

const likertActiveStyle: Record<number, { bg: string; border: string; text: string }> = {
  5: { bg: "rgba(226,181,90,0.18)", border: "#e2b55a", text: "#f0c97a" },
  4: { bg: "rgba(226,181,90,0.1)", border: "rgba(226,181,90,0.6)", text: "#deb870" },
  3: { bg: "rgba(120,120,130,0.2)", border: "rgba(150,150,160,0.7)", text: "#c8c8d0" },
  2: { bg: "rgba(251,146,60,0.12)", border: "rgba(251,146,60,0.6)", text: "#fb923c" },
  1: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.6)", text: "#f87171" },
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
  const remaining = questions.length - currentQuestionIndex - 1;
  const catStyle = categoryColors[currentQuestion.category] ?? categoryColors.mindset;

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
      <div className="min-h-screen bg-[#090b1a] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          {/* Spinner */}
          <div className="w-20 h-20 mx-auto mb-8 relative">
            <div
              className="absolute inset-0 rounded-full"
              style={{ border: "4px solid rgba(226,181,90,0.1)" }}
            />
            <div
              className="absolute inset-0 rounded-full animate-spin"
              style={{
                border: "4px solid transparent",
                borderTopColor: "#e2b55a",
                borderRightColor: "rgba(226,181,90,0.3)",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">✦</span>
            </div>
          </div>
          <h2 className="text-2xl font-black gradient-text mb-2">AI分析中...</h2>
          <p className="text-gray-400 text-sm mb-6">
            あなたの回答をもとにキャリア適性を診断しています
          </p>
          <div className="space-y-2.5 text-sm">
            {[
              { text: "経験・スキルを分析中...", delay: 0 },
              { text: "8タイプを照合中...", delay: 0.8 },
              { text: "年収シミュレーションを計算中...", delay: 1.6 },
            ].map(({ text, delay }) => (
              <motion.div
                key={text}
                className="flex items-center justify-center gap-2 text-gray-500"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, delay }}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: "#e2b55a" }}
                />
                {text}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090b1a] relative overflow-hidden">
      {/* BG blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-[#e2b55a]/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-indigo-600/8 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto px-4 py-6 sm:py-8">
        {/* ===== PROGRESS HEADER ===== */}
        <div className="mb-6">
          {/* Top row: counter + answered */}
          <div className="flex items-end justify-between mb-3">
            <div className="flex items-baseline gap-1.5">
              <span
                className="text-4xl font-black leading-none"
                style={{ color: "#e2b55a" }}
              >
                {currentQuestionIndex + 1}
              </span>
              <span className="text-gray-600 text-lg font-medium">
                / {questions.length}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500">
                {answeredCount}問回答済み
                {remaining > 0 && (
                  <span className="ml-1.5 text-gray-600">
                    (あと{remaining}問)
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="progress-track">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>

          {/* Percentage */}
          <div className="flex justify-end mt-1.5">
            <span
              className="text-xs font-bold"
              style={{ color: "rgba(226,181,90,0.7)" }}
            >
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* ===== QUESTION CARD ===== */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.22 }}
            className="glass-card p-5 sm:p-7"
          >
            {/* Question header: badge + number */}
            <div className="flex items-center justify-between mb-5">
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border"
                style={{
                  background: catStyle.bg,
                  borderColor: catStyle.border,
                  color: catStyle.text,
                }}
              >
                {categoryLabels[currentQuestion.category]}
              </span>
              <span
                className="text-xs font-black px-3 py-1 rounded-full"
                style={{
                  background: "rgba(226,181,90,0.1)",
                  color: "#e2b55a",
                  border: "1px solid rgba(226,181,90,0.25)",
                }}
              >
                Q{currentQuestionIndex + 1}
              </span>
            </div>

            {/* Question text */}
            <h2 className="text-base sm:text-lg font-bold text-white mb-6 leading-relaxed">
              {currentQuestion.text}
            </h2>

            {/* ===== DESKTOP: 横並び5ボタン ===== */}
            <div className="hidden sm:flex gap-2 mb-2">
              {likertOptions.map((option) => {
                const isSelected = currentAnswer?.value === option.value;
                const active = likertActiveStyle[option.value];
                return (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.04, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleAnswer(option.value)}
                    className="flex-1 py-3 px-2 rounded-xl border text-center text-xs font-medium transition-all"
                    style={
                      isSelected
                        ? {
                            background: active.bg,
                            borderColor: active.border,
                            color: active.text,
                            boxShadow: `0 0 16px ${active.border}40`,
                          }
                        : {
                            background: "rgba(255,255,255,0.03)",
                            borderColor: "rgba(255,255,255,0.08)",
                            color: "#9ca3af",
                          }
                    }
                  >
                    <div className="text-lg font-black mb-1">{option.value}</div>
                    <div className="leading-tight text-[10px]">{option.shortLabel}</div>
                  </motion.button>
                );
              })}
            </div>
            <div className="hidden sm:flex justify-between text-[10px] text-gray-600 mb-1 px-1">
              <span>← とても当てはまる</span>
              <span>全く当てはまらない →</span>
            </div>

            {/* ===== MOBILE: 縦並び5ボタン ===== */}
            <div className="flex sm:hidden flex-col gap-2.5">
              {likertOptions.map((option) => {
                const isSelected = currentAnswer?.value === option.value;
                const active = likertActiveStyle[option.value];
                return (
                  <motion.button
                    key={option.value}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option.value)}
                    className="w-full py-4 px-4 rounded-xl border text-left font-medium transition-all flex items-center gap-3"
                    style={
                      isSelected
                        ? {
                            background: active.bg,
                            borderColor: active.border,
                            color: active.text,
                            boxShadow: `0 0 16px ${active.border}30`,
                          }
                        : {
                            background: "rgba(255,255,255,0.03)",
                            borderColor: "rgba(255,255,255,0.07)",
                            color: "#9ca3af",
                          }
                    }
                  >
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                      style={
                        isSelected
                          ? { background: "rgba(255,255,255,0.15)", color: active.text }
                          : { background: "rgba(255,255,255,0.06)", color: "#6b7280" }
                      }
                    >
                      {option.value}
                    </span>
                    <span className="text-sm">{option.label}</span>
                    {isSelected && (
                      <span className="ml-auto text-xs font-bold" style={{ color: active.text }}>
                        ✓
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ===== NAVIGATION ===== */}
        <div className="flex items-center justify-between mt-5">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-5 py-2.5 rounded-xl border transition-all text-sm font-medium disabled:opacity-20 disabled:cursor-not-allowed"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: "rgba(255,255,255,0.08)",
              color: "#9ca3af",
            }}
          >
            ← 前へ
          </button>

          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={goToNextQuestion}
              className="px-5 py-2.5 rounded-xl border transition-all text-sm font-medium"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderColor: "rgba(255,255,255,0.08)",
                color: "#d1d5db",
              }}
            >
              次へ →
            </button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleFinish}
              className="px-7 py-3 btn-shimmer text-[#0d0d1a] font-black rounded-xl text-sm"
              style={{ boxShadow: "0 0 30px rgba(226,181,90,0.4)" }}
            >
              診断結果を見る →
            </motion.button>
          )}
        </div>

        {/* ===== QUESTION DOTS ===== */}
        <div className="flex justify-center gap-1 mt-6 flex-wrap max-w-sm mx-auto">
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
                className="rounded-full transition-all"
                style={{
                  width: isCurrent ? "20px" : "8px",
                  height: "8px",
                  background: isCurrent
                    ? "linear-gradient(90deg, #c49a3a, #e2b55a)"
                    : answered
                    ? "rgba(226,181,90,0.5)"
                    : "rgba(255,255,255,0.08)",
                  boxShadow: isCurrent ? "0 0 8px rgba(226,181,90,0.5)" : "none",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
