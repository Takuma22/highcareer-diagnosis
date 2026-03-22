"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useDiagnosisStore } from "@/store/diagnosisStore";

const LINE_URL = "https://lin.ee/XXXXXXXX";

export default function ResultPage() {
  const router = useRouter();
  const { result, userProfile, aiInsight, reset, answers, axisScore } = useDiagnosisStore();

  useEffect(() => {
    if (!result) {
      router.push("/");
    }
  }, [result, router]);

  if (!result || !userProfile) return null;

  const { radarScore, salaryProjection, consultingFit } = result;

  // レーダーチャートデータ
  const radarData = [
    { axis: "実行力",         score: radarScore.execution },
    { axis: "戦略思考",       score: radarScore.strategy },
    { axis: "対人力",         score: radarScore.interpersonal },
    { axis: "専門性",         score: radarScore.expertise },
    { axis: "リーダーシップ", score: radarScore.leadership },
    { axis: "適応力",         score: radarScore.adaptability },
  ];

  // 軸ごとの説明
  const axisDescriptions: Record<string, { label: string; detail: string }> = {
    execution:     { label: "実行力",         detail: "行動力・推進力・決断力。目標に向けてスピーディに動き、やり切る力。" },
    strategy:      { label: "戦略思考",       detail: "論理的思考・分析力・計画力。問題の本質を捉え、最適解を構造化する力。" },
    interpersonal: { label: "対人力",         detail: "コミュニケーション・交渉力・チームワーク。人を動かし、信頼を築く力。" },
    expertise:     { label: "専門性",         detail: "専門知識の深さ・学習意欲。特定領域での深い知識と継続的な成長力。" },
    leadership:    { label: "リーダーシップ", detail: "統率力・マネジメント・育成力。チームを束ね、組織全体の成果を最大化する力。" },
    adaptability:  { label: "適応力",         detail: "変化対応・ストレス耐性・柔軟性。不確実な環境でも冷静に最適行動をとる力。" },
  };

  const radarData = [
    { axis: "実行力", score: axisPercentage.execution },
    { axis: "戦略思考", score: axisPercentage.strategy },
    { axis: "対人力", score: axisPercentage.interpersonal },
    { axis: "専門性", score: axisPercentage.expertise },
    { axis: "リーダーシップ", score: axisPercentage.leadership },
    { axis: "適応力", score: axisPercentage.adaptability },
  ];

  const salaryChartData = [
    { year: "現在", 年収: salaryProjection.current },
    { year: "1年後", 年収: salaryProjection.year1 },
    { year: "3年後", 年収: salaryProjection.year3 },
    { year: "5年後", 年収: salaryProjection.year5 },
    { year: "最高値", 年収: salaryProjection.bestCase },
  ];

  const jumpRate = Math.round(
    ((salaryProjection.year3 - salaryProjection.current) / salaryProjection.current) * 100
  );
  const isLowFit = result.consultingFit < 65;
  const hasSalaryRisk = salaryProjection.year1 < salaryProjection.current;

  const totalAnswers = answers.length;
  const avgScore =
    totalAnswers > 0
      ? Math.round(
          (answers.reduce((sum, a) => sum + a.value, 0) / totalAnswers) * 10
        ) / 10
      : 0;
  const highCount = answers.filter((a) => a.value >= 4).length;
  const midCount = answers.filter((a) => a.value === 3).length;

  const axisLabels = [
    { key: "execution", label: "実行力", color: "#6366f1" },
    { key: "strategy", label: "戦略思考", color: "#3b82f6" },
    { key: "interpersonal", label: "対人力", color: "#10b981" },
    { key: "expertise", label: "専門性", color: "#f59e0b" },
    { key: "leadership", label: "リーダーシップ", color: "#ec4899" },
    { key: "adaptability", label: "適応力", color: "#8b5cf6" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] relative overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-10 space-y-6">

        {/* Type Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-2 mb-4">
            <span className="text-indigo-400 text-sm">診断結果</span>
          </div>
          <div className="text-5xl font-black gradient-text mb-2">{result.type}</div>
          <h1 className="text-2xl font-bold text-white mb-1">{result.title}</h1>
          <p className="text-gray-400 text-sm">{result.subtitle}</p>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass-card p-5"
        >
          <h2 className="text-base font-semibold text-white mb-2">タイプ概要</h2>
          <p className="text-gray-300 leading-relaxed text-sm">{result.description}</p>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-5"
        >
          <h2 className="text-base font-semibold text-white mb-4">6軸能力レーダーチャート</h2>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 500 }}
                />
                <Radar
                  name="スコア"
                  dataKey="score"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.35}
                  strokeWidth={2}
                  dot={{ fill: "#6366f1", r: 3 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,15,30,0.95)",
                    border: "1px solid rgba(99,102,241,0.4)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [`${value}点`, "スコア"]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* 軸スコア一覧 */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {(Object.entries(axisDescriptions) as [string, { label: string; detail: string }][]).map(
              ([key, { label }]) => {
                const score = radarScore[key as keyof typeof radarScore];
                const color =
                  score >= 70
                    ? "text-green-400"
                    : score >= 50
                    ? "text-indigo-400"
                    : score >= 35
                    ? "text-amber-400"
                    : "text-red-400";
                const barColor =
                  score >= 70
                    ? "bg-green-500"
                    : score >= 50
                    ? "bg-indigo-500"
                    : score >= 35
                    ? "bg-amber-500"
                    : "bg-red-500";
                return (
                  <div key={key} className="bg-white/5 rounded-lg p-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">{label}</span>
                      <span className={`text-sm font-bold ${color}`}>{score}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                        className={`h-1.5 rounded-full ${barColor}`}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </motion.div>

        {/* 軸ごとの意味解説 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5"
        >
          <h2 className="text-base font-semibold text-white mb-3">6軸の意味と解説</h2>
          <div className="space-y-2">
            {(Object.entries(axisDescriptions) as [string, { label: string; detail: string }][]).map(
              ([key, { label, detail }]) => {
                const score = radarScore[key as keyof typeof radarScore];
                const level =
                  score >= 70 ? "高い" : score >= 50 ? "平均的" : score >= 35 ? "低め" : "要強化";
                const levelColor =
                  score >= 70
                    ? "text-green-400"
                    : score >= 50
                    ? "text-indigo-400"
                    : score >= 35
                    ? "text-amber-400"
                    : "text-red-400";
                return (
                  <div key={key} className="flex gap-3 items-start py-1.5 border-b border-white/5 last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-medium text-white">{label}</span>
                        <span className={`text-xs font-bold ${levelColor}`}>{score}点 ({level})</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{detail}</p>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </motion.div>

        {/* 回答傾向サマリー */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="glass-card p-5"
        >
          <h2 className="text-base font-semibold text-white mb-3">回答傾向サマリー</h2>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-black text-indigo-300">{avgScore}</div>
              <div className="text-xs text-gray-500 mt-1">平均スコア<br />（5点満点）</div>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-black text-green-300">{highCount}</div>
              <div className="text-xs text-gray-500 mt-1">強く同意<br />（4〜5点）</div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-black text-amber-300">{midCount}</div>
              <div className="text-xs text-gray-500 mt-1">どちらでもない<br />（3点）</div>
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            {totalAnswers}問に回答。
            {highCount > totalAnswers * 0.5
              ? "多くの質問に強く同意しており、自己認識が明確なタイプです。"
              : midCount > totalAnswers * 0.4
              ? "中間的な回答が多く、バランス型・柔軟な思考を持つタイプです。"
              : "様々な方向に回答が分散しており、複数の側面を持つ複合型タイプです。"}
          </p>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5"
        >
          <h2 className="text-base font-semibold text-white mb-4">6軸能力レーダーチャート</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 500 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  tickCount={6}
                />
                <Radar
                  name="スコア"
                  dataKey="score"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.25}
                  strokeWidth={2}
                  dot={{ fill: "#6366f1", r: 4, strokeWidth: 0 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,15,30,0.95)",
                    border: "1px solid rgba(99,102,241,0.4)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(value: number) => [`${value}点`, "スコア"]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* 6軸スコア一覧 */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {axisLabels.map(({ key, label, color }) => {
              const score = axisPercentage[key as keyof typeof axisPercentage];
              return (
                <div key={key} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="text-xs text-gray-400 flex-1">{label}</span>
                  <span className="text-sm font-bold text-white">{score}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Detailed Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-5"
        >
          <h2 className="text-base font-semibold text-white mb-3">詳細な性格分析</h2>
          <div className="text-gray-300 text-sm leading-relaxed space-y-3">
            {result.detailedAnalysis.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </motion.div>

        {/* Consulting Fit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.27 }}
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
                  stroke="url(#fitGrad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                  animate={{
                    strokeDashoffset: 2 * Math.PI * 40 * (1 - result.consultingFit / 100),
                  }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                />
                <defs>
                  <linearGradient id="fitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black gradient-text">{result.consultingFit}%</span>
              </div>
            </div>
            <div>
              <p className="text-gray-300 text-sm leading-relaxed">
                コンサルタントとしての総合適性スコアです。<br />
                <span className="text-indigo-400 font-medium">{consultingFit}%</span>は
                {consultingFit >= 80 ? "非常に高い" : consultingFit >= 65 ? "高い" : consultingFit >= 50 ? "中程度の" : "現時点では低い"}
                フィット度です。
              </p>
            </div>
          </div>
        </motion.div>

        {/* Low-fit 警告 */}
        {isLowFit && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.29 }}
            className="glass-card p-5 border border-amber-500/30"
          >
            <h2 className="text-base font-semibold text-amber-400 mb-3">フェアな評価・転職リスク</h2>
            <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                <p className="font-medium text-amber-300 mb-1">現時点ではコンサル転職は慎重に検討すべきです</p>
                <p>コンサル適性スコアが{consultingFit}%のため、即転職すると年収が下がる可能性があります。転職エージェントの「転職を勧める」トークは収益目的であることが多く、あなたの利益とは必ずしも一致しません。</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="font-medium text-white mb-1">現職に留まる選択肢も真剣に検討を</p>
                <p>現職でのスキルアップ・年収交渉・社内異動の方が、リスクを抑えてキャリアを高められる可能性があります。6〜12ヶ月かけてスキルを積み上げてから再診断することを推奨します。</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="font-medium text-white mb-1">転職を選ぶなら最低限やること</p>
                <ul className="space-y-1 text-xs text-gray-400 mt-1">
                  <li>• 低いスコアの軸を3ヶ月集中して強化する</li>
                  <li>• 複数エージェントで実際に書類を通過できるか確認する</li>
                  <li>• 転職後の最初の1年は年収が下がることを前提に生活設計を立てる</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Salary Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5"
        >
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-base font-semibold text-white">
              {hasSalaryRisk ? "転職後の年収シミュレーション" : "年収ジャンプアップ予測"}
            </h2>
            <div className="text-right">
              <div className={`text-2xl font-black ${jumpRate >= 0 ? "text-green-400" : "text-amber-400"}`}>
                {jumpRate >= 0 ? "+" : ""}{jumpRate}%
              </div>
              <div className="text-xs text-gray-500">3年後目安</div>
            </div>
          </div>
          {hasSalaryRisk && (
            <div className="mb-3 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 text-xs text-amber-300 leading-relaxed">
              コンサル適性スコアが低いため、転職直後は一時的な年収低下が見込まれます。現職に留まりながらスキルを積んでから転職するのが現実的です。
            </div>
          )}
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
                <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}万`} />
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
                <div className={`text-xl font-bold ${item.color}`}>{item.value.toLocaleString()}万円</div>
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
          <h2 className="text-base font-semibold text-white mb-4">おすすめポジション</h2>
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
            <h3 className="text-sm font-semibold text-amber-400 mb-3">課題・改善点</h3>
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
          <p className="text-gray-300 text-sm leading-relaxed mb-4">{result.consultingAdvice.overview}</p>
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
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <div className="text-xs text-green-400 font-medium mb-1">まず取るべきアクション</div>
              <p className="text-xs text-gray-300 leading-relaxed">{result.consultingAdvice.firstStep}</p>
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
              <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center text-xs font-bold">AI</div>
              <h2 className="text-base font-semibold text-white">AIパーソナル分析</h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{aiInsight}</p>
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
          <p className="text-gray-300 text-sm mb-4">{result.lineCtaMessage}</p>
          <div className="space-y-2 mb-4 text-left">
            {["コンサル転職攻略ガイド（非公開）", "ケース面接テンプレート集", "年収交渉スクリプト", "あなたの診断タイプに合った求人情報"].map(
              (b, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-green-400">✓</span>
                  {b}
                </div>
              )
            )}
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
            className="text-gray-500 hover:text-gray-300 text-sm underline transition"
          >
            もう一度診断する
          </button>
        </div>
      </div>
    </div>
  );
}
