"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDiagnosisStore } from "@/store/diagnosisStore";

const LINE_URL = "https://lin.ee/XXXXXXXX";

function AxisBar({
  label,
  oppositeLabel,
  percent,
  color,
  explanation,
}: {
  label: string;
  oppositeLabel: string;
  percent: number;
  color: string;
  explanation: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span className="font-medium">{label}</span>
        <span className="font-medium">{oppositeLabel}</span>
      </div>
      <div className="w-full bg-white/5 rounded-full h-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-3 rounded-full ${color}`}
        />
      </div>
      <div className="flex justify-between text-xs mt-1 mb-2">
        <span className="text-white font-bold">{percent}%</span>
        <span className="text-gray-500">{100 - percent}%</span>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">{explanation}</p>
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const { result, userProfile, aiInsight, reset, answers } = useDiagnosisStore();

  useEffect(() => {
    if (!result) {
      router.push("/");
    }
  }, [result, router]);

  if (!result || !userProfile) return null;

  const { axisPercentage, salaryProjection } = result;

  const salaryChartData = [
    { year: "現在", 年収: salaryProjection.current },
    { year: "1年後", 年収: salaryProjection.year1 },
    { year: "3年後", 年収: salaryProjection.year3 },
    { year: "5年後", 年収: salaryProjection.year5 },
    { year: "最高値", 年収: salaryProjection.bestCase },
  ];

  const jumpRate = Math.round(
    ((salaryProjection.year3 - salaryProjection.current) /
      salaryProjection.current) *
      100
  );

  // 回答傾向サマリー
  const totalAnswers = answers.length;
  const avgScore = totalAnswers > 0
    ? Math.round((answers.reduce((sum, a) => sum + a.value, 0) / totalAnswers) * 10) / 10
    : 0;
  const highCount = answers.filter((a) => a.value >= 4).length;
  const lowCount = answers.filter((a) => a.value <= 2).length;
  const midCount = answers.filter((a) => a.value === 3).length;

  return (
    <div className="min-h-screen bg-[#0a0a1a] relative overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-10 space-y-6">
        {/* Type Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-2 mb-3">
            <span className="text-indigo-400 text-sm">診断結果</span>
          </div>
          <div className="text-6xl font-black gradient-text mb-2">{result.type}</div>
          <h1 className="text-2xl font-bold text-white mb-1">{result.title}</h1>
          <p className="text-gray-400 text-sm">{result.subtitle}</p>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5"
        >
          <h2 className="text-base font-semibold text-white mb-2">タイプ概要</h2>
          <p className="text-gray-300 leading-relaxed text-sm">{result.description}</p>
        </motion.div>

        {/* 回答傾向サマリー */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-5"
        >
          <h2 className="text-base font-semibold text-white mb-3">回答傾向サマリー</h2>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-black text-indigo-300">{avgScore}</div>
              <div className="text-xs text-gray-500 mt-1">平均スコア<br/>（5点満点）</div>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-black text-green-300">{highCount}</div>
              <div className="text-xs text-gray-500 mt-1">強く同意<br/>（4〜5点）</div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-black text-amber-300">{midCount}</div>
              <div className="text-xs text-gray-500 mt-1">どちらでもない<br/>（3点）</div>
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            {totalAnswers}問に回答。{highCount > totalAnswers * 0.5
              ? "多くの質問に強く同意しており、自己認識が明確なタイプです。"
              : midCount > totalAnswers * 0.4
              ? "中間的な回答が多く、バランス型・柔軟な思考を持つタイプです。"
              : "様々な方向に回答が分散しており、複数の側面を持つ複合型タイプです。"
            }
          </p>
        </motion.div>

        {/* Axis Bars + Explanations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5"
        >
          <h2 className="text-base font-semibold text-white mb-4">4軸スコアと意味解説</h2>
          <AxisBar
            label="戦略思考 (S)"
            oppositeLabel="実行力 (E)"
            percent={axisPercentage.s_percent}
            color="bg-indigo-500"
            explanation={result.axisExplanations.axis1}
          />
          <AxisBar
            label="データ思考 (D)"
            oppositeLabel="関係構築 (R)"
            percent={axisPercentage.d_percent}
            color="bg-blue-500"
            explanation={result.axisExplanations.axis2}
          />
          <AxisBar
            label="リーダーシップ (L)"
            oppositeLabel="専門追求 (X)"
            percent={axisPercentage.l_percent}
            color="bg-purple-500"
            explanation={result.axisExplanations.axis3}
          />
          <AxisBar
            label="野心・向上心 (A)"
            oppositeLabel="安定志向 (B)"
            percent={axisPercentage.a_percent}
            color="bg-amber-500"
            explanation={result.axisExplanations.axis4}
          />
        </motion.div>

        {/* Detailed Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="glass-card p-5"
        >
          <h2 className="text-base font-semibold text-white mb-3">詳細な性格分析</h2>
          <div className="text-gray-300 text-sm leading-relaxed space-y-3">
            {result.detailedAnalysis.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </motion.div>

        {/* Consulting Fit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-5"
        >
          <h2 className="text-base font-semibold text-white mb-3">コンサルフィット度</h2>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#grad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                  animate={{
                    strokeDashoffset:
                      2 * Math.PI * 40 * (1 - result.consultingFit / 100),
                  }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black gradient-text">
                  {result.consultingFit}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-gray-300 text-sm leading-relaxed">
                コンサルタントとしての適性スコアです。<br />
                <span className="text-indigo-400 font-medium">{result.consultingFit}%</span>は
                {result.consultingFit >= 85
                  ? "非常に高い"
                  : result.consultingFit >= 70
                  ? "高い"
                  : result.consultingFit >= 60
                  ? "中程度の"
                  : "基礎的な"}
                フィット度です。
              </p>
            </div>
          </div>
        </motion.div>

        {/* Salary Projection Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5"
        >
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-base font-semibold text-white">年収ジャンプアップ予測</h2>
            <div className="text-right">
              <div className="text-2xl font-black text-green-400">+{jumpRate}%</div>
              <div className="text-xs text-gray-500">3年後目安</div>
            </div>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salaryChartData}>
                <defs>
                  <linearGradient id="salaryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" stroke="#6b7280" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#6b7280"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}万`}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,15,30,0.9)",
                    border: "1px solid rgba(99,102,241,0.3)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(value) => [`${value}万円`, "年収"]}
                />
                <Area
                  type="monotone"
                  dataKey="年収"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#salaryGrad)"
                  dot={{ fill: "#6366f1", r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[
              { label: "現在", value: salaryProjection.current, color: "text-gray-400" },
              { label: "3年後", value: salaryProjection.year3, color: "text-indigo-400" },
              { label: "5年後", value: salaryProjection.year5, color: "text-purple-400" },
              { label: "最高値", value: salaryProjection.bestCase, color: "text-amber-400" },
            ].map((item) => (
              <div key={item.label} className="bg-white/5 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                <div className={`text-xl font-bold ${item.color}`}>
                  {item.value.toLocaleString()}万円
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recommended Roles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-5"
        >
          <h2 className="text-base font-semibold text-white mb-4">おすすめポジション（理由付き）</h2>
          <div className="space-y-4">
            {result.recommendedRoles.map((role, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-start gap-3 mb-2">
                  <div className="flex-shrink-0 w-10 h-10 gradient-bg rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    #{i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-semibold text-white text-sm">{role.title}</span>
                      <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                        フィット {role.fitScore}%
                      </span>
                    </div>
                    <div className="text-xs text-indigo-400 font-medium mb-1">{role.firm}</div>
                    <div className="text-xs text-gray-400">{role.description}</div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 mt-2 border-l-2 border-indigo-500/50">
                  <div className="text-xs text-indigo-400 font-medium mb-1">推薦理由</div>
                  <p className="text-xs text-gray-300 leading-relaxed">{role.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Strengths & Challenges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-green-400 mb-3">強み</h3>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                  <span className="text-green-400 mt-0.5">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-amber-400 mb-3">課題・伸びしろ</h3>
            <ul className="space-y-2">
              {result.challenges.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                  <span className="text-amber-400 mt-0.5">△</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Consulting Advice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-card p-5"
        >
          <h2 className="text-base font-semibold text-white mb-3">キャリアチェンジアドバイス</h2>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-400 bg-white/5 rounded-full px-3 py-1 border border-white/10">
              目安期間: {result.consultingAdvice.timeline}
            </span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            {result.consultingAdvice.overview}
          </p>
          <div className="space-y-3">
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
              <div className="text-xs text-indigo-400 font-medium mb-2">今すぐ活かすべき強み</div>
              <ul className="space-y-1">
                {result.consultingAdvice.strengthsToLeverage.map((s, i) => (
                  <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                    <span className="text-indigo-400 mt-0.5">•</span>{s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
              <div className="text-xs text-purple-400 font-medium mb-2">優先的に習得すべきスキル</div>
              <ul className="space-y-1">
                {result.consultingAdvice.skillsToAcquire.map((s, i) => (
                  <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">•</span>{s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-start gap-3">
              <div>
                <div className="text-xs text-green-400 font-medium mb-1">まず取るべきアクション</div>
                <p className="text-xs text-gray-300 leading-relaxed">{result.consultingAdvice.firstStep}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Insight */}
        {aiInsight && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-5 border border-indigo-500/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center text-xs font-bold">
                AI
              </div>
              <h2 className="text-base font-semibold text-white">AIパーソナル分析</h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {aiInsight}
            </p>
          </motion.div>
        )}

        {/* LINE CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="glass-card p-6 border border-green-500/30 text-center pulse-glow"
        >
          <div className="text-4xl mb-3">🎁</div>
          <h2 className="text-xl font-bold text-white mb-2">LINE限定特典</h2>
          <p className="text-gray-300 text-sm mb-4">
            {result.lineCtaMessage}
          </p>
          <div className="space-y-2 mb-4 text-left">
            {[
              "コンサル転職攻略ガイド（非公開）",
              "ケース面接テンプレート集",
              "年収交渉スクリプト",
              "あなたの診断タイプに合った求人情報",
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-green-400">✓</span>
                {benefit}
              </div>
            ))}
          </div>
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-[#06C755] hover:bg-[#05a847] text-white font-bold py-4 rounded-xl text-lg transition text-center"
          >
            LINEで特典を受け取る →
          </a>
          <p className="text-xs text-gray-600 mt-2">登録無料・いつでもブロック可能</p>
        </motion.div>

        {/* Retry */}
        <div className="text-center">
          <button
            onClick={() => {
              reset();
              router.push("/");
            }}
            className="text-gray-500 text-sm hover:text-gray-300 transition"
          >
            もう一度診断する
          </button>
        </div>
      </div>
    </div>
  );
}
