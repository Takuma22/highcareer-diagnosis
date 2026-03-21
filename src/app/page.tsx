"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useDiagnosisStore } from "@/store/diagnosisStore";
import { UserProfile } from "@/types/diagnosis";
import { useRouter } from "next/navigation";

const INDUSTRIES = [
  "IT・通信",
  "金融・保険",
  "製造・メーカー",
  "商社・卸売",
  "小売・流通",
  "医療・製薬",
  "コンサルティング",
  "広告・メディア",
  "不動産・建設",
  "公務員・教育",
  "その他",
];

const COMMON_SKILLS = [
  "Excel/スプレッドシート",
  "PowerPoint",
  "データ分析",
  "プロジェクト管理",
  "チームマネジメント",
  "英語（ビジネス）",
  "Python/プログラミング",
  "財務・会計",
  "マーケティング",
  "営業・BD",
  "SQL",
  "Tableau/BIツール",
];

export default function HomePage() {
  const router = useRouter();
  const { setUserProfile } = useDiagnosisStore();

  const [form, setForm] = useState({
    currentRole: "",
    yearsOfExperience: "",
    currentSalary: "",
    industry: "",
    skills: [] as string[],
    targetRole: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleSkill = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.currentRole.trim()) newErrors.currentRole = "現職・職種を入力してください";
    if (!form.yearsOfExperience) newErrors.yearsOfExperience = "経験年数を入力してください";
    if (!form.currentSalary) newErrors.currentSalary = "現在の年収を入力してください";
    if (!form.industry) newErrors.industry = "業界を選択してください";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const profile: UserProfile = {
      currentRole: form.currentRole,
      yearsOfExperience: parseInt(form.yearsOfExperience),
      currentSalary: parseInt(form.currentSalary),
      industry: form.industry,
      skills: form.skills,
      targetRole: form.targetRole || undefined,
    };

    setUserProfile(profile);
    router.push("/diagnosis");
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-2 mb-4">
            <span className="text-indigo-400 text-sm font-medium">コンサル転職診断</span>
            <span className="bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full">無料</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">
            <span className="gradient-text">ハイキャリア</span>
            <br />転職タイプ診断
          </h1>
          <p className="text-gray-400 text-lg">
            28問に答えて、あなたのコンサル適性と<br />
            年収ジャンプアップの可能性を無料診断
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-6 mt-6">
            {[
              { label: "診断タイプ", value: "16種類" },
              { label: "所要時間", value: "約5分" },
              { label: "AI分析", value: "あり" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-bold text-indigo-400">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="glass-card p-6 space-y-5"
        >
          <h2 className="text-lg font-semibold text-gray-200 mb-2">
            まず基本情報を教えてください
          </h2>

          {/* 現職・職種 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              現在の職種・役職 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.currentRole}
              onChange={(e) => setForm({ ...form, currentRole: e.target.value })}
              placeholder="例: 営業マネージャー、ITエンジニア"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
            />
            {errors.currentRole && (
              <p className="text-red-400 text-xs mt-1">{errors.currentRole}</p>
            )}
          </div>

          {/* 経験年数 + 年収 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                社会人経験年数 <span className="text-red-400">*</span>
              </label>
              <select
                value={form.yearsOfExperience}
                onChange={(e) => setForm({ ...form, yearsOfExperience: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="" className="bg-gray-900">選択</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((y) => (
                  <option key={y} value={y} className="bg-gray-900">
                    {y}年{y === 20 ? "以上" : ""}
                  </option>
                ))}
              </select>
              {errors.yearsOfExperience && (
                <p className="text-red-400 text-xs mt-1">{errors.yearsOfExperience}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                現在の年収 <span className="text-red-400">*</span>
              </label>
              <select
                value={form.currentSalary}
                onChange={(e) => setForm({ ...form, currentSalary: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="" className="bg-gray-900">選択</option>
                {[
                  { label: "~300万", value: 250 },
                  { label: "300~500万", value: 400 },
                  { label: "500~700万", value: 600 },
                  { label: "700~1000万", value: 850 },
                  { label: "1000~1500万", value: 1250 },
                  { label: "1500~2000万", value: 1750 },
                  { label: "2000~3000万", value: 2500 },
                  { label: "3000~5000万", value: 4000 },
                  { label: "5000~1億", value: 7500 },
                  { label: "1億~", value: 12000 },
                ].map((s) => (
                  <option key={s.value} value={s.value} className="bg-gray-900">
                    {s.label}
                  </option>
                ))}
              </select>
              {errors.currentSalary && (
                <p className="text-red-400 text-xs mt-1">{errors.currentSalary}</p>
              )}
            </div>
          </div>

          {/* 業界 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              現在の業界 <span className="text-red-400">*</span>
            </label>
            <select
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="" className="bg-gray-900">業界を選択</option>
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind} className="bg-gray-900">
                  {ind}
                </option>
              ))}
            </select>
            {errors.industry && (
              <p className="text-red-400 text-xs mt-1">{errors.industry}</p>
            )}
          </div>

          {/* スキル */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              保有スキル（複数選択可）
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_SKILLS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition ${
                    form.skills.includes(skill)
                      ? "bg-indigo-600 border-indigo-500 text-white"
                      : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* 希望職種（任意） */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              希望の転職先・職種
              <span className="text-gray-500 text-xs ml-2">（任意）</span>
            </label>
            <input
              type="text"
              value={form.targetRole}
              onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
              placeholder="例: 戦略コンサルタント、経営企画"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full gradient-bg text-white font-bold py-4 rounded-xl text-lg glow transition"
          >
            診断スタート →
          </motion.button>

          <p className="text-center text-xs text-gray-500">
            入力情報はAI診断のみに使用します。第三者への提供はありません。
          </p>
        </motion.form>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center text-xs text-gray-600"
        >
          コンサルチャンネル視聴者向け限定コンテンツ
        </motion.div>
      </div>
    </div>
  );
}
