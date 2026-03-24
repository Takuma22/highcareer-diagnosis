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
    currentSalary: "",
    industry: "",
    skills: [] as string[],
    otherSkills: "",
    targetRole: "",
    targetFirm: "",
    consultingExperience: "",
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
      currentSalary: parseInt(form.currentSalary),
      industry: form.industry,
      skills: form.skills,
      otherSkills: form.otherSkills || undefined,
      targetRole: form.targetRole || undefined,
      targetFirm: form.targetFirm || undefined,
      consultingExperience: form.consultingExperience || undefined,
    };

    setUserProfile(profile);
    router.push("/diagnosis");
  };

  return (
    <div className="min-h-screen bg-[#090b1a] relative overflow-hidden">
      {/* Background mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#e2b55a]/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-indigo-600/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-[#e2b55a]/6 rounded-full blur-[80px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-xl mx-auto px-4 pt-10 pb-16">
        {/* ===== HERO ===== */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-5">
            <span
              className="text-xs font-bold tracking-widest px-4 py-1.5 rounded-full border"
              style={{
                background: "rgba(226,181,90,0.12)",
                borderColor: "rgba(226,181,90,0.35)",
                color: "#e2b55a",
              }}
            >
              無料 AI 診断
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4 tracking-tight">
            <span className="text-white">あなたはコンサルで</span>
            <br />
            <span className="gradient-text">年収を最大化</span>
            <br />
            <span className="text-white">できますか？</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8 max-w-md mx-auto">
            28問・約5分のAI診断で、コンサル適性と<br className="hidden sm:block" />
            年収ジャンプアップの可能性を数値で可視化
          </p>

          {/* Stats row */}
          <div className="flex justify-center items-center gap-0 mb-2">
            {[
              { value: "8タイプ", label: "診断結果" },
              { value: "約5分", label: "所要時間" },
              { value: "AI分析", label: "年収予測付き" },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center">
                <div className="text-center px-5 py-2">
                  <div className="text-xl sm:text-2xl font-black gradient-text">{stat.value}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{stat.label}</div>
                </div>
                {i < 2 && (
                  <div className="w-px h-8 bg-white/10" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ===== FORM ===== */}
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          onSubmit={handleSubmit}
          className="glass-card p-6 sm:p-8 space-y-6"
        >
          {/* Form header */}
          <div className="flex items-center gap-3 pb-2 border-b border-white/6">
            <div className="w-1 h-6 gradient-bg rounded-full" />
            <h2 className="text-base font-bold text-white">基本情報を入力してください</h2>
          </div>

          {/* 現職・職種 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              現在の職種・役職
              <span className="ml-1.5 text-[10px] font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">必須</span>
            </label>
            <input
              type="text"
              value={form.currentRole}
              onChange={(e) => setForm({ ...form, currentRole: e.target.value })}
              placeholder="例: 営業マネージャー、ITエンジニア"
              className="form-input"
            />
            {errors.currentRole && (
              <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                <span>⚠</span> {errors.currentRole}
              </p>
            )}
          </div>

          {/* 年収 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              現在の年収
              <span className="ml-1.5 text-[10px] font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">必須</span>
            </label>
            <select
              value={form.currentSalary}
              onChange={(e) => setForm({ ...form, currentSalary: e.target.value })}
              className="form-input"
              style={{ appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
            >
              <option value="" className="bg-[#141728]">選択してください</option>
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
                <option key={s.value} value={s.value} className="bg-[#141728]">
                  {s.label}
                </option>
              ))}
            </select>
            {errors.currentSalary && (
              <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                <span>⚠</span> {errors.currentSalary}
              </p>
            )}
          </div>

          {/* 業界 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              現在の業界
              <span className="ml-1.5 text-[10px] font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">必須</span>
            </label>
            <select
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
              className="form-input"
              style={{ appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
            >
              <option value="" className="bg-[#141728]">業界を選択</option>
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind} className="bg-[#141728]">
                  {ind}
                </option>
              ))}
            </select>
            {errors.industry && (
              <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                <span>⚠</span> {errors.industry}
              </p>
            )}
          </div>

          {/* スキル */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              保有スキル
              <span className="ml-1.5 text-[10px] text-gray-500 font-normal">複数選択可</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_SKILLS.map((skill) => {
                const selected = form.skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-200 ${
                      selected
                        ? "border-[#e2b55a] text-[#e2b55a] font-medium"
                        : "bg-white/4 border-white/8 text-gray-400 hover:border-white/20 hover:text-gray-300"
                    }`}
                    style={selected ? { background: "rgba(226,181,90,0.1)" } : {}}
                  >
                    {selected && <span className="mr-1">✓</span>}
                    {skill}
                  </button>
                );
              })}
            </div>
            <div className="mt-3">
              <label className="block text-sm text-gray-400 mb-2">
                その他スキル・資格
                <span className="text-gray-600 text-xs ml-1">（任意）</span>
              </label>
              <input
                type="text"
                value={form.otherSkills}
                onChange={(e) => setForm({ ...form, otherSkills: e.target.value })}
                placeholder="例: PMP、中小企業診断士、TOEIC 900点"
                className="form-input text-sm"
              />
            </div>
          </div>

          {/* 任意フィールド群 */}
          <div className="space-y-4 pt-2 border-t border-white/6">
            <p className="text-xs text-gray-500">以下は任意入力（精度向上に役立ちます）</p>

            {/* 希望職種 */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                希望の転職先・職種
              </label>
              <input
                type="text"
                value={form.targetRole}
                onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                placeholder="例: 戦略コンサルタント、経営企画"
                className="form-input"
              />
            </div>

            {/* 志望ファーム */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                志望ファーム種別
              </label>
              <select
                value={form.targetFirm}
                onChange={(e) => setForm({ ...form, targetFirm: e.target.value })}
                className="form-input"
                style={{ appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
              >
                <option value="" className="bg-[#141728]">選択してください</option>
                {[
                  "戦略系（MBB等）",
                  "総合系（Big4等）",
                  "IT系（アクセンチュア等）",
                  "日系（ベイカレント・アビーム等）",
                  "FAS・財務系",
                  "特に決まっていない",
                ].map((f) => (
                  <option key={f} value={f} className="bg-[#141728]">{f}</option>
                ))}
              </select>
            </div>

            {/* コンサル経験 */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                コンサル経験
              </label>
              <select
                value={form.consultingExperience}
                onChange={(e) => setForm({ ...form, consultingExperience: e.target.value })}
                className="form-input"
                style={{ appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
              >
                <option value="" className="bg-[#141728]">選択してください</option>
                {["未経験", "1〜3年", "3年以上"].map((exp) => (
                  <option key={exp} value={exp} className="bg-[#141728]">{exp}</option>
                ))}
              </select>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 60px rgba(226,181,90,0.55)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full relative overflow-hidden btn-shimmer text-[#0d0d1a] font-black py-4 sm:py-5 rounded-2xl text-lg sm:text-xl tracking-wide"
              style={{ boxShadow: "0 0 40px rgba(226,181,90,0.4), 0 4px 24px rgba(226,181,90,0.25)" }}
            >
              診断スタート →
            </motion.button>
            <p className="text-center text-xs text-gray-600 mt-3">
              入力情報はAI診断のみに使用。第三者への提供はありません。
            </p>
          </div>
        </motion.form>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center items-center gap-6 mt-6 text-xs text-gray-600"
        >
          <span className="flex items-center gap-1.5">
            <span style={{ color: "#e2b55a" }}>✓</span> 完全無料
          </span>
          <span className="flex items-center gap-1.5">
            <span style={{ color: "#e2b55a" }}>✓</span> メール登録不要
          </span>
          <span className="flex items-center gap-1.5">
            <span style={{ color: "#e2b55a" }}>✓</span> 即時結果表示
          </span>
        </motion.div>
      </div>
    </div>
  );
}
