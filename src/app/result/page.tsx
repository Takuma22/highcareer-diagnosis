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

const CONSULTATION_URL = "https://line.me/";

const TYPE_IMAGES: Record<string, string> = {
  指揮官: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  参謀: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
  外交官: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80",
  スペシャリスト: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
  オールラウンダー: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  チャレンジャー: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800&q=80",
  アナリスト: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  準備中: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
};

const CHANNEL_ICON_URL =
  "https://yt3.googleusercontent.com/ZzKmYL74N-z6H8GhojpkeqbjuqNoePEEvlEtIjshnN3CVNhF8lT-RZCaba0moqt5A4Hkpfat=s176-c-k-c0x00ffffff-no-rj";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export default function ResultPage() {
  const router = useRouter();
  const { result, userProfile, aiInsight, reset, answers, axisScore } = useDiagnosisStore();

  useEffect(() => {
    if (!result) {
      router.push("/");
    }
  }, [result, router]);

  if (!result || !userProfile) return null;

  const { axisPercentage, salaryProjection } = result;

  const radarData = [
    { axis: "実行力", score: axisPercentage.execution, avg: 50 },
    { axis: "戦略思考", score: axisPercentage.strategy, avg: 50 },
    { axis: "対人力", score: axisPercentage.interpersonal, avg: 50 },
    { axis: "専門性", score: axisPercentage.expertise, avg: 50 },
    { axis: "リーダーシップ", score: axisPercentage.leadership, avg: 50 },
    { axis: "適応力", score: axisPercentage.adaptability, avg: 50 },
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
  const hasSalaryDecline = salaryProjection.year3 < salaryProjection.current;

  const totalAnswers = answers.length;
  const avgScore =
    totalAnswers > 0
      ? Math.round((answers.reduce((sum, a) => sum + a.value, 0) / totalAnswers) * 10) / 10
      : 0;
  const highCount = answers.filter((a) => a.value >= 4).length;
  const midCount = answers.filter((a) => a.value === 3).length;

  const axisLabels = [
    { key: "execution", label: "実行力", color: "#e2b55a" },
    { key: "strategy", label: "戦略思考", color: "#4a7fdb" },
    { key: "interpersonal", label: "対人力", color: "#10b981" },
    { key: "expertise", label: "専門性", color: "#a855f7" },
    { key: "leadership", label: "リーダーシップ", color: "#ec4899" },
    { key: "adaptability", label: "適応力", color: "#f97316" },
  ];

  return (
    <div className="min-h-screen bg-[#090b1a] relative overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#e2b55a]/6 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto px-4 py-10 space-y-5">

        {/* ===== TYPE BADGE (Hero) ===== */}
        <motion.div {...fadeUp(0)} className="relative -mx-4 overflow-hidden rounded-none" style={{ minHeight: "300px" }}>
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${TYPE_IMAGES[result.type] ?? TYPE_IMAGES["オールラウンダー"]})` }}
          />
          {/* Dark overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(9,11,26,0.45) 0%, rgba(9,11,26,0.82) 100%)" }}
          />
          {/* Content */}
          <div className="relative z-10 text-center px-4 pt-12 pb-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold tracking-widest"
              style={{
                background: "rgba(226,181,90,0.15)",
                border: "1px solid rgba(226,181,90,0.4)",
                color: "#e2b55a",
                backdropFilter: "blur(4px)",
              }}
            >
              ✦ 診断結果
            </div>

            {/* Type name */}
            <div
              className="inline-block px-8 py-3 rounded-2xl mb-4"
              style={{
                background: "linear-gradient(135deg, rgba(226,181,90,0.2), rgba(226,181,90,0.08))",
                border: "1.5px solid rgba(226,181,90,0.5)",
                boxShadow: "0 0 40px rgba(226,181,90,0.25)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="text-5xl sm:text-6xl font-black gradient-text mb-1 leading-tight">
                {result.type}
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white mb-2">{result.title}</h1>
            <p className="text-gray-300 text-sm">{result.subtitle}</p>
          </div>
        </motion.div>

        {/* ===== DESCRIPTION ===== */}
        <motion.div {...fadeUp(0.1)} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="gold-divider" />
            <h2 className="text-sm font-bold text-white">タイプ概要</h2>
          </div>
          <p className="text-gray-300 leading-relaxed text-sm">{result.description}</p>
        </motion.div>

        {/* ===== 回答傾向サマリー ===== */}
        <motion.div {...fadeUp(0.15)} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="gold-divider" />
            <h2 className="text-sm font-bold text-white">回答傾向サマリー</h2>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div
              className="rounded-xl p-4 text-center"
              style={{ background: "rgba(226,181,90,0.08)", border: "1px solid rgba(226,181,90,0.2)" }}
            >
              <div className="text-3xl font-black gradient-text">{avgScore}</div>
              <div className="text-[10px] text-gray-500 mt-1">平均スコア<br />（5点満点）</div>
            </div>
            <div
              className="rounded-xl p-4 text-center"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}
            >
              <div className="text-3xl font-black text-emerald-400">{highCount}</div>
              <div className="text-[10px] text-gray-500 mt-1">強く同意<br />（4〜5点）</div>
            </div>
            <div
              className="rounded-xl p-4 text-center"
              style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)" }}
            >
              <div className="text-3xl font-black text-purple-400">{midCount}</div>
              <div className="text-[10px] text-gray-500 mt-1">どちらでもない<br />（3点）</div>
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

        {/* ===== RADAR CHART ===== */}
        <motion.div {...fadeUp(0.2)} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="gold-divider" />
            <h2 className="text-sm font-bold text-white">6軸能力レーダーチャート</h2>
          </div>
          <p className="text-xs text-gray-500 mb-4 ml-10">ハイキャリア層平均（偏差値50）との比較</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="rgba(255,255,255,0.07)" />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 500 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[30, 70]}
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  tickCount={5}
                  tickFormatter={(v) => `${v}`}
                />
                <Radar
                  name="ハイキャリア平均"
                  dataKey="avg"
                  stroke="rgba(255,255,255,0.25)"
                  fill="rgba(255,255,255,0.02)"
                  strokeWidth={1.5}
                  strokeDasharray="5 3"
                  dot={false}
                />
                <Radar
                  name="あなたのスコア"
                  dataKey="score"
                  stroke="#e2b55a"
                  fill="#e2b55a"
                  fillOpacity={0.18}
                  strokeWidth={2.5}
                  dot={{ fill: "#e2b55a", r: 4, strokeWidth: 0 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,11,26,0.97)",
                    border: "1px solid rgba(226,181,90,0.3)",
                    borderRadius: "10px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(value, name) => [
                    name === "ハイキャリア平均" ? "偏差値50（平均）" : `偏差値${value}`,
                    name,
                  ]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-1 mb-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-4 h-0.5" style={{ background: "#e2b55a" }} />
              あなた
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block w-4 h-0"
                style={{ borderTop: "1.5px dashed rgba(255,255,255,0.3)" }}
              />
              ハイキャリア平均
            </span>
          </div>

          {/* 6軸スコア一覧 */}
          <div className="grid grid-cols-2 gap-2">
            {axisLabels.map(({ key, label, color }) => {
              const score = axisPercentage[key as keyof typeof axisPercentage];
              const isAbove = score >= 50;
              return (
                <div
                  key={key}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="text-xs text-gray-400 flex-1">{label}</span>
                  <div className="text-right">
                    <span className="text-sm font-black text-white">偏差値{score}</span>
                    <span
                      className={`block text-[10px] leading-none mt-0.5 font-medium ${
                        isAbove ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {isAbove ? "平均以上" : "改善余地"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ===== DETAILED ANALYSIS ===== */}
        <motion.div {...fadeUp(0.22)} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="gold-divider" />
            <h2 className="text-sm font-bold text-white">詳細な性格分析</h2>
          </div>
          <div className="text-gray-300 text-sm leading-relaxed space-y-3">
            {result.detailedAnalysis.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </motion.div>

        {/* ===== CONSULTING FIT ===== */}
        <motion.div {...fadeUp(0.25)} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="gold-divider" />
            <h2 className="text-sm font-bold text-white">コンサルフィット度</h2>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="10"
                />
                <motion.circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="url(#goldGrad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                  animate={{
                    strokeDashoffset: 2 * Math.PI * 40 * (1 - result.consultingFit / 100),
                  }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                />
                <defs>
                  <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c49a3a" />
                    <stop offset="100%" stopColor="#f0c97a" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black gradient-text">{result.consultingFit}%</span>
              </div>
            </div>
            <div>
              <p className="text-gray-300 text-sm leading-relaxed">
                コンサルタントとしての適性スコアです。<br />
                <span className="font-bold" style={{ color: "#e2b55a" }}>
                  {result.consultingFit}%
                </span>
                は
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

        {/* ===== LOW-FIT WARNING ===== */}
        {isLowFit && (
          <motion.div
            {...fadeUp(0.28)}
            className="glass-card p-5"
            style={{ borderColor: "rgba(251,191,36,0.3)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-6 rounded-full" style={{ background: "#f59e0b" }} />
              <h2 className="text-sm font-bold text-amber-400">フェアな評価・転職リスク</h2>
            </div>
            <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
              <div
                className="rounded-xl p-3.5"
                style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}
              >
                <p className="font-bold text-amber-300 mb-1">現時点ではコンサル転職は慎重に検討すべきです</p>
                <p className="text-sm text-gray-400">コンサル適性スコアが{result.consultingFit}%のため、即転職すると年収が下がる可能性があります。</p>
              </div>
              <div
                className="rounded-xl p-3.5"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="font-bold text-white mb-1">現職に留まる選択肢も真剣に検討を</p>
                <p className="text-sm text-gray-400">現職でのスキルアップ・年収交渉の方が、リスクを抑えてキャリアを高められる可能性があります。</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== SALARY PROJECTION ===== */}
        <motion.div {...fadeUp(0.3)} className="glass-card p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="gold-divider" />
                <h2 className="text-sm font-bold text-white">
                  {hasSalaryDecline ? "⚠️ 年収ダウンのリスクあり" : hasSalaryRisk ? "転職後の年収シミュレーション" : "年収ジャンプアップ予測"}
                </h2>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div
                className={`text-4xl font-black leading-none ${
                  jumpRate >= 0 ? "gradient-text" : hasSalaryDecline ? "text-red-400" : "text-amber-400"
                }`}
              >
                {jumpRate >= 0 ? "+" : ""}{jumpRate}%
              </div>
              <div className="text-[10px] text-gray-500 mt-1">3年後目安</div>
            </div>
          </div>

          {hasSalaryDecline ? (
            <div
              className="mb-4 rounded-xl px-4 py-3 text-xs leading-relaxed"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171",
              }}
            >
              <span className="font-bold">現在の年収を下回る可能性があります。</span>コンサル適性スコアが低く、即転職すると年収ダウンのリスクがあります。現職でのスキルアップを優先することを強くお勧めします。
            </div>
          ) : hasSalaryRisk && (
            <div
              className="mb-4 rounded-xl px-4 py-3 text-xs leading-relaxed"
              style={{
                background: "rgba(251,191,36,0.08)",
                border: "1px solid rgba(251,191,36,0.25)",
                color: "#fbbf24",
              }}
            >
              コンサル適性スコアが低いため、転職直後は一時的な年収低下が見込まれます。
            </div>
          )}

          {/* Salary numbers (big) */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: "現在", value: salaryProjection.current, color: "#9ca3af", isMain: false },
              { label: "3年後", value: salaryProjection.year3, color: hasSalaryDecline ? "#f87171" : "#e2b55a", isMain: true },
              { label: "5年後", value: salaryProjection.year5, color: salaryProjection.year5 < salaryProjection.current ? "#fca5a5" : "#f0c97a", isMain: false },
              { label: "最高値", value: salaryProjection.bestCase, color: salaryProjection.bestCase < salaryProjection.current ? "#fca5a5" : "#f5d78a", isMain: false },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-4"
                style={
                  item.isMain
                    ? hasSalaryDecline
                      ? {
                          background: "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.04))",
                          border: "1.5px solid rgba(239,68,68,0.3)",
                          boxShadow: "0 0 20px rgba(239,68,68,0.08)",
                        }
                      : {
                          background: "linear-gradient(135deg, rgba(226,181,90,0.15), rgba(226,181,90,0.05))",
                          border: "1.5px solid rgba(226,181,90,0.35)",
                          boxShadow: "0 0 20px rgba(226,181,90,0.1)",
                        }
                    : {
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }
                }
              >
                <div className="text-xs text-gray-500 mb-1.5">{item.label}</div>
                <div
                  className={`font-black leading-none`}
                  style={{
                    color: item.color,
                    fontSize: item.isMain ? "1.75rem" : "1.4rem",
                  }}
                >
                  {item.value.toLocaleString()}
                  <span className="text-sm font-medium ml-0.5">万円</span>
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salaryChartData}>
                <defs>
                  <linearGradient id="salaryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e2b55a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#e2b55a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="year" stroke="#6b7280" tick={{ fontSize: 11, fill: "#6b7280" }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 11, fill: "#6b7280" }} tickFormatter={(v) => `${v}万`} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(9,11,26,0.97)",
                    border: "1px solid rgba(226,181,90,0.3)",
                    borderRadius: "10px",
                    color: "#fff",
                  }}
                  formatter={(value) => [`${value}万円`, "年収"]}
                />
                <Area
                  type="monotone"
                  dataKey="年収"
                  stroke="#e2b55a"
                  strokeWidth={2.5}
                  fill="url(#salaryGrad)"
                  dot={{ fill: "#e2b55a", r: 4, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-gray-600 mt-3 leading-relaxed">
            ※JACリクルートメント、OpenWork、各社採用ページ等の公開データに基づく推計値です
          </p>
        </motion.div>

        {/* ===== RECOMMENDED ROLES ===== */}
        <motion.div {...fadeUp(0.35)} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="gold-divider" />
            <h2 className="text-sm font-bold text-white">おすすめポジション</h2>
          </div>
          <div className="space-y-4">
            {result.recommendedRoles.map((role, i) => (
              <div
                key={i}
                className="rounded-xl p-4"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm"
                    style={{
                      background: "linear-gradient(135deg, #b8872e, #e2b55a)",
                      color: "#0d0d1a",
                    }}
                  >
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-bold text-white text-sm">{role.title}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: "rgba(226,181,90,0.12)",
                          color: "#e2b55a",
                          border: "1px solid rgba(226,181,90,0.3)",
                        }}
                      >
                        フィット {role.fitScore}%
                      </span>
                    </div>
                    <div className="text-xs font-medium mb-1" style={{ color: "#e2b55a" }}>
                      {role.firm}
                    </div>
                    <div className="text-xs text-gray-400">{role.description}</div>
                  </div>
                </div>
                <div
                  className="rounded-lg p-3 border-l-2"
                  style={{
                    background: "rgba(226,181,90,0.05)",
                    borderLeftColor: "#e2b55a",
                  }}
                >
                  <div className="text-xs font-bold mb-1" style={{ color: "#e2b55a" }}>
                    推薦理由
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{role.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ===== STRENGTHS & CHALLENGES ===== */}
        <motion.div {...fadeUp(0.4)} className="grid grid-cols-2 gap-4">
          <div className="glass-card p-4">
            <h3
              className="text-sm font-bold mb-3 flex items-center gap-2"
              style={{ color: "#34d399" }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                style={{ background: "rgba(52,211,153,0.2)" }}
              >
                ✓
              </span>
              強み
            </h3>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                  <span className="mt-0.5 flex-shrink-0" style={{ color: "#34d399" }}>•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-card p-4">
            <h3
              className="text-sm font-bold mb-3 flex items-center gap-2"
              style={{ color: "#e2b55a" }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                style={{ background: "rgba(226,181,90,0.2)" }}
              >
                △
              </span>
              課題・伸びしろ
            </h3>
            <ul className="space-y-2">
              {result.challenges.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                  <span className="mt-0.5 flex-shrink-0" style={{ color: "#e2b55a" }}>•</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* ===== CTA - CONSULTATION ===== */}
        {(() => {
          const consultationTexts: Record<string, string> = {
            指揮官:
              "あなたのリーダーシップと実行力は、転職市場が最も求める組み合わせです。ケントのハイキャリア転職支援チームとの無料面談で、あなたの実績を最大限に評価してくれるポジションを一緒に見つけましょう。年収30〜50%アップが射程内のあなたの転職戦略を、具体的にご提案します。",
            参謀:
              "あなたの戦略思考力と専門性は、転職市場が最も欲しがるプロフィールです。ケントのハイキャリア転職支援チームが、最適なキャリアパスへの選考突破から年収交渉まで一貫してサポートします。あなただけの転職ロードマップを、無料面談でお伝えします。",
            外交官:
              "あなたの対人力と適応力は、顧客向けコンサルやHRBP・BizDevポジションで最大限に発揮されます。ケントのハイキャリア転職支援チームとの無料面談で、あなたの強みを活かせる具体的なキャリアパスと年収アップの戦略を一緒に設計しましょう。",
            スペシャリスト:
              "あなたの専門性は、転職市場で希少価値の高い武器です。ケントのハイキャリア転職支援チームが、その専門性を正しく評価してくれる企業・ファームを厳選してご紹介します。無料面談で、専門性を最高年収に変換する戦略をお伝えします。",
            オールラウンダー:
              "6軸全方位で高いスコアを誇るあなたは、コンサルや事業会社の経営企画・BizDevで即戦力として評価されます。ケントのハイキャリア転職支援チームとの無料面談で、あなたの多面的な強みを活かせる最適なキャリアプランを設計しましょう。",
            チャレンジャー:
              "あなたの行動力と適応力は、変化の激しいスタートアップや新規事業立ち上げのポジションで最大の価値を発揮します。ケントのハイキャリア転職支援チームとの無料面談で、あなたのチャレンジ精神を年収に変える転職戦略をご提案します。",
            アナリスト:
              "あなたの戦略思考力は、転職市場で最も求められるスキルです。ケントのハイキャリア転職支援チームが、その分析力を最大限に評価してくれる企業・ファームをご紹介します。無料面談で、論理思考力を武器にした転職戦略をお伝えします。",
            準備中:
              "今すぐ転職するより、正しい準備が将来の年収を大きく変えます。ケントのハイキャリア転職支援チームとの無料面談では、あなたの現状を正直に評価した上で、6〜12ヶ月後の転職成功に向けた具体的なロードマップをお伝えします。",
          };
          const text = consultationTexts[result.type] ?? consultationTexts["オールラウンダー"];
          return (
            <motion.div
              {...fadeUp(0.45)}
              className="glass-card-gold p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="gold-divider" />
                <h2 className="text-sm font-bold text-white">次のキャリアステップへ</h2>
              </div>
              {/* Channel identity */}
              <div className="flex items-center gap-3 mb-5">
                <img
                  src={CHANNEL_ICON_URL}
                  alt="ケント | 現役コンサルの本音"
                  className="w-16 h-16 rounded-full flex-shrink-0 object-cover"
                  style={{ border: "2px solid rgba(226,181,90,0.5)" }}
                />
                <div>
                  <div className="text-white font-bold text-sm">ケント</div>
                  <div className="text-gray-400 text-xs">現役コンサルの本音</div>
                  <div
                    className="text-[10px] mt-0.5 px-2 py-0.5 rounded-full inline-block"
                    style={{ background: "rgba(226,181,90,0.1)", color: "#e2b55a", border: "1px solid rgba(226,181,90,0.25)" }}
                  >
                    現役コンサルタント
                  </div>
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-5">{text}</p>
              <motion.a
                href={CONSULTATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full btn-shimmer text-[#0d0d1a] font-black py-4 rounded-xl text-base text-center"
                style={{ boxShadow: "0 0 40px rgba(226,181,90,0.4), 0 4px 20px rgba(226,181,90,0.2)" }}
              >
                無料面談を予約する →
              </motion.a>
            </motion.div>
          );
        })()}

        {/* ===== AI INSIGHT ===== */}
        {aiInsight && (
          <motion.div
            {...fadeUp(0.5)}
            className="glass-card p-5"
            style={{ borderColor: "rgba(226,181,90,0.2)" }}
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                style={{ background: "linear-gradient(135deg, #b8872e, #e2b55a)", color: "#0d0d1a" }}
              >
                AI
              </div>
              <h2 className="text-sm font-bold text-white">AIパーソナル分析</h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {aiInsight}
            </p>
          </motion.div>
        )}

        {/* ===== SHARE ===== */}
        <motion.div {...fadeUp(0.55)} className="space-y-3">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              `ハイキャリア転職力診断で「${result.type}」タイプと診断されました！\n\nあなたも診断してみてください👇`
            )}&url=${encodeURIComponent("https://highcareer-diagnosis.vercel.app")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 rounded-xl text-sm text-center font-medium transition-all hover:border-white/20 hover:text-white"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#9ca3af",
            }}
          >
            結果をXでシェアする
          </a>
        </motion.div>

        {/* ===== RETRY ===== */}
        <div className="text-center pb-4">
          <button
            onClick={() => {
              reset();
              router.push("/");
            }}
            className="text-gray-600 text-sm hover:text-gray-400 transition"
          >
            もう一度診断する
          </button>
        </div>
      </div>
    </div>
  );
}
